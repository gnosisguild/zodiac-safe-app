import { Contract, Signer } from "ethers";
import { abi as SafeAbi } from "@gnosis.pm/safe-deployments/dist/assets/v1.3.0/gnosis_safe_l2.json";
import {
  abi as MultiSendAbi,
  defaultAddress as MultiSendAddress,
} from "@gnosis.pm/safe-deployments/dist/assets/v1.3.0/multi_send.json";

import { JsonRpcProvider } from "@ethersproject/providers";

const INFURA_ID = process.env.REACT_APP_INFURA_ID;
export const INFURA_URL = "https://rinkeby.infura.io/v3/" + INFURA_ID;
export const defaultProvider = new JsonRpcProvider(INFURA_URL);
export const AddressOne = "0x0000000000000000000000000000000000000001";

export const getSafeInstance = (address: string, signer?: Signer) => {
  return new Contract(address, SafeAbi, signer || defaultProvider);
};

export const buildTransaction = (
  contract: Contract,
  method: string,
  params: any[],
  value?: string
) => {
  let data = contract.interface.encodeFunctionData(method, params);
  return {
    to: contract.address,
    data,
    value: value || "0",
  };
};

export const DEFAULT_ORACLE_ADDRESSES: Record<number, string> = {
  1: "",
  4: "0x3D00D77ee771405628a4bA4913175EcC095538da",
};

export { SafeAbi, MultiSendAddress, MultiSendAbi };
