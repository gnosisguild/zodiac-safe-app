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

      const transactions = [daoModuleDeploymentTx];

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

        transactions.push(addModuleTransaction);
      } else {
        const enableDaoModuleTransaction = await enableModule(
          safeAddress,
          daoModuleExpectedAddress
        );
        transactions.push(enableDaoModuleTransaction);
      }

      return transactions;

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

      const enableAmbModuleTransaction = await enableModule(
        safeAddress,
        ambModuleExpectedAddress
      );

      return [ambModuleDeploymentTx, enableAmbModuleTransaction];

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
      const enableDelayModuleTransaction = await enableModule(
        safeAddress,
        delayModuleExpectedAddress
      );
      return [delayModuleDeploymentTx, enableDelayModuleTransaction];
  }

  throw new Error("Invalid module");
}

export async function fetchSafeModulesAddress(safeAddress: string) {
  const safe = new Contract(safeAddress, SafeAbi, defaultProvider);
  const [modules] = await safe.getModulesPaginated(AddressOne, 10);
  return modules as string[];
}

export async function enableModule(safeAddress: string, module: string) {
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
  return buildTransaction(safe, "disableModule", [prevModule, module]);
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
