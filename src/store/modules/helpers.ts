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
  DisableModuleDataDecoded,
  Module,
  ModuleType,
  MultiSendDataDecoded,
  SafeTransaction,
} from "./models";

export const AddressOne = "0x0000000000000000000000000000000000000001";

export function isDelayModule(module: Module): module is DelayModule {
  return module.type === ModuleType.DELAY;
}

export function isDaoModule(module: Module): module is DaoModule {
  return module.type === ModuleType.DAO;
}

export const sanitizeModule = async (
  moduleAddress: string,
  safe: SafeAppsSDK,
  chainId: number
): Promise<Module> => {
  const module = await getModuleDataFromEtherscan(safe, chainId, moduleAddress);
  let name = module.name;

  if (module.type === ModuleType.DELAY) {
    return await fetchDelayModule(moduleAddress, safe, chainId);
  }

  return {
    name,
    type: module.type,
    address: moduleAddress,
  };
};

export async function fetchDelayModule(
  address: string,
  safe: SafeAppsSDK,
  chainId: number
): Promise<DelayModule | Module> {
  const provider = new InfuraProvider(chainId, process.env.REACT_APP_INFURA_ID);
  const delayModule = await getModuleInstance("delay", address, provider);

  try {
    const module = new MultiCallContract(
      delayModule.address,
      delayModule.interface.fragments.map((frag) => frag)
    );

    const ethCallProvider = new MultiCallProvider();
    await ethCallProvider.init(provider);

    const txCooldown = module.txCooldown();
    const txTimeout = module.txExpiration();
    const modules = module.getModulesPaginated(AddressOne, 10);

    let [cooldown, timeout, [subModules]] = await ethCallProvider.all([
      txCooldown,
      txTimeout,
      modules,
    ]);

    if (subModules) {
      const requests = subModules.map((moduleAddress: string) =>
        sanitizeModule(moduleAddress, safe, chainId)
      );
      requests.reverse();
      subModules = await Promise.all(requests);
    }

    return {
      name: "Delay Module",
      type: ModuleType.DELAY,
      address,
      subModules,
      timeout: timeout.toString(),
      cooldown: cooldown.toString(),
    };
  } catch (error) {
    console.log("Error fetching delay module", error);
    return {
      name: "Delay Module",
      type: ModuleType.UNKNOWN,
      address: address,
    };
  }
}

export function isMultiSendDataEncoded(
  dataEncoded: DataDecoded
): dataEncoded is MultiSendDataDecoded {
  return dataEncoded.method === "multiSend";
}

export function isDisableModuleDataEncoded(
  dataEncoded: DataDecoded
): dataEncoded is DisableModuleDataDecoded {
  return dataEncoded.method === "disableModule";
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
 * @param {string} safeAddress - Safe Address.
 */
export function isRemoveModuleTransactionPending(
  transaction: DecodedTransaction,
  safeAddress: string
): boolean {
  return (
    transaction.to.toLowerCase() === safeAddress.toLowerCase() &&
    isDisableModuleDataEncoded(transaction.dataDecoded)
  );
}

export function getModulesToBeRemoved(
  transactions: SafeTransaction[],
  safeAddress: string
): string[] {
  return transactions
    .flatMap(getTransactionsFromSafeTransaction)
    .filter((transaction) =>
      isRemoveModuleTransactionPending(transaction, safeAddress)
    )
    .map((transaction) => {
      const param = transaction.dataDecoded.parameters.find(
        (param) => param.name === "module"
      );
      if (!param) return "";
      return param.value;
    });
}

export function getPendingModulesToEnable(
  transactions: SafeTransaction[],
  safeAddress: string,
  chainId: number
): ModuleType[] {
  const daoModuleTxPending = transactions.flatMap((safeTransaction) =>
    getAddModuleTransactionPending(safeTransaction, chainId, "dao")
  );
  const delayModuleTxPending = transactions.flatMap((safeTransaction) =>
    getAddModuleTransactionPending(safeTransaction, chainId, "delay")
  );
  const moduleTxPending = transactions
    .flatMap(getTransactionsFromSafeTransaction)
    .filter((transaction) => isSafeEnableModuleTransactionPending(transaction))
    .map((transaction): string => transaction.dataDecoded.parameters[0].value);

  return moduleTxPending.map((moduleAddress) => {
    if (daoModuleTxPending.includes(moduleAddress)) return ModuleType.DAO;
    if (delayModuleTxPending.includes(moduleAddress)) return ModuleType.DELAY;
    return ModuleType.UNKNOWN;
  });
}
