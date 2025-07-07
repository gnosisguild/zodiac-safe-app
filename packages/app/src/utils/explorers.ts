import { NETWORK } from './networks'

interface ExplorerData {
  networkExplorerName: string
  networkExplorerUrl: string
  networkExplorerApiUrl: string
  safeTransactionApi: string
  safeUrl: string
  verifyContractUrl: string
}

const ETHERSCAN_API_KEY = '6RJ8KT4B1S9V7E3CIYECNY7HFW8IPWQ3C4'

export const EXPLORERS_CONFIG: Record<NETWORK, ExplorerData> = {
  [NETWORK.MAINNET]: {
    networkExplorerName: 'Etherscan',
    networkExplorerUrl: 'https://etherscan.io',
    networkExplorerApiUrl: 'https://api.etherscan.io/api',
    safeTransactionApi: 'https://safe-transaction-mainnet.safe.global/',
    safeUrl: 'https://app.safe.global/eth:',
    verifyContractUrl: 'https://etherscan.io/verifyContract',
  },
  [NETWORK.GNOSIS_CHAIN]: {
    networkExplorerName: 'GnosisScan',
    networkExplorerUrl: 'https://gnosisscan.io',
    networkExplorerApiUrl: 'https://api.gnosisscan.io/api',
    safeUrl: 'https://app.safe.global/gno:',
    safeTransactionApi: 'https://safe-transaction-gnosis-chain.safe.global/',
    verifyContractUrl: 'https://gnosisscan.io/verifyContract',
  },
  [NETWORK.GOERLI]: {
    networkExplorerName: 'Etherscan',
    networkExplorerUrl: 'https://goerli.etherscan.io',
    networkExplorerApiUrl: 'https://api-goerli.etherscan.io/api',
    safeTransactionApi: 'https://safe-transaction-goerli.safe.global/',
    safeUrl: 'https://app.safe.global/gor:',
    verifyContractUrl: 'https://goerli.etherscan.io/verifyContract',
  },
  [NETWORK.ARBITRUM]: {
    networkExplorerName: 'Arbiscan',
    networkExplorerUrl: 'https://arbiscan.io/',
    networkExplorerApiUrl: 'https://api.arbiscan.io/api',
    safeTransactionApi: 'https://safe-transaction-arbitrum.safe.global/',
    safeUrl: 'https://app.safe.global/arb1:',
    verifyContractUrl: 'https://arbiscan.io/verifyContract',
  },
  [NETWORK.OPTIMISM]: {
    networkExplorerName: 'Optimism',
    networkExplorerUrl: 'https://optimistic.etherscan.io/',
    networkExplorerApiUrl: 'https://api-optimistic.etherscan.io/api',
    safeTransactionApi: 'https://safe-transaction-optimism.safe.global/',
    safeUrl: 'https://app.safe.global/oeth:',
    verifyContractUrl: 'https://optimistic.etherscan.io/verifyContract',
  },
  [NETWORK.POLYGON]: {
    networkExplorerName: 'Polygonscan',
    networkExplorerUrl: 'https://polygonscan.com',
    networkExplorerApiUrl: 'https://api.polygonscan.com/api',
    safeUrl: 'https://app.safe.global/matic:',
    safeTransactionApi: 'https://safe-transaction-polygon.safe.global/',
    verifyContractUrl: 'https://polygonscan.com/verifyContract',
  },
  [NETWORK.ZKEVM]: {
    networkExplorerName: 'Polygonscan',
    networkExplorerUrl: 'https://zkevm.polygonscan.com',
    networkExplorerApiUrl: 'https://api-zkevm.polygonscan.com/api',
    safeTransactionApi: 'https://safe-transaction-zkevm.safe.global/',
    safeUrl: 'https://app.safe.global/zkevm:',
    verifyContractUrl: 'https://zkevm.polygonscan.com/verifyContract',
  },
  [NETWORK.AVALANCHE]: {
    networkExplorerName: 'Snowtrace',
    networkExplorerUrl: 'https://snowtrace.io/',
    networkExplorerApiUrl: 'https://api.snowtrace.io/api',
    safeTransactionApi: 'https://safe-transaction-avalanche.safe.global/',
    safeUrl: 'https://app.safe.global/avax:',
    verifyContractUrl: 'https://snowtrace.io/verifyContract',
  },
  [NETWORK.BSC]: {
    networkExplorerName: 'BscScan',
    networkExplorerUrl: 'https://bscscan.com/',
    networkExplorerApiUrl: 'https://api.bscscan.com/api',
    safeUrl: 'https://app.safe.global/bsc:',
    safeTransactionApi: 'https://safe-transaction-bsc.safe.global/',
    verifyContractUrl: 'https://bscscan.com/verifyContract',
  },
  [NETWORK.HARDHAT_NETWORK]: {
    networkExplorerName: 'Hardhat',
    networkExplorerUrl: 'http://localhost:8545',
    networkExplorerApiUrl: 'http://localhost:8545',
    safeTransactionApi: 'http://localhost:8545',
    safeUrl: 'http://localhost:8545',
    verifyContractUrl: 'http://localhost:8545',
  },
  [NETWORK.LINEA]: {
    networkExplorerName: 'Lineascan',
    networkExplorerUrl: 'https://lineascan.build',
    networkExplorerApiUrl: 'https://api.lineascan.build/api',
    safeTransactionApi: 'https://safe-transaction-linea.safe.global/',
    safeUrl: 'https://app.safe.global/linea:',
    verifyContractUrl: 'https://lineascan.build/verifyContract',
  },
  [NETWORK.LINEA_GOERLI]: {
    networkExplorerName: 'Lineascan',
    networkExplorerUrl: 'https://goerli.lineascan.build',
    networkExplorerApiUrl: 'https://api-testnet.lineascan.build/api',
    safeTransactionApi: 'https://safe-transaction-linea-goerli.safe.global/',
    safeUrl: 'https://app.safe.global/linea-goerli:',
    verifyContractUrl: 'https://goerli.lineascan.build/verifyContract',
  },
  [NETWORK.SEPOLIA]: {
    networkExplorerName: 'Etherscan',
    networkExplorerUrl: 'https://sepolia.etherscan.io',
    networkExplorerApiUrl: 'https://api-sepolia.etherscan.io/api',
    safeTransactionApi: 'https://safe-transaction-sepolia.safe.global/',
    safeUrl: 'https://app.safe.global/sep:',
    verifyContractUrl: 'https://sepolia.etherscan.io/verifyContract',
  },
  [NETWORK.BASE]: {
    networkExplorerName: 'Basescan',
    networkExplorerUrl: 'https://basescan.org',
    networkExplorerApiUrl: 'https://api.basescan.org/api',
    safeTransactionApi: 'https://safe-transaction-base.safe.global',
    safeUrl: 'https://app.safe.global/base:',
    verifyContractUrl: 'https://basescan.org/verifyContract',
  },
  [NETWORK.BASE_SEPOLIA]: {
    networkExplorerName: 'BaseScan',
    networkExplorerUrl: 'https://sepolia.basescan.org',
    networkExplorerApiUrl: 'https://api-sepolia.basescan.org/api',
    safeTransactionApi: 'https://safe-transaction-base-sepolia.safe.global/',
    safeUrl: 'https://app.safe.global/basesep:',
    verifyContractUrl: 'https://sepolia.basescan.org/verifyContract',
  },
  [NETWORK.MANTLE]: {
    networkExplorerName: 'Mantlescan',
    networkExplorerUrl: 'https://mantlescan.xyz',
    networkExplorerApiUrl: 'https://api.mantlescan.xyz/api',
    safeTransactionApi: 'https://safe-transaction-mantle.safe.global/',
    safeUrl: 'https://app.safe.global/mantle:',
    verifyContractUrl: 'https://mantlescan.xyz/verifyContract',
  },
  [NETWORK.BERACHAIN]: {
    networkExplorerName: 'Berascan',
    networkExplorerUrl: 'https://berascan.com',
    networkExplorerApiUrl: 'https://api.berascan.com/api',
    safeTransactionApi: 'https://safe-transaction-berachain.safe.global/',
    safeUrl: 'https://app.safe.global/berachain:',
    verifyContractUrl: 'https://berascan.com/verifyContract',
  },
  [NETWORK.SONIC]: {
    networkExplorerName: 'Sonicscan',
    networkExplorerUrl: 'https://explorer.soniclabs.com',
    networkExplorerApiUrl: 'https://api.sonicscan.org/api',
    safeTransactionApi: 'https://safe-transaction-sonic.safe.global/',
    safeUrl: 'https://app.safe.global/sonic:',
    verifyContractUrl: 'https://explorer.soniclabs.com/verifyContract',
  },
  [NETWORK.CELO]: {
    networkExplorerName: 'Celoscan',
    networkExplorerUrl: 'https://celoscan.io',
    networkExplorerApiUrl: 'https://api.celoscan.io/api',
    safeTransactionApi: 'https://safe-transaction-celo.safe.global/',
    safeUrl: 'https://app.safe.global/celo:',
    verifyContractUrl: 'https://celoscan.io/verifyContract',
  },
  [NETWORK.BOB]: {
    networkExplorerName: 'Bobscout',
    networkExplorerUrl: 'https://explorer.gobob.xyz',
    networkExplorerApiUrl: 'https://api.gobob.xyz/api',
    safeTransactionApi: 'https://safe-transaction-bob.safe.global/',
    safeUrl: 'https://app.safe.global/bob:',
    verifyContractUrl: 'https://explorer.gobob.xyz/verifyContract',
  },
  [NETWORK.HYPER_EVM]: {
    networkExplorerName: 'Wanscan',
    networkExplorerUrl: 'https://purrsec.com',
    networkExplorerApiUrl: 'https://api.purrsec.com/api',
    safeTransactionApi: 'https://safe-transaction-hyper-evm.safe.global/',
    safeUrl: 'https://app.safe.global/hyperevm:',
    verifyContractUrl: '',
  },
  [NETWORK.WORLD_CHAIN]: {
    networkExplorerName: 'Worldscan',
    networkExplorerUrl: 'https://explorer.worldcoin.org',
    networkExplorerApiUrl: 'https://api.worldcoin.org/api',
    safeTransactionApi: 'https://safe-transaction-world-chain.safe.global/',
    safeUrl: 'https://app.safe.global/wc:',
    verifyContractUrl: 'https://explorer.worldcoin.org/verifyContract',
  },
  [NETWORK.FLARE]: {
    networkExplorerName: 'Flare Explorer',
    networkExplorerUrl: 'https://flare-explorer.flare.network',
    networkExplorerApiUrl: 'https://api.flare.network/api',
    safeTransactionApi: 'https://safe-transaction-flare.safe.global/',
    safeUrl: 'https://app.safe.global/flr:',
    verifyContractUrl: 'https://flare-explorer.flare.network/verifyContract',
  },
  [NETWORK.INK]: {
    networkExplorerName: 'Ink Explorer',
    networkExplorerUrl: 'https://explorer.ink',
    networkExplorerApiUrl: 'https://api.ink/api',
    safeTransactionApi: 'https://safe-transaction-ink.safe.global/',
    safeUrl: 'https://app.safe.global/ink:',
    verifyContractUrl: 'https://explorer.ink/verifyContract',
  },
  [NETWORK.HEMI]: {
    networkExplorerName: 'Hemi Explorer',
    networkExplorerUrl: 'https://explorer.hemi.network',
    networkExplorerApiUrl: 'https://api.hemi.network/api',
    safeTransactionApi: 'https://safe-transaction-hemi.safe.global/',
    safeUrl: 'https://app.safe.global/hemi:',
    verifyContractUrl: 'https://explorer.hemi.network/verifyContract',
  },
  [NETWORK.KATANA]: {
    networkExplorerName: 'Katana Explorer',
    networkExplorerUrl: 'https://explorer.katana.network',
    networkExplorerApiUrl: 'https://api.katana.network/api',
    safeTransactionApi: 'https://safe-transaction-katana.safe.global/',
    safeUrl: 'https://app.safe.global/katana:',
    verifyContractUrl: 'https://explorer.katana.network/verifyContract',
  },
  [NETWORK.LENS]: {
    networkExplorerName: 'Lens Explorer',
    networkExplorerUrl: 'https://explorer.lens.xyz',
    networkExplorerApiUrl: 'https://api.lens.xyz/api',
    safeTransactionApi: 'https://safe-transaction-lens.safe.global/',
    safeUrl: 'https://app.safe.global/lens:',
    verifyContractUrl: 'https://explorer.lens.xyz/verifyContract',
  },
  [NETWORK.PEAQ]: {
    networkExplorerName: 'Peaq Explorer',
    networkExplorerUrl: 'https://explorer.peaq.network',
    networkExplorerApiUrl: 'https://api.peaq.network/api',
    safeTransactionApi: 'https://safe-transaction-peaq.safe.global/',
    safeUrl: 'https://app.safe.global/PEAQ:',
    verifyContractUrl: 'https://explorer.peaq.network/verifyContract',
  },
  [NETWORK.UNICHAIN]: {
    networkExplorerName: 'Unichain Explorer',
    networkExplorerUrl: 'https://explorer.unichain.world',
    networkExplorerApiUrl: 'https://api.unichain.world/api',
    safeTransactionApi: 'https://safe-transaction-unichain.safe.global/',
    safeUrl: 'https://app.safe.global/unichain:',
    verifyContractUrl: 'https://explorer.unichain.world/verifyContract',
  },
  [NETWORK.ZKSYNC]: {
    networkExplorerName: 'zkScan',
    networkExplorerUrl: 'https://explorer.zksync.io',
    networkExplorerApiUrl: 'https://api.zksync.io/api',
    safeTransactionApi: 'https://safe-transaction-zksync.safe.global/',
    safeUrl: 'https://app.safe.global/zksync:',
    verifyContractUrl: 'https://explorer.zksync.io/verifyContract',
  },
  [NETWORK.SCROLL]: {
    networkExplorerName: 'Scrollscan',
    networkExplorerUrl: 'https://scrollscan.com',
    networkExplorerApiUrl: 'https://api.scrollscan.com/api',
    safeTransactionApi: 'https://safe-transaction-scroll.safe.global/',
    safeUrl: 'https://app.safe.global/scroll:',
    verifyContractUrl: 'https://scrollscan.com/verifyContract',
  },
  [NETWORK.AURORA]: {
    networkExplorerName: 'Aurorascan',
    networkExplorerUrl: 'https://aurorascan.dev',
    networkExplorerApiUrl: 'https://api.aurorascan.dev/api',
    safeTransactionApi: 'https://safe-transaction-aurora.safe.global/',
    safeUrl: 'https://app.safe.global/aurora:',
    verifyContractUrl: 'https://aurorascan.dev/verifyContract',
  },
  [NETWORK.GNOSIS_CHIADO]: {
    networkExplorerName: 'Chiado Explorer',
    networkExplorerUrl: 'https://blockscout.chiadochain.net',
    networkExplorerApiUrl: 'https://blockscout.chiadochain.net/api',
    safeTransactionApi: 'https://safe-transaction-gnosis-chiado.safe.global/',
    safeUrl: 'https://app.safe.global/chi:',
    verifyContractUrl: 'https://blockscout.chiadochain.net/verifyContract',
  },
}

export const getNetworkExplorerInfo = (chainId: number) => {
  const networkBaseConfig = EXPLORERS_CONFIG[chainId as NETWORK]
  if (!networkBaseConfig) return
  return {
    name: networkBaseConfig.networkExplorerName,
    url: networkBaseConfig.networkExplorerUrl,
    apiUrl: networkBaseConfig.networkExplorerApiUrl,
    apiKey: ETHERSCAN_API_KEY,
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
