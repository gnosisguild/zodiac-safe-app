import { Contract } from "ethers";
import {
  deployAndSetUpModule,
  getModuleInstance,
} from "@gnosis/module-factory";
import { formatBytes32String } from "ethers/lib/utils";
import {
  AddressOne,
  buildTransaction,
  DEFAULT_ORACLE_ADDRESSES,
  defaultProvider,
  SafeAbi,
} from "./helpers";
import { ContractInterface } from "@ethersproject/contracts";
import { Transaction } from "@gnosis.pm/safe-apps-sdk";
import { getNetworkExplorerInfo } from "../utils/explorers";
import { SafeInfo, SafeTransaction } from "../store/modules/models";

const MODULE_METHODS = {
  dao: {
    setArbitrator: "setArbitrator",
    setQuestionTimeout: "setQuestionTimeout",
    setQuestionCooldown: "setQuestionCooldown",
    setMinimumBond: "setMinimumBond",
    setTemplate: "setTemplate",
    setAnswerExpiration: "setAnswerExpiration",
  },
  amb: {
    setAmb: "setAmb",
    setChainId: "setChainId",
    setOwner: "setOwner",
  },
  delay: {
    setTxCooldown: "setTxCooldown",
    setTxExpiration: "setTxExpiration",
  },
};

type KnownModules = keyof typeof MODULE_METHODS;

interface DaoModuleParams {
  executor: string;
  oracle?: string;
  timeout: number;
  bond: number;
  templateId: number;
  cooldown: number;
  expiration: number;
}

interface AmbModuleParams {
  amb: string;
  owner: string;
}

interface DelayModuleParams {
  txCooldown: number;
  txExpiration: number;
}

type ModuleParams = {
  delay: DelayModuleParams;
  amb: AmbModuleParams;
  dao: DaoModuleParams;
};

type KnownMethods<T extends KnownModules> = keyof typeof MODULE_METHODS[T];

export async function createAndAddModule<
  Module extends KnownModules,
  Arg = ModuleParams[Module]
>(
  module: Module,
  args: Arg,
  safeAddress: string,
  subModule?: string
): Promise<Transaction[]> {
  const { chainId } = await defaultProvider.getNetwork();
  switch (module) {
    case "dao":
      const { timeout, cooldown, expiration, bond, templateId, oracle } =
        args as unknown as DaoModuleParams;
      const ORACLE_ADDRESS = oracle || DEFAULT_ORACLE_ADDRESSES[chainId];
      let {
        transaction: daoModuleDeploymentTx,
        expectedModuleAddress: daoModuleExpectedAddress,
      } = await deployAndSetUpModule(
        module,
        [
          subModule || safeAddress,
          ORACLE_ADDRESS,
          timeout,
          cooldown,
          expiration,
          bond,
          templateId,
        ],
        defaultProvider,
        chainId,
        Date.now().toString()
      );

      const daoModuleTransactions = [daoModuleDeploymentTx];

      if (subModule) {
        const delayModule = getModuleInstance(
          "delay",
          subModule,
          defaultProvider
        );
        const addModuleTransaction = buildTransaction(
          delayModule,
          "enableModule",
          [daoModuleExpectedAddress]
        );

        daoModuleTransactions.push(addModuleTransaction);
      } else {
        const enableDaoModuleTransaction = enableModule(
          safeAddress,
          daoModuleExpectedAddress
        );
        daoModuleTransactions.push(enableDaoModuleTransaction);
      }

      return daoModuleTransactions;

    case "amb":
      const { amb, owner } = args as unknown as AmbModuleParams;

      const id = formatBytes32String(chainId.toString());
      const {
        transaction: ambModuleDeploymentTx,
        expectedModuleAddress: ambModuleExpectedAddress,
      } = await deployAndSetUpModule(
        module,
        [owner, amb, safeAddress, id],
        defaultProvider,
        chainId,
        Date.now().toString()
      );

      const ambModuleTransactions = [ambModuleDeploymentTx];

      if (subModule) {
        const delayModule = getModuleInstance(
          "delay",
          subModule,
          defaultProvider
        );
        const addModuleTransaction = buildTransaction(
          delayModule,
          "enableModule",
          [ambModuleExpectedAddress]
        );

        ambModuleTransactions.push(addModuleTransaction);
      } else {
        const enableDaoModuleTransaction = enableModule(
          safeAddress,
          ambModuleExpectedAddress
        );
        ambModuleTransactions.push(enableDaoModuleTransaction);
      }

      return ambModuleTransactions;

    case "delay":
      const { txCooldown, txExpiration } = args as unknown as DelayModuleParams;
      const {
        transaction: delayModuleDeploymentTx,
        expectedModuleAddress: delayModuleExpectedAddress,
      } = await deployAndSetUpModule(
        module,
        [safeAddress, txCooldown, txExpiration],
        defaultProvider,
        chainId,
        Date.now().toString()
      );
      const enableDelayModuleTransaction = enableModule(
        safeAddress,
        delayModuleExpectedAddress
      );

      const delayTransactions = [
        delayModuleDeploymentTx,
        enableDelayModuleTransaction,
      ];

      if (subModule) {
        const delayModule = getModuleInstance(
          "delay",
          delayModuleExpectedAddress,
          defaultProvider
        );
        const enableDaoModuleTx = buildTransaction(
          delayModule,
          "enableModule",
          [subModule]
        );
        const disableModuleOnSafeTx = await disableModule(
          safeAddress,
          subModule
        );
        delayTransactions.push(enableDaoModuleTx);
        delayTransactions.push(disableModuleOnSafeTx);
      }
      return delayTransactions;
  }

  throw new Error("Invalid module");
}

export async function fetchSafeModulesAddress(safeAddress: string) {
  const safe = new Contract(safeAddress, SafeAbi, defaultProvider);
  const [modules] = await safe.getModulesPaginated(AddressOne, 50);
  return modules as string[];
}

export function enableModule(safeAddress: string, module: string) {
  const safe = new Contract(safeAddress, SafeAbi, defaultProvider);
  return buildTransaction(safe, "enableModule", [module]);
}

export async function disableModule(safeAddress: string, module: string) {
  const modules = await fetchSafeModulesAddress(safeAddress);
  if (!modules.length) throw new Error("Safe does not have enabled modules");
  let prevModule = AddressOne;
  const safe = new Contract(safeAddress, SafeAbi, defaultProvider);
  if (modules.length > 1) {
    const moduleIndex = modules.findIndex(
      (m) => m.toLowerCase() === module.toLowerCase()
    );
    if (moduleIndex > 0) prevModule = modules[moduleIndex - 1];
  }
  const params = [prevModule, module];
  return {
    params,
    ...buildTransaction(safe, "disableModule", params),
  };
}

export async function editModule<Module extends KnownModules>(
  moduleName: Module,
  address: string,
  methods: Partial<Record<KnownMethods<Module>, string>>
) {
  // Add validation to check if module is indeed added
  const methodsName = Object.keys(methods) as Array<keyof typeof methods>;
  if (!methodsName.length) {
    throw new Error("At least one method must be provided");
  }

  const module = getModuleInstance(moduleName, address, defaultProvider);

  return methodsName.map((method) =>
    buildTransaction(module, method as string, [methods[method]])
  );
}

export const callContract = (
  address: string,
  abi: ContractInterface,
  method: string,
  data: any[] = []
) => {
  const contract = new Contract(address, abi, defaultProvider);
  return contract.functions[method](...data);
};

export async function fetchSafeTransactions(
  chainId: number,
  safeAddress: string,
  params: Record<string, string>
) {
  const network = getNetworkExplorerInfo(chainId);
  if (!network) return [];

  const url = new URL(
    `api/v1/safes/${safeAddress}/transactions`,
    network.safeTransactionApi
  );

  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.set(key, value)
  );

  const request = await fetch(url.toString());
  const response = await request.json();

  return response.results as SafeTransaction[];
}

export async function fetchSafeInfo(chainId: number, safeAddress: string) {
  const network = getNetworkExplorerInfo(chainId);
  if (!network) throw new Error("invalid network");

  const url = new URL(
    `api/v1/safes/${safeAddress}`,
    network.safeTransactionApi
  );

  const request = await fetch(url.toString());
  const response = await request.json();
  return response as SafeInfo;
}
