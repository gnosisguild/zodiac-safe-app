import { NETWORK } from './networks'

const isDev = import.meta.env.MODE === 'development'
const VITE_ETHERSCAN_KEY = import.meta.env.VITE_ETHERSCAN_KEY
if (!VITE_ETHERSCAN_KEY) {
  throw new Error('VITE_ETHERSCAN_KEY is not set')
}

const VITE_GNOSISSCAN_KEY = import.meta.env.VITE_GNOSISSCAN_KEY
if (!isDev && !VITE_GNOSISSCAN_KEY) {
  throw new Error('VITE_GNOSISSCAN_KEY is not set')
}

const VITE_POLYGONSCAN_KEY = import.meta.env.VITE_POLYGONSCAN_KEY
if (!isDev && !VITE_POLYGONSCAN_KEY) {
  throw new Error('VITE_POLYGONSCAN_KEY is not set')
}

const VITE_BSCSCAN_KEY = import.meta.env.VITE_BSCSCAN_KEY
if (!isDev && !VITE_BSCSCAN_KEY) {
  throw new Error('VITE_BSCSCAN_KEY is not set')
}

const VITE_OPTIMISTIC_ETHERSCAN_KEY = import.meta.env.VITE_OPTIMISTIC_ETHERSCAN_KEY
if (!isDev && !VITE_OPTIMISTIC_ETHERSCAN_KEY) {
  throw new Error('VITE_OPTIMISTIC_ETHERSCAN_KEY is not set')
}

const VITE_ARBISCAN_KEY = import.meta.env.VITE_ARBISCAN_KEY
if (!isDev && !VITE_ARBISCAN_KEY) {
  throw new Error('VITE_ARBISCAN_KEY is not set')
}

const VITE_SNOWTRACE_KEY = import.meta.env.VITE_SNOWTRACE_KEY
if (!isDev && !VITE_SNOWTRACE_KEY) {
  throw new Error('VITE_SNOWTRACE_KEY is not set')
}

const VITE_BASESCAN_KEY = import.meta.env.VITE_BASESCAN_KEY
if (!isDev && !VITE_BASESCAN_KEY) {
  throw new Error('VITE_BASESCAN_KEY is not set')
}

const VITE_MANTLESCAN_KEY = import.meta.env.VITE_MANTLESCAN_KEY
if (!isDev && !VITE_MANTLESCAN_KEY) {
  throw new Error('VITE_MANTLESCAN_KEY is not set')
}

const VITE_BERASCAN_KEY = import.meta.env.VITE_BERASCAN_KEY
if (!isDev && !VITE_BERASCAN_KEY) {
  throw new Error('VITE_BERASCAN_KEY is not set')
}

const VITE_SONICSCAN_KEY = import.meta.env.VITE_SONICSCAN_KEY
if (!isDev && !VITE_SONICSCAN_KEY) {
  throw new Error('VITE_SONICSCAN_KEY is not set')
}

const VITE_CELOSCAN_KEY = import.meta.env.VITE_CELOSCAN_KEY
if (!isDev && !VITE_CELOSCAN_KEY) {
  throw new Error('VITE_CELOSCAN_KEY is not set')
}

interface ExplorerData {
  networkExplorerName: string
  networkExplorerUrl: string
  networkExplorerApiUrl: string
  safeTransactionApi: string
  safeUrl: string
  explorerApiKey?: string
  verifyContractUrl: string
}

export const EXPLORERS_CONFIG: Record<NETWORK, ExplorerData> = {
  [NETWORK.MAINNET]: {
    networkExplorerName: 'Etherscan',
    networkExplorerUrl: 'https://etherscan.io',
    networkExplorerApiUrl: 'https://api.etherscan.io/api',
    safeTransactionApi: 'https://safe-transaction-mainnet.safe.global/',
    safeUrl: 'https://app.safe.global/eth:',
    verifyContractUrl: 'https://etherscan.io/verifyContract',
    explorerApiKey: VITE_ETHERSCAN_KEY,
  },
  [NETWORK.GNOSIS_CHAIN]: {
    networkExplorerName: 'GnosisScan',
    networkExplorerUrl: 'https://gnosisscan.io',
    networkExplorerApiUrl: 'https://api.gnosisscan.io/api',
    safeUrl: 'https://app.safe.global/gno:',
    safeTransactionApi: 'https://safe-transaction-gnosis-chain.safe.global/',
    verifyContractUrl: 'https://gnosisscan.io/verifyContract',
    explorerApiKey: VITE_GNOSISSCAN_KEY,
  },
  [NETWORK.POLYGON]: {
    networkExplorerName: 'Polygonscan',
    networkExplorerUrl: 'https://polygonscan.com',
    networkExplorerApiUrl: 'https://api.polygonscan.com/api',
    safeUrl: 'https://app.safe.global/matic:',
    safeTransactionApi: 'https://safe-transaction-polygon.safe.global/',
    verifyContractUrl: 'https://polygonscan.com/verifyContract',
    explorerApiKey: VITE_POLYGONSCAN_KEY,
  },
  [NETWORK.ZKEVM]: {
    networkExplorerName: 'Polygonscan',
    networkExplorerUrl: 'https://zkevm.polygonscan.com',
    networkExplorerApiUrl: 'https://api-zkevm.polygonscan.com/api',
    safeTransactionApi: 'https://safe-transaction-zkevm.safe.global/',
    safeUrl: 'https://app.safe.global/zkevm:',
    verifyContractUrl: 'https://zkevm.polygonscan.com/verifyContract',
    explorerApiKey: VITE_POLYGONSCAN_KEY,
  },
  [NETWORK.BSC]: {
    networkExplorerName: 'BscScan',
    networkExplorerUrl: 'https://bscscan.com/',
    networkExplorerApiUrl: 'https://api.bscscan.com/api',
    safeUrl: 'https://app.safe.global/bsc:',
    safeTransactionApi: 'https://safe-transaction-bsc.safe.global/',
    verifyContractUrl: 'https://bscscan.com/verifyContract',
    explorerApiKey: VITE_BSCSCAN_KEY,
  },
  [NETWORK.OPTIMISM]: {
    networkExplorerName: 'Optimism',
    networkExplorerUrl: 'https://optimistic.etherscan.io/',
    networkExplorerApiUrl: 'https://api-optimistic.etherscan.io/api',
    safeTransactionApi: 'https://safe-transaction-optimism.safe.global/',
    safeUrl: 'https://app.safe.global/oeth:',
    verifyContractUrl: 'https://optimistic.etherscan.io/verifyContract',
    explorerApiKey: VITE_OPTIMISTIC_ETHERSCAN_KEY,
  },
  [NETWORK.ARBITRUM]: {
    networkExplorerName: 'Arbiscan',
    networkExplorerUrl: 'https://arbiscan.io/',
    networkExplorerApiUrl: 'https://api.arbiscan.io/api',
    safeTransactionApi: 'https://safe-transaction-arbitrum.safe.global/',
    safeUrl: 'https://app.safe.global/arb1:',
    verifyContractUrl: 'https://arbiscan.io/verifyContract',
    explorerApiKey: VITE_ARBISCAN_KEY,
  },
  [NETWORK.AVALANCHE]: {
    networkExplorerName: 'Snowtrace',
    networkExplorerUrl: 'https://snowtrace.io/',
    networkExplorerApiUrl: 'https://api.snowtrace.io/api',
    safeTransactionApi: 'https://safe-transaction-avalanche.safe.global/',
    safeUrl: 'https://app.safe.global/avax:',
    verifyContractUrl: 'https://snowtrace.io/verifyContract',
    explorerApiKey: VITE_SNOWTRACE_KEY,
  },
  [NETWORK.SEPOLIA]: {
    networkExplorerName: 'Etherscan',
    networkExplorerUrl: 'https://sepolia.etherscan.io',
    networkExplorerApiUrl: 'https://api-sepolia.etherscan.io/api',
    safeTransactionApi: 'https://safe-transaction-sepolia.safe.global/',
    safeUrl: 'https://app.safe.global/sep:',
    verifyContractUrl: 'https://sepolia.etherscan.io/verifyContract',
    explorerApiKey: VITE_ETHERSCAN_KEY,
  },
  [NETWORK.BASE_SEPOLIA]: {
    networkExplorerName: 'BaseScan',
    networkExplorerUrl: 'https://sepolia.basescan.org',
    networkExplorerApiUrl: 'https://api-sepolia.basescan.org/api',
    safeTransactionApi: 'https://safe-transaction-base-sepolia.safe.global/',
    safeUrl: 'https://app.safe.global/basesep:',
    verifyContractUrl: 'https://sepolia.basescan.org/verifyContract',
    explorerApiKey: VITE_ETHERSCAN_KEY,
  },
  [NETWORK.BASE]: {
    networkExplorerName: 'Basescan',
    networkExplorerUrl: 'https://basescan.org',
    networkExplorerApiUrl: 'https://api.basescan.org/api',
    safeTransactionApi: 'https://safe-transaction-base.safe.global',
    safeUrl: 'https://app.safe.global/base:',
    verifyContractUrl: 'https://basescan.org/verifyContract',
    explorerApiKey: VITE_BASESCAN_KEY,
  },
  // [NETWORK.MANTLE]: {
  //   networkExplorerName: 'Mantlescan',
  //   networkExplorerUrl: 'https://mantlescan.xyz',
  //   networkExplorerApiUrl: 'https://api.mantlescan.xyz/api',
  //   safeTransactionApi: 'https://safe-transaction-mantle.safe.global/',
  //   safeUrl: 'https://app.safe.global/mantle:',
  //   verifyContractUrl: 'https://mantlescan.xyz/verifyContract',
  //   explorerApiKey: VITE_MANTLESCAN_KEY,
  // },
  [NETWORK.BERACHAIN]: {
    networkExplorerName: 'Berascan',
    networkExplorerUrl: 'https://berascan.com',
    networkExplorerApiUrl: 'https://api.berascan.com/api',
    safeTransactionApi: 'https://safe-transaction-berachain.safe.global/',
    safeUrl: 'https://app.safe.global/berachain:',
    verifyContractUrl: 'https://berascan.com/verifyContract',
    explorerApiKey: VITE_BERASCAN_KEY,
  },
  [NETWORK.SONIC]: {
    networkExplorerName: 'Sonicscan',
    networkExplorerUrl: 'https://sonicscan.org',
    networkExplorerApiUrl: 'https://api.sonicscan.org/api',
    safeTransactionApi: 'https://safe-transaction-sonic.safe.global/',
    safeUrl: 'https://app.safe.global/sonic:',
    verifyContractUrl: 'https://sonicscan.org/verifyContract',
    explorerApiKey: VITE_SONICSCAN_KEY,
  },
  [NETWORK.CELO]: {
    networkExplorerName: 'Celoscan',
    networkExplorerUrl: 'https://celoscan.io',
    networkExplorerApiUrl: 'https://api.celoscan.io/api',
    safeTransactionApi: 'https://safe-transaction-celo.safe.global/',
    safeUrl: 'https://app.safe.global/celo:',
    verifyContractUrl: 'https://celoscan.io/verifyContract',
    explorerApiKey: VITE_CELOSCAN_KEY,
  },
}

export const getNetworkExplorerInfo = (chainId: number) => {
  const networkBaseConfig = EXPLORERS_CONFIG[chainId as NETWORK]
  if (!networkBaseConfig) return
  return {
    name: networkBaseConfig.networkExplorerName,
    url: networkBaseConfig.networkExplorerUrl,
    apiUrl: networkBaseConfig.networkExplorerApiUrl,
    apiKey: networkBaseConfig.explorerApiKey,
    safeTransactionApi: networkBaseConfig.safeTransactionApi,
    safeUrl: networkBaseConfig.safeUrl,
    verifyUrl: networkBaseConfig.verifyContractUrl,
  }
}

export const getExplorerInfo = (chainId: number, hash: string) => {
  const explorerData = getNetworkExplorerInfo(chainId)
  if (!explorerData) return
  const type = hash.length > 42 ? 'tx' : 'address'
  return () => ({
    url: `${explorerData.url}/${type}/${hash}`,
    alt: explorerData.name,
  })
}
