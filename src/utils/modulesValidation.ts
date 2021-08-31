import { Contract } from "ethers";
import { defaultProvider } from "../services/helpers";
import { ModuleMetadata, ModuleType } from "../store/modules/models";
import MODULES_METADATA from "./modulesMetadata.json";

type ModuleContractMetadata = Pick<
  ModuleMetadata,
  "type" | "abi" | "bytecode" | "name"
>;

const GNOSIS_GENERIC_PROXY_CONTRACT_BYTECODE =
  "0x608060405273ffffffffffffffffffffffffffffffffffffffff600054167fa619486e0000000000000000000000000000000000000000000000000000000060003514156050578060005260206000f35b3660008037600080366000845af43d6000803e60008114156070573d6000fd5b3d6000f3fea265627a7a72315820d8a00dc4fe6bf675a9d7416fc2d00bb3433362aa8186b750f76c4027269667ff64736f6c634300050e0032";

const GNOSIS_GENERIC_PROXY_CONTRACT_ABI = [
  "function masterCopy() external view returns (address)",
];

export function getModuleType(type: string): ModuleType {
  switch (type) {
    case "dao":
      return ModuleType.DAO;
    case "delay":
      return ModuleType.DELAY;
    case "amb":
      return ModuleType.AMB;
    case "exit":
      return ModuleType.EXIT;
  }
  return ModuleType.UNKNOWN;
}

export function getModuleContractMetadata(
  module: ModuleType
): ModuleContractMetadata | undefined {
  if (module === ModuleType.UNKNOWN) return;
  return { type: module, ...MODULES_METADATA[module] };
}

export function getModuleContractMetadataByBytecode(
  bytecode: string
): ModuleContractMetadata | undefined {
  const entry = Object.entries(MODULES_METADATA).find(
    ([, metadata]) => metadata.bytecode === bytecode.toLowerCase().trim()
  );
  if (!entry) return;
  const [type, metadata] = entry;
  return { ...metadata, type: getModuleType(type) };
}

export function isGnosisGenericProxy(bytecode: string) {
  return bytecode.toLowerCase() === GNOSIS_GENERIC_PROXY_CONTRACT_BYTECODE;
}

export function isGenericProxy(bytecode: string) {
  if (bytecode.length !== 92) return false;
  return (
    bytecode.startsWith("0x363d3d373d3d3d363d73") &&
    bytecode.endsWith("5af43d82803e903d91602b57fd5bf3")
  );
}

export function getGenericProxyMaster(bytecode: string) {
  return "0x" + bytecode.substr(22, 40);
}

export async function getProxyMaster(address: string) {
  const contract = new Contract(
    address,
    GNOSIS_GENERIC_PROXY_CONTRACT_ABI,
    defaultProvider
  );

  const [masterAddress] = await contract.functions.masterCopy();

  return masterAddress;
}
