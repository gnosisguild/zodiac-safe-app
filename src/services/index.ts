import { BigNumber, Contract, ethers } from "ethers";
import {
  calculateProxyAddress,
  deployAndSetUpModule,
  getFactoryAndMasterCopy,
  getModuleInstance,
} from "@gnosis.pm/zodiac";
import { AddressOne, buildTransaction, SafeAbi } from "./helpers";
import { ContractInterface } from "@ethersproject/contracts";
import { Transaction } from "@gnosis.pm/safe-apps-sdk";
import { ETHEREUM_NETWORK, getNetworkExplorerInfo } from "../utils/explorers";
import { ModuleType, SafeInfo, SafeTransaction } from "../store/modules/models";

export enum ARBITRATOR_OPTIONS {
  NO_ARBITRATOR,
  KLEROS,
  OTHER,
}

interface RealityModuleParams {
  executor: string;
  oracle?: string;
  bond: string;
  templateId: string;
  timeout: string;
  cooldown: string;
  expiration: string;
  arbitrator: string;
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

export function getProvider(chainId: number): ethers.providers.JsonRpcProvider {
  if (chainId === ETHEREUM_NETWORK.XDAI) {
    return new ethers.providers.JsonRpcProvider(
      "https://rpc.xdaichain.com",
      ETHEREUM_NETWORK.XDAI
    );
  }
  if (chainId === ETHEREUM_NETWORK.POLYGON) {
    return new ethers.providers.JsonRpcProvider(
      "https://rpc-mainnet.maticvigil.com/",
      ETHEREUM_NETWORK.POLYGON
    );
  }

  return new ethers.providers.InfuraProvider(
    chainId,
    process.env.REACT_APP_INFURA_ID
  );
}

export function getDefaultOracle(chainId: number): string {
  switch (chainId) {
    case ETHEREUM_NETWORK.MAINNET:
      return "0x5b7dD1E86623548AF054A4985F7fc8Ccbb554E2c";
    case ETHEREUM_NETWORK.RINKEBY:
      return "0xDf33060F476F8cff7511F806C72719394da1Ad64";
    case 56:
      return "0xa925646Cae3721731F9a8C886E5D1A7B123151B9";
    case ETHEREUM_NETWORK.XDAI:
      return "0xE78996A233895bE74a66F451f1019cA9734205cc";
    case ETHEREUM_NETWORK.POLYGON:
      return "0x60573B8DcE539aE5bF9aD7932310668997ef0428";
  }
  return "";
}

function getKlerosAddress(chainId: number): string {
  // TODO: Add addresses when Kleros becomes available.
  switch (chainId) {
    case ETHEREUM_NETWORK.MAINNET:
      return "";
    case ETHEREUM_NETWORK.RINKEBY:
      return "";
    case 56:
      return "";
    case ETHEREUM_NETWORK.XDAI:
      return "";
    case ETHEREUM_NETWORK.POLYGON:
      return "";
  }
  return "";
}

export function getArbitrator(
  chainId: number,
  arbitratorOption: number
): string {
  switch (arbitratorOption) {
    case ARBITRATOR_OPTIONS.NO_ARBITRATOR:
      // Setting the oracle as the arbitrator is equivalent to setting a null arbitrator.
      return getDefaultOracle(chainId);
    case ARBITRATOR_OPTIONS.KLEROS:
      return getKlerosAddress(chainId);
    case ARBITRATOR_OPTIONS.OTHER:
      return "";
  }
  return "";
}

export function deployRealityModule(
  safeAddress: string,
  chainId: number,
  args: RealityModuleParams,
  isERC20?: boolean
) {
  const type = isERC20 ? ModuleType.REALITY_ERC20 : ModuleType.REALITY_ETH;
  const { timeout, cooldown, expiration, bond, templateId, oracle, executor, arbitrator } =
    args;
  const provider = getProvider(chainId);
  const oracleAddress = oracle || getDefaultOracle(chainId);
  console.log(arbitrator);
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
        "address",
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
        arbitrator,
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
