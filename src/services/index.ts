import { Contract } from "ethers";
import { deployAndSetUpModule, getModule } from "@gnosis/module-factory";
import { formatBytes32String } from "ethers/lib/utils";
import {
  AddressOne,
  buildTransaction,
  SafeAbi,
  defaultProvider,
  DEFAULT_ORACLE_ADDRESSES,
} from "./helpers";
import { ContractInterface } from "@ethersproject/contracts";

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
  oracle: string;
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

type ModuleParams = DelayModuleParams | AmbModuleParams | DaoModuleParams;

type KnownMethods<T extends KnownModules> = keyof typeof MODULE_METHODS[T];

export async function createAndAddModule(
  module: KnownModules,
  args: ModuleParams,
  safeAddress: string
) {
  const { chainId } = await defaultProvider.getNetwork();
  switch (module) {
    case "dao":
      const { timeout, cooldown, expiration, bond, templateId, oracle } =
        args as DaoModuleParams;
      const ORACLE_ADDRESS = oracle || DEFAULT_ORACLE_ADDRESSES[chainId];
      let {
        transaction: daoModuleDeploymentTx,
        expectedModuleAddress: daoModuleExpectedAddress,
      } = await deployAndSetUpModule(
        module,
        [
          safeAddress,
          ORACLE_ADDRESS,
          timeout,
          cooldown,
          expiration,
          bond,
          templateId,
        ],
        defaultProvider,
        chainId
      );

      const enableDaoModuleTransaction = await enableModule(
        safeAddress,
        daoModuleExpectedAddress
      );

      return [daoModuleDeploymentTx, enableDaoModuleTransaction];

    case "amb":
      const { amb, owner } = args as AmbModuleParams;

      const id = formatBytes32String(chainId.toString());
      const {
        transaction: ambModuleDeploymentTx,
        expectedModuleAddress: ambModuleExpectedAddress,
      } = await deployAndSetUpModule(
        module,
        [owner, amb, safeAddress, id],
        defaultProvider,
        chainId
      );

      const enableAmbModuleTransaction = await enableModule(
        safeAddress,
        ambModuleExpectedAddress
      );

      return [ambModuleDeploymentTx, enableAmbModuleTransaction];

    case "delay":
      const { txCooldown, txExpiration } = args as DelayModuleParams;
      const {
        transaction: delayModuleDeploymentTx,
        expectedModuleAddress: delayModuleExpectedAddress,
      } = await deployAndSetUpModule(
        module,
        [safeAddress, txCooldown, txExpiration],
        defaultProvider,
        chainId
      );
      const enableDelayModuleTransaction = await enableModule(
        safeAddress,
        delayModuleExpectedAddress
      );
      return [delayModuleDeploymentTx, enableDelayModuleTransaction];
  }
}

export async function fetchModules(safeAddress: string) {
  const safe = new Contract(safeAddress, SafeAbi, defaultProvider);
  const [modules] = await safe.getModulesPaginated(AddressOne, 10);
  return modules;
}

export async function enableModule(safeAddress: string, module: string) {
  const safe = new Contract(safeAddress, SafeAbi, defaultProvider);
  return buildTransaction(safe, "enableModule", [module]);
}

export async function disableModule(safeAddress: string, module: string) {
  const modules: string[] = await fetchModules(safeAddress);
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
  const methodsName = Object.keys(methods);
  if (!methodsName.length) {
    throw new Error("At least one method must be provided");
  }

  const module = getModule(moduleName, address, defaultProvider);

  const formattedTransactions = methodsName.map((m: string) =>
    //@ts-ignore
    buildTransaction(module, m, [methods[m]])
  );

  return formattedTransactions;
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
