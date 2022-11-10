import {
  defaultAbiCoder,
  FunctionFragment,
  Interface,
  ParamType,
} from "@ethersproject/abi"
import memoize from "lodash.memoize"
import { getNetworkExplorerInfo } from "./explorers"
import SafeAppsSDK from "@gnosis.pm/safe-apps-sdk"
import {
  getGenericProxyMaster,
  getModuleContractMetadata,
  getModuleContractMetadataByBytecode,
  getProxyMaster,
  isGenericProxy,
  isGnosisGenericProxy,
} from "./modulesValidation"
import { ModuleContract, ModuleType } from "../store/modules/models"
import retry from "async-retry"
import { BigNumber, ethers } from "ethers"
import { ContractInterface } from "@ethersproject/contracts"
import { getContractsModuleType, getModuleName } from "../store/modules/helpers"

export function isWriteFunction(method: FunctionFragment) {
  if (!method.stateMutability) return true
  return !["view", "pure"].includes(method.stateMutability)
}

export function isReadFunction(method: FunctionFragment) {
  return !isWriteFunction(method)
}

export function getReadFunction(abi: ContractInterface) {
  const inter = abi instanceof Interface ? abi : new Interface(abi as any)
  return inter.fragments
    .filter(FunctionFragment.isFunctionFragment)
    .map(FunctionFragment.from)
    .filter(isReadFunction)
}

export function getWriteFunction(abi: ContractInterface) {
  const inter = abi instanceof Interface ? abi : new Interface(abi as any)
  return inter.fragments
    .filter(FunctionFragment.isFunctionFragment)
    .map(FunctionFragment.from)
    .filter(isWriteFunction)
}

export const fetchContractSourceCode = memoize(
  (chainId: number, contractAddress: string) =>
    retry(
      async (bail) => {
        const network = getNetworkExplorerInfo(chainId)

        if (!network) throw new Error("Network data not found")

        const { apiUrl, apiKey } = network

        const urlParams: Record<string, string> = {
          module: "contract",
          action: "getsourcecode",
          address: contractAddress,
        }

        if (apiKey) {
          urlParams.apiKey = apiKey
        }

        const params = new URLSearchParams(urlParams)

        const response = await fetch(`${apiUrl}?${params}`)

        if (!response.ok) throw new Error("Could not fetch contract source code")

        const { status, result } = await response.json()
        if (status === "0") throw new Error("Could not fetch contract source code")

        const data = result[0] as { ABI: string; ContractName: string }

        if (!data.ContractName) bail(new Error("Contract is not verified"))

        return data
      },
      { retries: 4, minTimeout: 1000 },
    ),
  (chainId: number, contractAddress: string) => `${chainId}_${contractAddress}`,
)

export function isBasicFunction(func: FunctionFragment) {
  return !func.inputs.length
}

export function isOneResult(func: FunctionFragment) {
  return (
    func.outputs?.length === 1 && func.outputs && func.outputs[0]?.baseType !== "array"
  )
}

export function validateFunctionParamValue(param: ParamType, value: any): boolean {
  try {
    defaultAbiCoder.encode([param], [value])
    return true
  } catch (error) {
    return false
  }
}

export function validateFunctionParams(func: FunctionFragment, params: any[]): boolean {
  try {
    defaultAbiCoder.encode(func.inputs, params)
    return true
  } catch (error) {
    return false
  }
}

/**
 * Formats and Validate a param value.
 * @param param - Contract Function Param.
 * @param value - Value.
 */
export function formatParamValue(param: ParamType, value: string): any {
  let _value = value
  if (param.baseType === "array" || param.baseType === "tuple") {
    try {
      _value = JSON.parse(_value)
    } catch (e) {
      throw new Error("Input must be of type " + param.baseType)
    }
  }

  if (!validateFunctionParamValue(param, _value)) {
    throw new Error("Input must be of type " + param.type)
  }

  return _value
}

/**
 * Formats and Validate a param value.
 * @param param - Contract Function Param.
 * @param value - Value.
 */
export function formatDisplayParamValue(param: ParamType, value: any): string {
  if (param.baseType === "array" || param.baseType === "tuple") {
    try {
      return JSON.stringify(value)
    } catch (e) {
      console.warn("formatDisplayParamValue: value is not an object", value, e)
    }
  }
  return value.toString()
}

export const getModuleData = memoize(
  async (
    provider: ethers.providers.JsonRpcProvider,
    safeSDK: SafeAppsSDK,
    chainId: number,
    address: string,
  ): Promise<ModuleContract> => {
    const bytecode = await safeSDK.eth.getCode([address])

    if (isGenericProxy(bytecode)) {
      const masterAddress = getGenericProxyMaster(bytecode)
      const module: ModuleContract = await getModuleData(
        provider,
        safeSDK,
        chainId,
        masterAddress,
      )
      return { ...module, address }
    }

    if (isGnosisGenericProxy(bytecode)) {
      const masterAddress = await getProxyMaster(provider, address, chainId)
      const module: ModuleContract = await getModuleData(
        provider,
        safeSDK,
        chainId,
        masterAddress,
      )
      return { ...module, address }
    }

    const type = getContractsModuleType(chainId, address)
    if (type !== ModuleType.UNKNOWN) {
      return {
        type,
        address,
        implAddress: address,
        name: getModuleName(type),
        ...getModuleContractMetadata(type),
      }
    }

    const standardContract = getModuleContractMetadataByBytecode(bytecode)
    if (standardContract) {
      return {
        address,
        implAddress: address,
        ...standardContract,
      }
    }

    try {
      const { ABI, ContractName } = await fetchContractSourceCode(chainId, address)

      return {
        address,
        implAddress: address,
        name: ContractName,
        abi: ABI,
        type: ModuleType.UNKNOWN,
      }
    } catch (error) {
      return { address, implAddress: address, type: ModuleType.UNKNOWN }
    }
  },
  (sdk, chainId, address, provider) => `${chainId}_${address}_${provider}`,
)

export function formatValue(
  baseType: string,
  value: string | BigNumber | boolean,
): string {
  if (baseType === "array" || baseType === "tuple") {
    value = JSON.stringify(value)
  }

  return value.toString()
}
