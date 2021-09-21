import {
  Contract as MultiCallContract,
  Provider as MultiCallProvider,
} from "ethcall";
import SafeAppsSDK from "@gnosis.pm/safe-apps-sdk";
import {
  CONTRACT_ADDRESSES,
  getModuleInstance,
  KnownModules,
} from "@gnosis.pm/zodiac";
import { getModuleData } from "../../utils/contracts";
import {
  DataDecoded,
  DecodedTransaction,
  DelayModule,
  Module,
  MODULE_TYPES,
  ModuleMetadata,
  ModuleOperation,
  ModuleType,
  MultiSendDataDecoded,
  PendingModule,
  RealityModule,
  SafeTransaction,
} from "./models";
import { Contract, ethers } from "ethers";
import { defaultProvider } from "../../services/helpers";
import { getProvider } from "../../services";

export const AddressOne = "0x0000000000000000000000000000000000000001";

export function isDelayModule(module: Module): module is DelayModule {
  return module.type === ModuleType.DELAY;
}

export function isRealityModule(module: Module): module is RealityModule {
  return (
    module.type === ModuleType.REALITY_ETH ||
    module.type === ModuleType.REALITY_ERC20
  );
}

export const sanitizeModule = async (
  moduleAddress: string,
  sdk: SafeAppsSDK,
  chainId: number,
  parentModule: string
): Promise<Module> => {
  const module = await getModuleData(sdk, chainId, moduleAddress);

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
    owner,
    subModules,
    id: moduleAddress,
    name: module.name,
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
  const provider = getProvider(chainId);
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
    console.warn("Error fetching delay module", error);
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

export function getContractsModuleType(
  chainId: number,
  contractAddress: string
): ModuleType {
  const contractAddresses = CONTRACT_ADDRESSES[chainId];
  if (!contractAddresses) return ModuleType.UNKNOWN;
  const entry = Object.entries(contractAddresses).find(
    ([, contract]) => contract === contractAddress
  );
  if (!entry) return ModuleType.UNKNOWN;
  return MODULE_TYPES[entry[0] as keyof KnownModules] || ModuleType.UNKNOWN;
}

/**
 * Determine if the safe transaction is a pending add module transaction.
 *
 * @param {object} safeTransaction - Safe Transaction.
 * @param {number} chainId - Chain Id.
 */
export function getAddModuleTransactionModuleType(
  safeTransaction: SafeTransaction,
  chainId: number
): ModuleType | undefined {
  const factoryAddress = CONTRACT_ADDRESSES[chainId]?.factory || "";
  const transactions = getTransactionsFromSafeTransaction(safeTransaction);

  const masterCopyAddress = transactions
    .map((transaction): string | undefined => {
      if (transaction.to.toLowerCase() === factoryAddress.toLowerCase()) {
        if (!transaction.dataDecoded) {
          // Decode Proxy Factory data locally
          try {
            const result = decodeProxyFactoryTransaction(transaction.data);
            return result[0]; // return first parameter (masterCopy)
          } catch (err) {
            console.warn(
              "failed to decode proxy factory transaction: ",
              transaction.data
            );
            return undefined;
          }
        }

        if (transaction.dataDecoded.method === "deployModule") {
          const param = transaction.dataDecoded.parameters?.find(
            (param) => param.name === "masterCopy"
          );
          if (param) return param.value;
        }
      }
      return undefined;
    })
    .find((x) => x);

  return getContractsModuleType(chainId, masterCopyAddress || "");
}

const MODULE_PROXY_FACTORY_ABI = [
  "function deployModule(address masterCopy, bytes initializer, uint256 saltNonce) returns (address proxy)",
];

function decodeProxyFactoryTransaction(data: string) {
  return new ethers.utils.Interface(
    MODULE_PROXY_FACTORY_ABI
  ).decodeFunctionData("deployModule", data);
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
  return (
    transaction.dataDecoded &&
    transaction.dataDecoded.method === "disableModule"
  );
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
      const moduleAddress = param && param.value ? param.value : "";
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

function getModuleTypeForAddTransactions(
  transactions: SafeTransaction[],
  chainId: number
): Record<string, ModuleType> {
  return transactions
    .map((safeTransaction) => {
      const enableModuleTx = getTransactionsFromSafeTransaction(safeTransaction)
        .reverse()
        .find(isSafeEnableModuleTransactionPending);

      if (!enableModuleTx) return undefined;

      const type = getAddModuleTransactionModuleType(safeTransaction, chainId);
      const param = enableModuleTx.dataDecoded.parameters?.find(
        (param) => param.name === "module"
      );
      const moduleExpectedAddress = param?.value;
      if (!type || !moduleExpectedAddress) return undefined;
      return { address: moduleExpectedAddress, type };
    })
    .reduce((obj, value) => {
      if (value)
        return {
          ...obj,
          [value.address]: value.type,
        };
      return obj;
    }, {});
}

export function getPendingModulesToEnable(
  transactions: SafeTransaction[],
  chainId: number
): PendingModule[] {
  const modulesTypesByContractAddress = getModuleTypeForAddTransactions(
    transactions,
    chainId
  );

  return transactions
    .flatMap(getTransactionsFromSafeTransaction)
    .filter((transaction) => isSafeEnableModuleTransactionPending(transaction))
    .map((transaction): PendingModule => {
      const moduleAddress: string =
        transaction.dataDecoded.parameters[0].value || "";
      const moduleType =
        modulesTypesByContractAddress[moduleAddress] || ModuleType.UNKNOWN;
      return {
        address: moduleAddress,
        executor: transaction.to,
        module: moduleType,
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
