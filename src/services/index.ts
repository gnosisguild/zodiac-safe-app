import { Contract } from "ethers";
import { deployAndSetUpModule, getModuleInstance } from "@gnosis/zodiac";
import {
  AddressOne,
  buildTransaction,
  DEFAULT_ORACLE_ADDRESSES,
  SafeAbi,
} from "./helpers";
import { ContractInterface } from "@ethersproject/contracts";
import { Transaction } from "@gnosis.pm/safe-apps-sdk";
import { getNetworkExplorerInfo } from "../utils/explorers";
import { SafeInfo, SafeTransaction } from "../store/modules/models";
import { InfuraProvider } from "@ethersproject/providers";

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

export function getProvider(chainId: number) {
  return new InfuraProvider(chainId, process.env.REACT_APP_INFURA_ID);
}

export async function createAndAddModule<
  Module extends KnownModules,
  Arg = ModuleParams[Module]
>(
  module: Module,
  args: Arg,
  safeAddress: string,
  chainId: number
): Promise<Transaction[]> {
  const provider = getProvider(chainId);
  switch (module) {
    case "dao":
      const {
        timeout,
        cooldown,
        expiration,
        bond,
        templateId,
        oracle,
        executor,
      } = args as unknown as DaoModuleParams;
      const ORACLE_ADDRESS = oracle || DEFAULT_ORACLE_ADDRESSES[chainId];
      const {
        transaction: daoModuleDeploymentTx,
        expectedModuleAddress: daoModuleExpectedAddress,
      } = deployAndSetUpModule(
        "dao",
        {
          types: [
            "address",
            "address",
            "address",
            "uint32",
            "uint32",
            "uint32",
            "uint256",
            "uint256",
          ],
          values: [
            safeAddress,
            executor,
            ORACLE_ADDRESS,
            timeout,
            cooldown,
            expiration,
            bond,
            templateId,
          ],
        },
        provider,
        chainId,
        Date.now().toString()
      );

      const daoModuleTransactions: Transaction[] = [
        {
          ...daoModuleDeploymentTx,
          value: daoModuleDeploymentTx.value.toString(),
        },
      ];

      if (executor !== safeAddress) {
        const delayModule = getModuleInstance("delay", executor, provider);
        const addModuleTransaction = buildTransaction(
          delayModule,
          "enableModule",
          [daoModuleExpectedAddress]
        );

        daoModuleTransactions.push(addModuleTransaction);
      } else {
        const enableDaoModuleTransaction = enableModule(
          safeAddress,
          chainId,
          daoModuleExpectedAddress
        );
        daoModuleTransactions.push(enableDaoModuleTransaction);
      }

      return daoModuleTransactions;
    case "delay":
      const { txCooldown, txExpiration } = args as unknown as DelayModuleParams;
      const {
        transaction: delayModuleDeploymentTx,
        expectedModuleAddress: delayModuleExpectedAddress,
      } = deployAndSetUpModule(
        "delay",
        {
          types: ["address", "address", "uint256", "uint256"],
          values: [safeAddress, safeAddress, txCooldown, txExpiration],
        },
        provider,
        chainId,
        Date.now().toString()
      );
      const enableDelayModuleTransaction = enableModule(
        safeAddress,
        chainId,
        delayModuleExpectedAddress
      );

      return [
        {
          ...delayModuleDeploymentTx,
          value: delayModuleDeploymentTx.value.toString(),
        },
        enableDelayModuleTransaction,
      ];
  }

  throw new Error("Invalid module");
}

export async function fetchSafeModulesAddress(
  safeAddress: string,
  chainId: number
) {
  const provider = getProvider(chainId);
  const safe = new Contract(safeAddress, SafeAbi, provider);
  const [modules] = await safe.getModulesPaginated(AddressOne, 50);
  return modules as string[];
}

export function enableModule(
  safeAddress: string,
  chainId: number,
  module: string
) {
  const provider = getProvider(chainId);
  const safe = new Contract(safeAddress, SafeAbi, provider);
  return buildTransaction(safe, "enableModule", [module]);
}

export async function disableModule(
  safeAddress: string,
  chainId: number,
  module: string
) {
  const provider = getProvider(chainId);
  const modules = await fetchSafeModulesAddress(safeAddress, chainId);
  if (!modules.length) throw new Error("Safe does not have enabled modules");
  let prevModule = AddressOne;
  const safe = new Contract(safeAddress, SafeAbi, provider);
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
  chainId: number,
  methods: Partial<Record<KnownMethods<Module>, string>>
) {
  // Add validation to check if module is indeed added
  const methodsName = Object.keys(methods) as Array<keyof typeof methods>;
  if (!methodsName.length) {
    throw new Error("At least one method must be provided");
  }
  const provider = getProvider(chainId);
  const module = getModuleInstance(moduleName, address, provider);

  return methodsName.map((method) =>
    buildTransaction(module, method as string, [methods[method]])
  );
}

export const callContract = (
  chainId: number,
  address: string,
  abi: ContractInterface,
  method: string,
  data: any[] = []
) => {
  const contract = new Contract(address, abi, getProvider(chainId));
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
