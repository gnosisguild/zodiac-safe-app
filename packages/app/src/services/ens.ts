import { ethers } from "ethers"
import { Transaction } from "@gnosis.pm/safe-apps-sdk"

/**
 * This only works for domains using a resolver that conforms to the `abiPublicResolver` (like the PublicResolver).
 */

const ensRegistry = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e" // ENS: Registry with Fallback (singleton same address on different chains)
const ensImplementation = "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85" // ENS: Base Registrar Implementation (singleton same address on different chains)

const abiPublicResolver = [
  "function setText(bytes32 node, string calldata key, string calldata value) external",
]

const abiRegistry = [
  "function owner(bytes32 node) external view returns (address)",
  "function resolver(bytes32 node) external view returns (address)",
]

const abiImplementation = [
  "function ownerOf(uint256 tokenId) public view returns (address owner)",
]

export const setTextRecordTx = async (
  provider: ethers.providers.Provider,
  ensName: string,
  key: string,
  content: string,
): Promise<Transaction> => {
  const ensRegistryContract = new ethers.Contract(ensRegistry, abiRegistry, provider)
  const nameHash = ethers.utils.namehash(ensName)
  const ensResolver = await ensRegistryContract.resolver(nameHash)
  const ensResolverContract = new ethers.Contract(
    ensResolver,
    abiPublicResolver,
    provider,
  )
  const populatedTx = await ensResolverContract.populateTransaction.setText(
    nameHash,
    key,
    content,
  )
  if (populatedTx.to == null) {
    throw new Error("Missing to address")
  }
  if (populatedTx.data == null) {
    throw new Error("Missing data")
  }

  return {
    to: populatedTx.to,
    data: populatedTx.data,
    value: "0",
  }
}

// the owner of the NFT
export const checkIfIsOwner = async (
  provider: ethers.providers.Provider,
  ensName: string,
  address: string,
) => {
  const BigNumber = ethers.BigNumber
  const name = ensName.split(".")[0] // only supports toplevel
  const labelHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(name))
  const tokenId = BigNumber.from(labelHash).toString()
  const ensImplementationContract = new ethers.Contract(
    ensImplementation,
    abiImplementation,
    provider,
  )
  const nftOwner = await ensImplementationContract.ownerOf(tokenId)
  return ethers.utils.getAddress(nftOwner) === ethers.utils.getAddress(address)
}

export const checkIfIsController = async (
  provider: ethers.providers.Provider,
  ensName: string,
  address: string,
) => {
  const ensRegistryContract = new ethers.Contract(ensRegistry, abiRegistry, provider)
  const nameHash = ethers.utils.namehash(ensName)
  const owner = await ensRegistryContract.owner(nameHash)

  return ethers.utils.getAddress(address) === ethers.utils.getAddress(owner)
}
