import { Provider, ethers, getAddress, keccak256, namehash, toUtf8Bytes } from 'ethers'
import { BaseTransaction } from '@gnosis.pm/safe-apps-sdk'

/**
 * This only works for domains using a resolver that conforms to the `abiPublicResolver` (like the PublicResolver).
 */

const ensRegistry = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e' // ENS: Registry with Fallback (singleton same address on different chains)
const ensImplementation = '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85' // ENS: Base Registrar Implementation (singleton same address on different chains)

const abiPublicResolver = [
  'function setText(bytes32 node, string calldata key, string calldata value) external',
  'function text(bytes32 node, string calldata key) external view returns (string memory)',
]

const abiRegistry = [
  'function owner(bytes32 node) external view returns (address)',
  'function resolver(bytes32 node) external view returns (address)',
]

const abiImplementation = ['function ownerOf(uint256 tokenId) public view returns (address owner)']

export const setTextRecordTx = async (
  provider: Provider,
  ensName: string,
  key: string,
  content: string,
): Promise<BaseTransaction> => {
  const ensRegistryContract = new ethers.Contract(ensRegistry, abiRegistry, provider)
  const nameHash = namehash(ensName)
  const ensResolver = await ensRegistryContract.resolver(nameHash)
  const ensResolverContract = new ethers.Contract(ensResolver, abiPublicResolver, provider)
  const populatedTx = await ensResolverContract.setText(nameHash, key, content)

  if (populatedTx.to == null) {
    throw new Error('Missing to address')
  }
  if (populatedTx.data == null) {
    throw new Error('Missing data')
  }

  return {
    to: populatedTx.to,
    data: populatedTx.data,
    value: '0',
  }
}

// the owner of the NFT
export const checkIfIsOwner = async (provider: Provider, ensName: string, address: string) => {
  const name = ensName.split('.')[0] // only supports toplevel
  const labelHash = keccak256(toUtf8Bytes(name))
  const tokenId = BigInt(labelHash).toString()
  const ensImplementationContract = new ethers.Contract(
    ensImplementation,
    abiImplementation,
    provider,
  )
  const nftOwner = await ensImplementationContract.ownerOf(tokenId)
  return getAddress(nftOwner) === getAddress(address)
}

export const getEnsTextRecord = async (ensName: string, recordId: string, provider: Provider) => {
  const nameHash = namehash(ensName)
  const ensRegistryContract = new ethers.Contract(ensRegistry, abiRegistry, provider)
  const ensResolverAddress = await ensRegistryContract.resolver(nameHash)
  const ensResolverContract = new ethers.Contract(ensResolverAddress, abiPublicResolver, provider)
  const record = ensResolverContract.text(nameHash, recordId)
  return record
}

export const checkIfIsController = async (provider: Provider, ensName: string, address: string) => {
  const ensRegistryContract = new ethers.Contract(ensRegistry, abiRegistry, provider)
  const nameHash = namehash(ensName)
  const owner = await ensRegistryContract.owner(nameHash)

  return getAddress(address) === getAddress(owner)
}
