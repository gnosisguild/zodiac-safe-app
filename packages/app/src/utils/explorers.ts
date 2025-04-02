import { NETWORK } from './networks'

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
    explorerApiKey: '6RJ8KT4B1S9V7E3CIYECNY7HFW8IPWQ3C4',
  },
  [NETWORK.GNOSIS_CHAIN]: {
    networkExplorerName: 'GnosisScan',
    networkExplorerUrl: 'https://gnosisscan.io',
    networkExplorerApiUrl: 'https://api.gnosisscan.io/api',
    safeUrl: 'https://app.safe.global/gno:',
    safeTransactionApi: 'https://safe-transaction-gnosis-chain.safe.global/',
    verifyContractUrl: 'https://gnosisscan.io/verifyContract',
    explorerApiKey: 'ZWZWSHX4X7K8G1ZFRETI4DERP2ZI5Y2QGF',
  },
  [NETWORK.POLYGON]: {
    networkExplorerName: 'Polygonscan',
    networkExplorerUrl: 'https://polygonscan.com',
    networkExplorerApiUrl: 'https://api.polygonscan.com/api',
    safeUrl: 'https://app.safe.global/matic:',
    safeTransactionApi: 'https://safe-transaction-polygon.safe.global/',
    verifyContractUrl: 'https://polygonscan.com/verifyContract',
    explorerApiKey: 'NM937M1IZXVQ6QVDXS73XMF8JSAB677JWQ',
  },
  [NETWORK.ZKEVM]: {
    networkExplorerName: 'Polygonscan',
    networkExplorerUrl: 'https://zkevm.polygonscan.com',
    networkExplorerApiUrl: 'https://api-zkevm.polygonscan.com/api',
    safeTransactionApi: 'https://safe-transaction-zkevm.safe.global/',
    safeUrl: 'https://app.safe.global/zkevm:',
    verifyContractUrl: 'https://zkevm.polygonscan.com/verifyContract',
    explorerApiKey: 'NM937M1IZXVQ6QVDXS73XMF8JSAB677JWQ',
  },
  [NETWORK.BSC]: {
    networkExplorerName: 'BscScan',
    networkExplorerUrl: 'https://bscscan.com/',
    networkExplorerApiUrl: 'https://api.bscscan.com/api',
    safeUrl: 'https://app.safe.global/bsc:',
    safeTransactionApi: 'https://safe-transaction-bsc.safe.global/',
    verifyContractUrl: 'https://bscscan.com/verifyContract',
    explorerApiKey: 'AMXEAU3N9P7RJHFSZ7KAJDRY5MFJ1N29D6',
  },
  [NETWORK.OPTIMISM]: {
    networkExplorerName: 'Optimism',
    networkExplorerUrl: 'https://optimistic.etherscan.io/',
    networkExplorerApiUrl: 'https://api-optimistic.etherscan.io/api',
    safeTransactionApi: 'https://safe-transaction-optimism.safe.global/',
    safeUrl: 'https://app.safe.global/oeth:',
    verifyContractUrl: 'https://optimistic.etherscan.io/verifyContract',
    explorerApiKey: 'IG8IW3N3CKCZPV5U14HQ56K9TEPX9SWXX4',
  },
  [NETWORK.ARBITRUM]: {
    networkExplorerName: 'Arbiscan',
    networkExplorerUrl: 'https://arbiscan.io/',
    networkExplorerApiUrl: 'https://api.arbiscan.io/api',
    safeTransactionApi: 'https://safe-transaction-arbitrum.safe.global/',
    safeUrl: 'https://app.safe.global/arb1:',
    verifyContractUrl: 'https://arbiscan.io/verifyContract',
    explorerApiKey: 'CSITWCYI9UDAJ7QS92FNVJ2XQP5B23P4J9',
  },
  [NETWORK.AVALANCHE]: {
    networkExplorerName: 'Snowtrace',
    networkExplorerUrl: 'https://snowtrace.io/',
    networkExplorerApiUrl: 'https://api.snowtrace.io/api',
    safeTransactionApi: 'https://safe-transaction-avalanche.safe.global/',
    safeUrl: 'https://app.safe.global/avax:',
    verifyContractUrl: 'https://snowtrace.io/verifyContract',
    explorerApiKey: 'IAST9REKWMIW1QSE2M7K2IKKAZVNQPHC1U',
  },
  [NETWORK.SEPOLIA]: {
    networkExplorerName: 'Etherscan',
    networkExplorerUrl: 'https://sepolia.etherscan.io',
    networkExplorerApiUrl: 'https://api-sepolia.etherscan.io/api',
    safeTransactionApi: 'https://safe-transaction-sepolia.safe.global/',
    safeUrl: 'https://app.safe.global/sep:',
    verifyContractUrl: 'https://sepolia.etherscan.io/verifyContract',
    explorerApiKey: '6RJ8KT4B1S9V7E3CIYECNY7HFW8IPWQ3C4',
  },
  [NETWORK.BASE_SEPOLIA]: {
    networkExplorerName: 'BaseScan',
    networkExplorerUrl: 'https://sepolia.basescan.org',
    networkExplorerApiUrl: 'https://api-sepolia.basescan.org/api',
    safeTransactionApi: 'https://safe-transaction-base-sepolia.safe.global/',
    safeUrl: 'https://app.safe.global/basesep:',
    verifyContractUrl: 'https://sepolia.basescan.org/verifyContract',
    explorerApiKey: 'ZSBW5JZVFZIB19V7YBG14KQFTUXFT8BDNS',
  },
  [NETWORK.BASE]: {
    networkExplorerName: 'Basescan',
    networkExplorerUrl: 'https://basescan.org',
    networkExplorerApiUrl: 'https://api.basescan.org/api',
    safeTransactionApi: 'https://safe-transaction-base.safe.global',
    safeUrl: 'https://app.safe.global/base:',
    verifyContractUrl: 'https://basescan.org/verifyContract',
    explorerApiKey: 'ZSBW5JZVFZIB19V7YBG14KQFTUXFT8BDNS',
  },
  // [NETWORK.MANTLE]: {
  //   networkExplorerName: 'Mantlescan',
  //   networkExplorerUrl: 'https://mantlescan.xyz',
  //   networkExplorerApiUrl: 'https://api.mantlescan.xyz/api',
  //   safeTransactionApi: 'https://safe-transaction-mantle.safe.global/',
  //   safeUrl: 'https://app.safe.global/mantle:',
  //   verifyContractUrl: 'https://mantlescan.xyz/verifyContract',
  //   explorerApiKey: 'XGKTSFD523UP64KEFWD5EDA5W1N6BBXZFT',
  // },
  [NETWORK.BERACHAIN]: {
    networkExplorerName: 'Berascan',
    networkExplorerUrl: 'https://berascan.com',
    networkExplorerApiUrl: 'https://api.berascan.com/api',
    safeTransactionApi: 'https://safe-transaction-berachain.safe.global/',
    safeUrl: 'https://app.safe.global/berachain:',
    verifyContractUrl: 'https://berascan.com/verifyContract',
    explorerApiKey: 'X39RQV6MWGUB3W4NC4VI6YM4MTYMCFN8Y9',
  },
  [NETWORK.SONIC]: {
    networkExplorerName: 'Sonicscan',
    networkExplorerUrl: 'https://sonicscan.org',
    networkExplorerApiUrl: 'https://api.sonicscan.org/api',
    safeTransactionApi: 'https://safe-transaction-sonic.safe.global/',
    safeUrl: 'https://app.safe.global/sonic:',
    verifyContractUrl: 'https://sonicscan.org/verifyContract',
    explorerApiKey: '4PKXQYT2DGQXHSINRFY4UM8RUFJHR9V1TX',
  },
  [NETWORK.CELO]: {
    networkExplorerName: 'Celoscan',
    networkExplorerUrl: 'https://celoscan.io',
    networkExplorerApiUrl: 'https://api.celoscan.io/api',
    safeTransactionApi: 'https://safe-transaction-celo.safe.global/',
    safeUrl: 'https://app.safe.global/celo:',
    verifyContractUrl: 'https://celoscan.io/verifyContract',
    explorerApiKey: '8ME8R1XQAGXK15UXPAFI46JTPP5NQ7WEMC',
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
