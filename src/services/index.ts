import { BigNumber, Contract, ethers } from "ethers";
import {
  calculateProxyAddress,
  deployAndSetUpModule,
  getFactoryAndMasterCopy,
  getModuleInstance,
} from "@gnosis.pm/zodiac";
import {
  AddressOne,
  buildTransaction,
  DEFAULT_ORACLE_ADDRESSES,
  SafeAbi,
} from "./helpers";
import { ContractInterface } from "@ethersproject/contracts";
import { Transaction } from "@gnosis.pm/safe-apps-sdk";
import { getNetworkExplorerInfo } from "../utils/explorers";
import { ModuleType, SafeInfo, SafeTransaction } from "../store/modules/models";
import { InfuraProvider } from "@ethersproject/providers";

interface RealityModuleParams {
  executor: string;
  oracle?: string;
  bond: string;
  templateId: string;
  timeout: string;
  cooldown: string;
  expiration: string;
}

interface DelayModuleParams {
  executor: string;
  cooldown: string;
  expiration: string;
}

export interface AMBModuleParams {
  amb: string;
  controller: string;
  executor: string;
  chainId: string;
}

export interface ExitModuleParams {
  executor: string;
  tokenContract: string;
}

export function getProvider(chainId: number) {
  return new InfuraProvider(chainId, process.env.REACT_APP_INFURA_ID);
}

export function deployRealityModule(
  safeAddress: string,
  chainId: number,
  args: RealityModuleParams,
  isERC20?: boolean
) {
  const type = isERC20 ? ModuleType.REALITY_ERC20 : ModuleType.REALITY_ETH;
  const { timeout, cooldown, expiration, bond, templateId, oracle, executor } =
    args;
  const provider = getProvider(chainId);
  const oracleAddress = oracle || DEFAULT_ORACLE_ADDRESSES[chainId];
  const {
    transaction: daoModuleDeploymentTx,
    expectedModuleAddress: daoModuleExpectedAddress,
  } = deployAndSetUpModule(
    type,
    {
      types: [
        "address",
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
        safeAddress,
        executor,
        oracleAddress,
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
    const addModuleTransaction = buildTransaction(delayModule, "enableModule", [
      daoModuleExpectedAddress,
    ]);

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
}

export function deployDelayModule(
  safeAddress: string,
  chainId: number,
  args: DelayModuleParams
) {
  const provider = getProvider(chainId);
  const { cooldown, expiration, executor } =
    args as unknown as DelayModuleParams;
  const {
    transaction: delayModuleDeploymentTx,
    expectedModuleAddress: delayModuleExpectedAddress,
  } = deployAndSetUpModule(
    "delay",
    {
      types: ["address", "address", "address", "uint256", "uint256"],
      values: [safeAddress, safeAddress, executor, cooldown, expiration],
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

export function deployBridgeModule(
  safeAddress: string,
  chainId: number,
  args: AMBModuleParams
) {
  const provider = getProvider(chainId);
  const { executor, controller, amb, chainId: ambChainId } = args;

  const { transaction, expectedModuleAddress } = deployAndSetUpModule(
    "bridge",
    {
      types: ["address", "address", "address", "address", "address", "bytes32"],
      values: [
        safeAddress,
        safeAddress,
        executor,
        amb,
        controller,
        ethers.utils.hexZeroPad(BigNumber.from(ambChainId).toHexString(), 32),
      ],
    },
    provider,
    chainId,
    Date.now().toString()
  );

  const enableModuleTransaction = enableModule(
    safeAddress,
    chainId,
    expectedModuleAddress
  );

  return [
    {
      ...transaction,
      value: transaction.value.toString(),
    },
    enableModuleTransaction,
  ];
}

export function deployCirculatingSupplyContract(
  safeAddress: string,
  chainId: number,
  token: string,
  saltNonce: string
) {
  const provider = getProvider(chainId);
  const { factory, module: circulatingSupplyContract } =
    getFactoryAndMasterCopy("circulatingSupply", provider, chainId);

  const encodedInitParams = new ethers.utils.AbiCoder().encode(
    ["address", "address", "address[]"],
    [safeAddress, token, []]
  );
  const moduleSetupData =
    circulatingSupplyContract.interface.encodeFunctionData("setUp", [
      encodedInitParams,
    ]);

  const expectedAddress = calculateProxyAddress(
    factory,
    circulatingSupplyContract.address,
    moduleSetupData,
    saltNonce
  );

  const deployData = factory.interface.encodeFunctionData("deployModule", [
    circulatingSupplyContract.address,
    moduleSetupData,
    saltNonce,
  ]);

  const transaction = {
    data: deployData,
    to: factory.address,
    value: "0",
  };
  return {
    transaction,
    expectedAddress,
  };
}

export function deployExitModule(
  safeAddress: string,
  chainId: number,
  args: ExitModuleParams
) {
  const provider = getProvider(chainId);
  const txs: Transaction[] = [];
  const { executor, tokenContract } = args;

  const {
    transaction: deployCirculationSupplyTx,
    expectedAddress: circulatingSupplyAddress,
  } = deployCirculatingSupplyContract(
    safeAddress,
    chainId,
    tokenContract,
    Date.now().toString()
  );

  txs.push(deployCirculationSupplyTx);

  const { transaction, expectedModuleAddress } = deployAndSetUpModule(
    "exit",
    {
      types: ["address", "address", "address", "address", "address"],
      values: [
        safeAddress,
        safeAddress,
        executor,
        tokenContract,
        circulatingSupplyAddress,
      ],
    },
    provider,
    chainId,
    Date.now().toString()
  );
  txs.push({
    ...transaction,
    value: transaction.value.toString(),
  });

  const enableModuleTransaction = enableModule(
    safeAddress,
    chainId,
    expectedModuleAddress
  );
  txs.push(enableModuleTransaction);

  return txs;
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
