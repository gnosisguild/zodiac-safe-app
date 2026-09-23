import { JsonRpcProvider } from 'ethers'
import { NETWORK } from 'utils/networks'

// ENS resolves on one network per deployment. The Safe's own chain is not a valid input here.
type EnsChainId = NETWORK.MAINNET | NETWORK.SEPOLIA

const infuraId = import.meta.env.VITE_INFURA_ID

const INFURA_SUBDOMAIN: Record<EnsChainId, string> = {
  [NETWORK.MAINNET]: 'mainnet',
  [NETWORK.SEPOLIA]: 'sepolia',
}

const PUBLIC_RPC_URLS: Record<EnsChainId, string[]> = {
  [NETWORK.MAINNET]: ['https://ethereum-rpc.publicnode.com', 'https://eth.drpc.org'],
  [NETWORK.SEPOLIA]: ['https://ethereum-sepolia-rpc.publicnode.com', 'https://sepolia.drpc.org'],
}

// Endpoints are pinned because these run in the browser: an endpoint that sends no
// Access-Control-Allow-Origin header fails every request at pre-flight.
export const getEnsRpcUrls = (chainId: EnsChainId): string[] => {
  const publicUrls = PUBLIC_RPC_URLS[chainId]

  if (!infuraId) {
    return publicUrls
  }

  const infuraUrl = `https://${INFURA_SUBDOMAIN[chainId]}.infura.io/v3/${infuraId}`
  return [infuraUrl, ...publicUrls]
}

const makeProvider = (chainId: EnsChainId) =>
  new JsonRpcProvider(getEnsRpcUrls(chainId)[0], chainId, { staticNetwork: true })

export const getMainnetProvider = () => makeProvider(NETWORK.MAINNET)
export const getSepoliaProvider = () => makeProvider(NETWORK.SEPOLIA)
