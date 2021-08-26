import {
  Contract as MultiCallContract,
  Provider as MultiCallProvider,
} from "ethcall";
import SafeAppsSDK from "@gnosis.pm/safe-apps-sdk";
import { InfuraProvider } from "@ethersproject/providers";
import {
  ContractAddresses,
  getFactoryContractAddress,
  getModuleContractAddress,
  getModuleInstance,
} from "@gnosis/module-factory";
import { getModuleDataFromEtherscan } from "../../utils/contracts";
import {
  DaoModule,
  DataDecoded,
  DecodedTransaction,
  DelayModule,
  Module,
  ModuleMetadata,
  ModuleOperation,
  ModuleType,
  MultiSendDataDecoded,
  PendingModule,
  SafeTransaction,
} from "./models";
import { Contract } from "ethers";
import { defaultProvider } from "../../services/helpers";

export const AddressOne = "0x0000000000000000000000000000000000000001";

export function isDelayModule(module: Module): module is DelayModule {
  return module.type === ModuleType.DELAY;
}

export function isDaoModule(module: Module): module is DaoModule {
  return module.type === ModuleType.DAO;
}

export const sanitizeModule = async (
  moduleAddress: string,
  sdk: SafeAppsSDK,
  chainId: number,
  parentModule: string
): Promise<Module> => {
  const module = await getModuleDataFromEtherscan(sdk, chainId, moduleAddress);
  let name = module.name;

  if (module.type === ModuleType.DELAY) {
    return await fetchDelayModule(moduleAddress, sdk, chainId, parentModule);
  }

  const subModules = await fetchSubModules(
    moduleAddress,
    module.abi,
    sdk,
    chainId
  );

  const owner = await fetchModuleOwner(moduleAddress, module.abi);

  return {
    name,
    owner,
    subModules,
    id: moduleAddress,
    type: module.type,
    address: moduleAddress,
    parentModule: parentModule,
  };
};

export async function fetchDelayModule(
  address: string,
  sdk: SafeAppsSDK,
  chainId: number,
  parentModule: string
): Promise<DelayModule | Module> {
  const provider = new InfuraProvider(chainId, process.env.REACT_APP_INFURA_ID);
  const delayModule = await getModuleInstance("delay", address, provider);
  const abi = delayModule.interface.fragments.map((frag) => frag);

  try {
    const moduleContract = new MultiCallContract(delayModule.address, abi);

    const ethCallProvider = new MultiCallProvider();
    await ethCallProvider.init(provider);

    const txCooldown = moduleContract.txCooldown();
    const txExpiration = moduleContract.txExpiration();
    const modules = moduleContract.getModulesPaginated(AddressOne, 50);

    let [cooldown, expiration, [subModules]] = await ethCallProvider.all([
      txCooldown,
      txExpiration,
      modules,
    ]);

    if (subModules) {
      const requests = (subModules as string[]).map(
        async (moduleAddress, index): Promise<Module> => {
          const subModule = await sanitizeModule(
            moduleAddress,
            sdk,
            chainId,
            parentModule
          );
          return {
            ...subModule,
            id: `${address}_${moduleAddress}_${index}`,
            parentModule: address,
          };
        }
      );
      requests.reverse();
      subModules = await Promise.all(requests);
    }

    const owner = await fetchModuleOwner(address, abi);

    return {
      owner,
      address,
      parentModule,
      id: address,
      name: "Delay Module",
      type: ModuleType.DELAY,
      subModules: subModules || [],
      expiration: expiration.toString(),
      cooldown: cooldown.toString(),
    };
  } catch (error) {
    console.log("Error fetching delay module", error);
    return {
      address,
      parentModule,
      id: address,
      name: "Delay Module",
      type: ModuleType.UNKNOWN,
      subModules: [],
    };
  }
}

export async function fetchSubModules(
  moduleAddress: string,
  abi: ModuleMetadata["abi"],
  sdk: SafeAppsSDK,
  chainId: number
): Promise<Module[]> {
  try {
    if (!abi) return [];
    const contract = new Contract(moduleAddress, abi, defaultProvider);
    contract.interface.getFunction("getModulesPaginated(address,uint256)");
    const [subModules] = await contract.getModulesPaginated(AddressOne, 50);
    return await Promise.all(
      subModules.map(async (subModuleAddress: string, index: number) => {
        const subModule = await sanitizeModule(
          subModuleAddress,
          sdk,
          chainId,
          moduleAddress
        );
        return {
          ...subModule,
          id: `${moduleAddress}_${subModuleAddress}_${index}`,
          parentModule: moduleAddress,
        };
      })
    );
  } catch (e) {
    return [];
  }
}

export async function fetchModuleOwner(
  moduleAddress: string,
  abi: ModuleMetadata["abi"]
): Promise<string | undefined> {
  try {
    if (!abi) return undefined;
    const contract = new Contract(moduleAddress, abi, defaultProvider);
    contract.interface.getFunction("owner()");
    return await contract.owner();
  } catch (e) {
    return undefined;
  }
}

export function isMultiSendDataEncoded(
  dataEncoded: DataDecoded
): dataEncoded is MultiSendDataDecoded {
  return dataEncoded.method === "multiSend";
}

export function getTransactionsFromSafeTransaction(
  safeTransaction: SafeTransaction
): DecodedTransaction[] {
  if (
    safeTransaction.dataDecoded &&
    isMultiSendDataEncoded(safeTransaction.dataDecoded)
  ) {
    return safeTransaction.dataDecoded.parameters[0].valueDecoded;
  }
  return [safeTransaction];
}

/**
 * Determine if the safe transaction is a pending add module transaction.
 *
 * @param {object} safeTransaction - Safe Transaction.
 * @param {number} chainId - Chain Id.
 * @param {string} module - Module Name.
 */
export function getAddModuleTransactionPending(
  safeTransaction: SafeTransaction,
  chainId: number,
  module: keyof ContractAddresses
): string[] {
  const moduleFactoryContractAddress = getFactoryContractAddress(chainId);
  const masterContractAddress = getModuleContractAddress(chainId, module);

  const transactions = getTransactionsFromSafeTransaction(safeTransaction);

  const deploysModule = transactions.some(
    (transaction) =>
      transaction.to.toLowerCase() ===
        moduleFactoryContractAddress.toLowerCase() &&
      transaction.dataDecoded &&
      transaction.dataDecoded.method === "deployModule" &&
      transaction.dataDecoded.parameters.some(
        (param) =>
          param.name === "masterCopy" &&
          param.value.toLowerCase() === masterContractAddress.toLowerCase()
      )
  );

  if (!deploysModule) {
    return [];
  }

  return transactions
    .filter((tx) => isSafeEnableModuleTransactionPending(tx))
    .map((tx) => {
      const param = tx.dataDecoded.parameters.find(
        (param) => param.name === "module"
      );
      return param.value;
    });
}

export function isSafeEnableModuleTransactionPending(
  transaction: DecodedTransaction
) {
  return (
    transaction.dataDecoded && transaction.dataDecoded.method === "enableModule"
  );
}

/**
 * Determine if the safe transaction is a pending remove module transaction.
 *
 * @param {object} transaction - Transaction.
 */
export function isRemoveModuleTransactionPending(
  transaction: DecodedTransaction
): boolean {
  return transaction.dataDecoded.method === "disableModule";
}

export function getModulesToBeRemoved(
  modules: Module[],
  transactions: SafeTransaction[]
): PendingModule[] {
  return transactions
    .flatMap(getTransactionsFromSafeTransaction)
    .filter(isRemoveModuleTransactionPending)
    .map((transaction) => {
      const param = transaction.dataDecoded.parameters.find(
        (param) => param.name === "module"
      );
      const moduleAddress = param ? param.value : "";
      const current = modules.find(
        (module) => module.address === moduleAddress
      );
      return {
        address: moduleAddress,
        executor: transaction.to,
        operation: ModuleOperation.REMOVE,
        module: current ? current.type : ModuleType.UNKNOWN,
      };
    });
}

export function getPendingModulesToEnable(
  transactions: SafeTransaction[],
  chainId: number
): PendingModule[] {
  const daoModuleTxPending = transactions.flatMap((safeTransaction) =>
    getAddModuleTransactionPending(safeTransaction, chainId, "dao")
  );
  const delayModuleTxPending = transactions.flatMap((safeTransaction) =>
    getAddModuleTransactionPending(safeTransaction, chainId, "delay")
  );
  return transactions
    .flatMap(getTransactionsFromSafeTransaction)
    .filter((transaction) => isSafeEnableModuleTransactionPending(transaction))
    .map((transaction): PendingModule => {
      const moduleAddress: string = transaction.dataDecoded.parameters[0].value;
      if (daoModuleTxPending.includes(moduleAddress))
        return {
          address: moduleAddress,
          executor: transaction.to,
          module: ModuleType.DAO,
          operation: ModuleOperation.CREATE,
        };

      if (delayModuleTxPending.includes(moduleAddress))
        return {
          address: moduleAddress,
          executor: transaction.to,
          module: ModuleType.DELAY,
          operation: ModuleOperation.CREATE,
        };

      return {
        address: moduleAddress,
        executor: transaction.to,
        module: ModuleType.UNKNOWN,
        operation: ModuleOperation.CREATE,
      };
    });
}

export function isModule(module: PendingModule | Module): module is Module {
  return "subModules" in module;
}

export function flatAllModules(modules: Module[]): Module[] {
  const subModules = modules.flatMap((module) =>
    flatAllModules(module.subModules)
  );
  return [...modules, ...subModules];
}

export function isPendingModule(module: Module, pendingModule: PendingModule) {
  return (
    pendingModule.address === module.address &&
    pendingModule.executor === module.parentModule
  );
}
