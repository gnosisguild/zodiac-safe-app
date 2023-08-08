import { NETWORK } from "./networks"

const isDev = process.env.NODE_ENV === "development"
const REACT_APP_ETHERSCAN_KEY = process.env.REACT_APP_ETHERSCAN_KEY
if (!REACT_APP_ETHERSCAN_KEY) {
  throw new Error("REACT_APP_ETHERSCAN_KEY is not set")
}

const REACT_APP_GOERLI_ETHERSCAN_KEY = process.env.REACT_APP_GOERLI_ETHERSCAN_KEY
if (!REACT_APP_GOERLI_ETHERSCAN_KEY) {
  throw new Error("REACT_APP_GOERLI_ETHERSCAN_KEY is not set")
}

const REACT_APP_GNOSISSCAN_KEY = process.env.REACT_APP_GNOSISSCAN_KEY
if (!isDev && !REACT_APP_GNOSISSCAN_KEY) {
  throw new Error("REACT_APP_GNOSISSCAN_KEY is not set")
}

const REACT_APP_POLYGONSCAN_KEY = process.env.REACT_APP_POLYGONSCAN_KEY
if (!isDev && !REACT_APP_POLYGONSCAN_KEY) {
  throw new Error("REACT_APP_POLYGONSCAN_KEY is not set")
}

const REACT_APP_BSCSCAN_KEY = process.env.REACT_APP_BSCSCAN_KEY
if (!isDev && !REACT_APP_BSCSCAN_KEY) {
  throw new Error("REACT_APP_BSCSCAN_KEY is not set")
}

const REACT_APP_OPTIMISTIC_ETHERSCAN_KEY = process.env.REACT_APP_OPTIMISTIC_ETHERSCAN_KEY
if (!isDev && !REACT_APP_OPTIMISTIC_ETHERSCAN_KEY) {
  throw new Error("REACT_APP_OPTIMISTIC_ETHERSCAN_KEY is not set")
}

const REACT_APP_ARBISCAN_KEY = process.env.REACT_APP_ARBISCAN_KEY
if (!isDev && !REACT_APP_ARBISCAN_KEY) {
  throw new Error("REACT_APP_ARBISCAN_KEY is not set")
}

const REACT_APP_SNWOTRACE_KEY = process.env.REACT_APP_SNWOTRACE_KEY
if (!isDev && !REACT_APP_SNWOTRACE_KEY) {
  throw new Error("REACT_APP_SNWOTRACE_KEY is not set")
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
    networkExplorerName: "Etherscan",
    networkExplorerUrl: "https://etherscan.io",
    networkExplorerApiUrl: "https://api.etherscan.io/api",
    safeTransactionApi: "https://safe-transaction-mainnet.safe.global/",
    safeUrl: "https://app.safe.global/eth:",
    verifyContractUrl: "https://etherscan.io/verifyContract",
    explorerApiKey: REACT_APP_ETHERSCAN_KEY,
  },
  [NETWORK.GOERLI]: {
    networkExplorerName: "Etherscan",
    networkExplorerUrl: "https://goerli.etherscan.io",
    networkExplorerApiUrl: "https://api-goerli.etherscan.io/api",
    safeTransactionApi: "https://safe-transaction-goerli.safe.global/",
    safeUrl: "https://app.safe.global/gor:",
    verifyContractUrl: "https://goerli.etherscan.io/verifyContract",
    explorerApiKey: REACT_APP_GOERLI_ETHERSCAN_KEY,
  },
  [NETWORK.GNOSIS_CHAIN]: {
    networkExplorerName: "GnosisScan",
    networkExplorerUrl: "https://gnosisscan.io",
    networkExplorerApiUrl: "https://api.gnosisscan.io/api",
    safeUrl: "https://app.safe.global/gno:",
    safeTransactionApi: "https://safe-transaction-gnosis-chain.safe.global/",
    verifyContractUrl: "https://gnosisscan.io/verifyContract",
    explorerApiKey: REACT_APP_GNOSISSCAN_KEY,
  },
  [NETWORK.POLYGON]: {
    networkExplorerName: "Polygonscan",
    networkExplorerUrl: "https://polygonscan.com",
    networkExplorerApiUrl: "https://api.polygonscan.com/api",
    safeUrl: "https://app.safe.global/matic:",
    safeTransactionApi: "https://safe-transaction-polygon.safe.global/",
    verifyContractUrl: "https://polygonscan.com/verifyContract",
    explorerApiKey: REACT_APP_POLYGONSCAN_KEY,
  },
  [NETWORK.BSC]: {
    networkExplorerName: "Bscscan",
    networkExplorerUrl: "https://bscscan.com/",
    networkExplorerApiUrl: "https://api.bscscan.com/api",
    safeUrl: "https://app.safe.global/bsc:",
    safeTransactionApi: "https://safe-transaction-bsc.safe.global/",
    verifyContractUrl: "https://bscscan.com/verifyContract",
    explorerApiKey: REACT_APP_BSCSCAN_KEY,
  },
  [NETWORK.OPTIMISM]: {
    networkExplorerName: "Optimism",
    networkExplorerUrl: "https://optimistic.etherscan.io/",
    networkExplorerApiUrl: "https://api-optimistic.etherscan.io/api",
    safeTransactionApi: "https://safe-transaction-optimism.safe.global/",
    safeUrl: "https://app.safe.global/oeth:",
    verifyContractUrl: "https://optimistic.etherscan.io/verifyContract",
    explorerApiKey: REACT_APP_OPTIMISTIC_ETHERSCAN_KEY,
  },
  [NETWORK.ARBITRUM]: {
    networkExplorerName: "Arbiscan",
    networkExplorerUrl: "https://arbiscan.io/",
    networkExplorerApiUrl: "https://api.arbiscan.io/api",
    safeTransactionApi: "https://safe-transaction-arbitrum.safe.global/",
    safeUrl: "https://app.safe.global/arb1:",
    verifyContractUrl: "https://arbiscan.io/verifyContract",
    explorerApiKey: REACT_APP_ARBISCAN_KEY,
  },
  [NETWORK.AVALANCHE]: {
    networkExplorerName: "Snowtrace",
    networkExplorerUrl: "https://snowtrace.io/",
    networkExplorerApiUrl: "https://api.snowtrace.io/api",
    safeTransactionApi: "https://safe-transaction-avalanche.safe.global/",
    safeUrl: "https://app.safe.global/avax:",
    verifyContractUrl: "https://snowtrace.io/verifyContract",
    explorerApiKey: REACT_APP_SNWOTRACE_KEY,
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
  const type = hash.length > 42 ? "tx" : "address"
  return () => ({
    url: `${explorerData.url}/${type}/${hash}`,
    alt: explorerData.name,
  })
}
