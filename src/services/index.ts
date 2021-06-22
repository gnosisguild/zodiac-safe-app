import { JsonRpcProvider } from "@ethersproject/providers";
import { Contract, Signer } from "ethers";
import {
  DaoModuleAbi,
  AmbModuleAbi,
  AddressOne,
  buildTransaction,
  INFURA_URL,
  SafeAbi,
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
};

type KnownModules = keyof typeof MODULE_METHODS;

interface DaoModuleParams {
  executor: string;
  oracle: string;
  timeout: number;
  cooldown: number;
  expiration: number;
  bond: number;
  templateId: number;
}

interface AmbModuleParams {
  executor: string;
  amb: string;
  owner: string;
  chainId: string;
}

type ModuleDeploymentParams = DaoModuleParams | AmbModuleParams;

type KnownMethods<T extends KnownModules> = keyof typeof MODULE_METHODS[T];

const provider = new JsonRpcProvider(INFURA_URL);

export function addModule(
  module: KnownModules,
  args: ModuleDeploymentParams,
  signer: Signer
) {}

export async function fetchModules(safeAddress: string) {
  const safe = new Contract(safeAddress, SafeAbi, provider);
  const [modules] = await safe.getModulesPaginated(AddressOne, 10);
  return modules;
}

export async function enableModule(safeAddress: string, module: string) {
  const safe = new Contract(safeAddress, SafeAbi, provider);
  return buildTransaction(safe, "enableModule", [module]);
}

export async function disableModule(safeAddress: string, module: string) {
  const modules: string[] = await fetchModules(safeAddress);
  if (!modules.length) throw new Error("Safe does not have enabled modules");
  let prevModule = AddressOne;
  const safe = new Contract(safeAddress, SafeAbi, provider);
  if (modules.length > 1) {
    const moduleIndex = modules.findIndex(
      (m) => m.toLowerCase() === module.toLowerCase()
    );
    if (moduleIndex > 0) prevModule = modules[moduleIndex - 1];
  }
  return buildTransaction(safe, "disableModule", [prevModule, module]);
}

export async function editModule<Module extends KnownModules>(
  module: Module,
  address: string,
  methods: Partial<Record<KnownMethods<Module>, string>>
) {
  // Add validation to check if module is indeed added
  const methodsName = Object.keys(methods);
  if (!methodsName.length) {
    throw new Error("At least one method must be provided");
  }

  let contract: Contract;
  switch (module) {
    case "dao":
      contract = new Contract(address, DaoModuleAbi, provider);
      break;
    case "amb":
      contract = new Contract(address, AmbModuleAbi, provider);
      break;
  }

  const formattedTransactions = methodsName.map((m: string) =>
    //@ts-ignore
    buildTransaction(contract, m, [methods[m]])
  );

  return formattedTransactions;
}

export const callContract = (
  address: string,
  abi: string | string[],
  method: string,
  data: (string | string[])[] = []
) => {
  const contract = new Contract(address, abi, provider);
  return contract.functions[method](...data);
};
