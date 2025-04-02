export enum NETWORK {
  MAINNET = 1,
  OPTIMISM = 10,
  BSC = 56,
  GNOSIS_CHAIN = 100,
  POLYGON = 137,
  ZKEVM = 1101,
  ARBITRUM = 42161,
  AVALANCHE = 43114,
  SEPOLIA = 11155111,
  BASE = 8453,
  BASE_SEPOLIA = 84532,
  // MANTLE = 5000,
  BERACHAIN = 80094,
  SONIC = 146,
  CELO = 42220,
}

export interface Coin {
  symbol: string
  decimals: number
}

interface Network {
  chainId: number
  name: string
  shortName: string
  nativeAsset: Coin
}

export const NATIVE_ASSET: Record<string, Coin> = {
  ETH: { symbol: 'ETH', decimals: 18 },
  XDAI: { symbol: 'xDai', decimals: 18 },
  POL: { symbol: 'POL', decimals: 18 },
  BNB: { symbol: 'BNB', decimals: 18 },
  AVAX: { symbol: 'AVAX', decimals: 18 },
  MNT: { symbol: 'MNT', decimals: 18 },
  S: { symbol: 'S', decimals: 18 },
  BERA: { symbol: 'BERA', decimals: 18 },
  CELO: { symbol: 'CELO', decimals: 18 },
}

export const NETWORKS: Record<NETWORK, Network> = {
  [NETWORK.MAINNET]: {
    chainId: NETWORK.MAINNET,
    name: 'mainnet',
    shortName: 'eth',
    nativeAsset: NATIVE_ASSET.ETH,
  },
  [NETWORK.OPTIMISM]: {
    chainId: NETWORK.OPTIMISM,
    name: 'optimism',
    shortName: 'oeth',
    nativeAsset: NATIVE_ASSET.ETH,
  },
  [NETWORK.GNOSIS_CHAIN]: {
    chainId: NETWORK.GNOSIS_CHAIN,
    name: 'gnosis_chain',
    shortName: 'gno',
    nativeAsset: NATIVE_ASSET.XDAI,
  },
  [NETWORK.BSC]: {
    chainId: NETWORK.BSC,
    name: 'binance_smart_chain',
    shortName: 'bnb',
    nativeAsset: NATIVE_ASSET.BNB,
  },
  [NETWORK.POLYGON]: {
    chainId: NETWORK.POLYGON,
    name: 'polygon',
    shortName: 'matic',
    nativeAsset: NATIVE_ASSET.POL,
  },
  [NETWORK.ZKEVM]: {
    chainId: NETWORK.ZKEVM,
    name: 'zkevm',
    shortName: 'zkevm',
    nativeAsset: NATIVE_ASSET.ETH,
  },
  [NETWORK.ARBITRUM]: {
    chainId: NETWORK.ARBITRUM,
    name: 'arbitrum',
    shortName: 'arb1',
    nativeAsset: NATIVE_ASSET.ETH,
  },
  [NETWORK.AVALANCHE]: {
    chainId: NETWORK.AVALANCHE,
    name: 'avalanche',
    shortName: 'avax',
    nativeAsset: NATIVE_ASSET.AVAX,
  },
  [NETWORK.SEPOLIA]: {
    chainId: NETWORK.SEPOLIA,
    name: 'sepolia',
    shortName: 'sep',
    nativeAsset: NATIVE_ASSET.ETH,
  },
  [NETWORK.BASE]: {
    chainId: NETWORK.BASE,
    name: 'base',
    shortName: 'base',
    nativeAsset: NATIVE_ASSET.ETH,
  },
  [NETWORK.BASE_SEPOLIA]: {
    chainId: NETWORK.BASE_SEPOLIA,
    name: 'base_sepolia',
    shortName: 'basesep',
    nativeAsset: NATIVE_ASSET.ETH,
  },
  // [NETWORK.MANTLE]: {
  //   chainId: NETWORK.MANTLE,
  //   name: 'mantle',
  //   shortName: 'mantle',
  //   nativeAsset: NATIVE_ASSET.MNT,
  // },
  [NETWORK.BERACHAIN]: {
    chainId: NETWORK.BERACHAIN,
    name: 'berachain',
    shortName: 'berachain',
    nativeAsset: NATIVE_ASSET.BERA,
  },
  [NETWORK.SONIC]: {
    chainId: NETWORK.SONIC,
    name: 'sonic',
    shortName: 'sonic',
    nativeAsset: NATIVE_ASSET.S,
  },
  [NETWORK.CELO]: {
    chainId: NETWORK.CELO,
    name: 'celo',
    shortName: 'celo',
    nativeAsset: NATIVE_ASSET.CELO,
  },
}

export const NETWORK_NATIVE_ASSET: Record<NETWORK, Coin> = {
  [NETWORK.MAINNET]: NATIVE_ASSET.ETH,
  [NETWORK.OPTIMISM]: NATIVE_ASSET.ETH,
  [NETWORK.GNOSIS_CHAIN]: NATIVE_ASSET.XDAI,
  [NETWORK.POLYGON]: NATIVE_ASSET.POL,
  [NETWORK.ZKEVM]: NATIVE_ASSET.ETH,
  [NETWORK.BSC]: NATIVE_ASSET.BNB,
  [NETWORK.ARBITRUM]: NATIVE_ASSET.ETH,
  [NETWORK.AVALANCHE]: NATIVE_ASSET.AVAX,
  [NETWORK.SEPOLIA]: NATIVE_ASSET.ETH,
  [NETWORK.BASE]: NATIVE_ASSET.ETH,
  [NETWORK.BASE_SEPOLIA]: NATIVE_ASSET.ETH,
  // [NETWORK.MANTLE]: NATIVE_ASSET.MNT,
  [NETWORK.SONIC]: NATIVE_ASSET.S,
  [NETWORK.CELO]: NATIVE_ASSET.CELO,
  [NETWORK.BERACHAIN]: NATIVE_ASSET.BERA,
}
