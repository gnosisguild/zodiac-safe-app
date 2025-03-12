import { BrowserProvider, Provider, ethers, getAddress } from 'ethers'
import { BaseTransaction } from '@gnosis.pm/safe-apps-sdk'
import { EnsPublicClient } from '@ensdomains/ensjs'
import { namehash, normalize } from 'viem/ens'

const isDev = import.meta.env.MODE === 'development'

//Some apps may show the contract address as the owner. This doesn't affect your ownership.
enum EnsWrappedContract {
  MAINNET = '0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401',
  SEPOLIA = '0x0635513f179D50A207757E05759CbD106d7dFcE8',
}

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

const resolverAbi = ['function addr(bytes32 node) external view returns (address)']

const abiImplementation = ['function ownerOf(uint256 tokenId) public view returns (address owner)']

export const setTextRecordTx = async (
  signer: ethers.JsonRpcSigner,
  ensName: string,
  key: string,
  content: string,
): Promise<BaseTransaction> => {
  const ensRegistryContract = new ethers.Contract(ensRegistry, abiRegistry, signer)
  const nameHash = namehash(ensName)
  const ensResolver = await ensRegistryContract.resolver(nameHash)
  const ensResolverContract = new ethers.Contract(ensResolver, abiPublicResolver, signer)
  const populatedTx = await ensResolverContract.setText.populateTransaction(nameHash, key, content)

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

export const checkIfIsOwner = async (
  ensClient: EnsPublicClient<any, any>,
  ensName: string,
  safeAddress: string,
): Promise<boolean> => {
  try {
    const ownerInstance = await ensClient.getOwner({ name: ensName })
    const owner = ownerInstance?.owner

    if (!owner) return false

    const normalizedOwner = getAddress(owner)
    const normalizedSafeAddress = getAddress(safeAddress)

    return (
      normalizedOwner === normalizedSafeAddress ||
      normalizedOwner === getAddress(EnsWrappedContract.MAINNET) ||
      normalizedOwner === getAddress(EnsWrappedContract.SEPOLIA)
    )
  } catch (error) {
    console.error('Error checking owner:', error)
    return false
  }
}

export const getEnsTextRecord = async (
  ensName: string, 
  recordId: string, 
  mainnetProvider: Provider, 
  sepoliaProvider: Provider) => {
  const nameHash = namehash(ensName)
  const ensRegistryContract = new ethers.Contract(ensRegistry, abiRegistry, getProvider(mainnetProvider, sepoliaProvider))
  const ensResolverAddress = await ensRegistryContract.resolver(nameHash)
  const ensResolverContract = new ethers.Contract(ensResolverAddress, abiPublicResolver, getProvider(mainnetProvider, sepoliaProvider))
  const record = ensResolverContract.text(nameHash, recordId)
  return record 
}

export const checkIfIsController = async (
  mainnetProvider: Provider, 
  sepoliaProvider: Provider,
  ensClient: EnsPublicClient<any, any>,
  ensName: string,
  safeAddress: string,
) => {
  if (!mainnetProvider || !sepoliaProvider || !ensClient || !ensName || !safeAddress) {
    throw new Error('all parameter are required')
  }

  try {
    const resolverAddress = await ensClient.getResolver({ name: ensName })
    if (!resolverAddress) {
      console.warn('invalid ens name')
      return false
    }
    const node = namehash(ensName)
    const resolverContract = new ethers.Contract(resolverAddress, resolverAbi, getProvider(mainnetProvider, sepoliaProvider))
    const controller = await resolverContract.addr(node)
    return getAddress(controller) === getAddress(safeAddress)
  } catch (error) {
    console.error('Error verifying the ENS controller:', error)
    return false
  }
}

const getProvider = (mainnetProvider: Provider, sepoliaProvider: Provider) => isDev ? sepoliaProvider : mainnetProvider;
