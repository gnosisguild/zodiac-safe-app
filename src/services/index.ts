import { Contract } from "ethers";
import { deployAndSetUpModule } from "@gnosis/module-factory"
import {
  AddressOne,
  buildTransaction,
  SafeAbi,
  defaultProvider,
  DEFAULT_ORACLE_ADDRESSES,
} from "./helpers";

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

// const MODULE_ATTRIBUTES = {
//   dao: {
//     executor: "executor",
//     oracle: "oracle",
//     timeout: "timeout",
//     bond: "bond",
//     templateId: "templateId",
//     cooldown: "cooldown",
//     expiration: "expiration",
//   },
//   amb: {
//     executor: "executor",
//     amb: "amb",
//     owner: "owner",
//     chainId: "chainId",
//   },
//   delay: {
//     cooldown: "cooldown",
//     expiration: "expiration",
//   },
// };

type KnownModules = keyof typeof MODULE_METHODS;
// type KnownAttributes = keyof typeof MODULE_ATTRIBUTES;

interface DaoModuleParams extends DelayModuleParams {
  executor: string;
  oracle: string;
  timeout: number;
  bond: number;
  templateId: number;
}

interface AmbModuleParams {
  executor: string;
  amb: string;
  owner: string;
  chainId: string;
}

interface DelayModuleParams {
  cooldown: number;
  expiration: number;
}

type ModuleParams = DelayModuleParams | AmbModuleParams | DaoModuleParams;

type KnownSetterMethods<T extends KnownModules> =
  keyof typeof MODULE_METHODS[T];

// type ModuleAttributes<T extends KnownAttributes> =
//   keyof typeof MODULE_ATTRIBUTES[T];

export async function createAndAddModule(
  module: KnownModules,
  args: ModuleParams,
  safeAddress: string
) {
  switch (module) {
    case "dao":
      const { chainId: id } = await defaultProvider.getNetwork();
      const { timeout, cooldown, expiration, bond, templateId, oracle } = args as DaoModuleParams;
      const ORACLE_ADDRESS = oracle || DEFAULT_ORACLE_ADDRESSES[id];
      const { transaction: deploymentTransaction, expectedModuleAddress } = await deployAndSetUpModule(
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
          id
        );

      const enableModuleTransaction = await enableModule(
        safeAddress,
        expectedModuleAddress
      );

      return [deploymentTransaction, enableModuleTransaction];

    case "amb":
      const { executor, amb, owner, chainId } = args as AmbModuleParams;
    case "delay":
      const { cooldown: txCooldown, expiration: txExpiration } =
        args as DelayModuleParams;
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

// export async function editModule<Module extends KnownModules>(
//   module: Module,
//   address: string,
//   methods: Partial<Record<KnownSetterMethods<Module>, string>>
// ) {
//   // Add validation to check if module is indeed added
//   const methodsName = Object.keys(methods);
//   if (!methodsName.length) {
//     throw new Error("At least one method must be provided");
//   }

//   let contract: Contract;
//   switch (module) {
//     case "dao":
//       contract = new Contract(address, DaoModuleAbi, defaultProvider);
//       break;
//     case "amb":
//       contract = new Contract(address, AmbModuleAbi, defaultProvider);
//       break;
//   }

//   const formattedTransactions = methodsName.map((m: string) =>
//     //@ts-ignore
//     buildTransaction(contract, m, [methods[m]])
//   );

//   return formattedTransactions;
// }

export const callContract = (
  address: string,
  abi: string | string[],
  method: string,
  data: (string | string[])[] = []
) => {
  const contract = new Contract(address, abi, defaultProvider);
  return contract.functions[method](...data);
};
