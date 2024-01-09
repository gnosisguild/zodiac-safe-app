import { Contract, ethers } from "ethers"
import {
  MODULE_ABIS,
  MODULE_NAMES,
  ModuleContractMetadata,
  ModuleType,
} from "../store/modules/models"
import { NETWORK } from "./networks"

const GNOSIS_GENERIC_PROXY_CONTRACT_BYTECODE =
  "0x608060405273ffffffffffffffffffffffffffffffffffffffff600054167fa619486e0000000000000000000000000000000000000000000000000000000060003514156050578060005260206000f35b3660008037600080366000845af43d6000803e60008114156070573d6000fd5b3d6000f3fea265627a7a72315820d8a00dc4fe6bf675a9d7416fc2d00bb3433362aa8186b750f76c4027269667ff64736f6c634300050e0032"

const GNOSIS_GENERIC_PROXY_CONTRACT_ABI = [
  "function masterCopy() external view returns (address)",
]

export function getModuleType(type: string): ModuleType {
  const moduleType = Object.keys(ModuleType).find((moduleType) => moduleType === type)
  if (!moduleType) return ModuleType.UNKNOWN
  return moduleType as ModuleType
}

export function getModuleContractMetadata(
  module: ModuleType,
): ModuleContractMetadata | undefined {
  if (module === ModuleType.UNKNOWN) return
  return { type: module, name: MODULE_NAMES[module], abi: MODULE_ABIS[module] }
}

export function isGnosisGenericProxy(bytecode: string) {
  return bytecode.toLowerCase() === GNOSIS_GENERIC_PROXY_CONTRACT_BYTECODE
}

export function isGenericProxy(bytecode: string) {
  if (bytecode.length !== 92) return false
  return (
    bytecode.startsWith("0x363d3d373d3d3d363d73") &&
    bytecode.endsWith("5af43d82803e903d91602b57fd5bf3")
  )
}

export function getGenericProxyMaster(bytecode: string) {
  return "0x" + bytecode.substr(22, 40)
}

export async function getProxyMaster(
  provider: ethers.providers.JsonRpcProvider,
  address: string,
  chainId: NETWORK,
) {
  const contract = new Contract(address, GNOSIS_GENERIC_PROXY_CONTRACT_ABI, provider)

  const [masterAddress] = await contract.functions.masterCopy()

  return masterAddress
}
