import {
  defaultAbiCoder,
  FunctionFragment,
  ParamType,
} from "@ethersproject/abi";
import memoize from "lodash.memoize";
import { getNetworkExplorerInfo } from "./explorers";

export function isWriteFunction(method: FunctionFragment) {
  if (!method.stateMutability) return true;
  return !["view", "pure"].includes(method.stateMutability);
}

export function isReadFunction(method: FunctionFragment) {
  return !isWriteFunction(method);
}

export const fetchContractABI = memoize(
  async (chainId: number, contractAddress: string) => {
    const network = getNetworkExplorerInfo(chainId);

    if (!network) throw new Error("Network data not found");

    const { apiUrl } = network;

    const params = new URLSearchParams({
      module: "contract",
      action: "getAbi",
      address: contractAddress,
    });

    const response = await fetch(`${apiUrl}?${params}`);

    if (!response.ok) throw new Error("Could not fetch ABI");

    const { status, result } = await response.json();
    if (status === "0") throw new Error("Could not fetch ABI");

    return result as string;
  }
);

export function isBasicFunction(func: FunctionFragment) {
  return !func.inputs.length;
}

export function validateFunctionResultsAddress(
  func: FunctionFragment
): boolean {
  return func.outputs?.length === 1 && func.outputs[0].type === "address";
}

export function validateFunctionParamValue(
  param: ParamType,
  value: any
): boolean {
  try {
    defaultAbiCoder.encode([param], [value]);
    return true;
  } catch (error) {
    return false;
  }
}

export function validateFunctionParams(
  func: FunctionFragment,
  params: any[]
): boolean {
  try {
    defaultAbiCoder.encode(func.inputs, params);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Formats and Validate a param value.
 * @param param - Contract Function Param.
 * @param value - Value.
 */
export function formatParamValue(param: ParamType, value: string): any {
  let _value = value;
  if (param.baseType === "array" || param.baseType === "tuple") {
    try {
      _value = JSON.parse(_value);
    } catch (e) {
      throw new Error("Invalid " + param.baseType);
    }
  }

  if (!validateFunctionParamValue(param, _value)) {
    throw new Error("Invalid " + param.type);
  }

  return _value;
}