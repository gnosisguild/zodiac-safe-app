import {
  defaultAbiCoder,
  FunctionFragment,
  Interface,
  ParamType,
} from "@ethersproject/abi";
import memoize from "lodash.memoize";
import { getNetworkExplorerInfo } from "./explorers";
import SafeAppsSDK from "@gnosis.pm/safe-apps-sdk";
import {
  getGenericProxyMaster,
  getProxyMaster,
  isGenericProxy,
  isGnosisGenericProxy,
} from "./modulesValidation";
import { ModuleMetadata } from "../store/modules/models";

export function isWriteFunction(method: FunctionFragment) {
  if (!method.stateMutability) return true;
  return !["view", "pure"].includes(method.stateMutability);
}

export function isReadFunction(method: FunctionFragment) {
  return !isWriteFunction(method);
}

export function getReadFunction(abi: string | string[]) {
  return new Interface(abi).fragments
    .filter(FunctionFragment.isFunctionFragment)
    .map(FunctionFragment.from)
    .filter(isReadFunction);
}

export function getWriteFunction(abi: string | string[]) {
  return new Interface(abi).fragments
    .filter(FunctionFragment.isFunctionFragment)
    .map(FunctionFragment.from)
    .filter(isWriteFunction);
}

export const fetchContractSourceCode = memoize(
  async (chainId: number, contractAddress: string) => {
    const network = getNetworkExplorerInfo(chainId);

    if (!network) throw new Error("Network data not found");

    const { apiUrl, apiKey } = network;

    const urlParams: Record<string, string> = {
      module: "contract",
      action: "getsourcecode",
      address: contractAddress,
    };

    if (apiKey) {
      urlParams.apiKey = apiKey;
    }

    const params = new URLSearchParams(urlParams);

    const response = await fetch(`${apiUrl}?${params}`);

    if (!response.ok) throw new Error("Could not fetch contract source code");

    const { status, result } = await response.json();
    if (status === "0") throw new Error("Could not fetch contract source code");

    const sourceCode = result[0] as { ABI: string; ContractName: string };

    return sourceCode;
  },
  (chainId: number, contractAddress: string) => `${chainId}_${contractAddress}`
);

export function isBasicFunction(func: FunctionFragment) {
  return !func.inputs.length;
}

export function validateFunctionReturnsHex(func: FunctionFragment): boolean {
  if (func.outputs?.length !== 1) return false;
  const { baseType } = func.outputs[0];
  return baseType === "address" || baseType.startsWith("bytes");
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
      throw new Error("Input must be of type " + param.baseType);
    }
  }

  if (!validateFunctionParamValue(param, _value)) {
    throw new Error("Input must be of type " + param.type);
  }

  return _value;
}

/**
 * Formats and Validate a param value.
 * @param param - Contract Function Param.
 * @param value - Value.
 */
export function formatDisplayParamValue(param: ParamType, value: any): string {
  if (param.baseType === "array" || param.baseType === "tuple") {
    try {
      return JSON.stringify(value);
    } catch (e) {
      console.warn("formatDisplayParamValue: value is not an object", value, e);
    }
  }
  return value.toString();
}

export const getModule = memoize(
  async (
    safeSDK: SafeAppsSDK,
    chainId: number,
    address: string
  ): Promise<ModuleMetadata> => {
    const bytecode = await safeSDK.eth.getCode([address]);

    if (isGenericProxy(bytecode)) {
      const masterAddress = getGenericProxyMaster(bytecode);
      const module = await getModule(safeSDK, chainId, masterAddress);
      return { ...module, address };
    }

    if (isGnosisGenericProxy(bytecode)) {
      const masterAddress = await getProxyMaster(address);
      const module = await getModule(safeSDK, chainId, masterAddress);
      return { ...module, address };
    }

    const { ABI, ContractName } = await fetchContractSourceCode(
      chainId,
      address
    );

    return {
      address,
      implAddress: address,
      name: ContractName,
      abi: ABI,
    };
  },
  (sdk, chainId, address) => `${chainId}_${address}`
);
