import { Contract } from "ethers";
import { abi as SafeAbi } from "@gnosis.pm/safe-deployments/dist/assets/v1.3.0/gnosis_safe_l2.json";

export const AddressOne = "0x0000000000000000000000000000000000000001";

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

export { SafeAbi };
