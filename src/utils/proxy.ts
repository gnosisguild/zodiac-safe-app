import { Contract } from "ethers";
import { defaultProvider } from "../services/helpers";

const GENERIC_PROXY_CONTRACT_BYTECODE =
  "0x608060405273ffffffffffffffffffffffffffffffffffffffff600054167fa619486e0000000000000000000000000000000000000000000000000000000060003514156050578060005260206000f35b3660008037600080366000845af43d6000803e60008114156070573d6000fd5b3d6000f3fea265627a7a72315820d8a00dc4fe6bf675a9d7416fc2d00bb3433362aa8186b750f76c4027269667ff64736f6c634300050e0032";

const GENERIC_PROXY_CONTRACT_ABI = [
  "function masterCopy() external view returns (address)",
];

export function isGenericProxy(bytecode: string) {
  return bytecode.toLowerCase() === GENERIC_PROXY_CONTRACT_BYTECODE;
}

export async function getProxyMaster(address: string) {
  const contract = new Contract(
    address,
    GENERIC_PROXY_CONTRACT_ABI,
    defaultProvider
  );

  const [masterAddress] = await contract.functions.masterCopy();

  return masterAddress;
}
