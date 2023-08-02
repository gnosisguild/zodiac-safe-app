export enum NETWORK {
  MAINNET = 1,
  GOERLI = 5,
  OPTIMISM = 10,
  BSC = 56,
  GNOSIS_CHAIN = 100,
  POLYGON = 137,
  ARBITRUM = 42161,
  AVALANCHE = 43114,
  SEPOLIA = 11155111,
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
  ETH: { symbol: "ETH", decimals: 18 },
  XDAI: { symbol: "xDai", decimals: 18 },
  MATIC: { symbol: "MATIC", decimals: 18 },
  BNB: { symbol: "BNB", decimals: 18 },
  AVAX: { symbol: "AVAX", decimals: 18 },
}

export const NETWORKS: Record<NETWORK, Network> = {
  [NETWORK.MAINNET]: {
    chainId: NETWORK.MAINNET,
    name: "mainnet",
    shortName: "eth",
    nativeAsset: NATIVE_ASSET.ETH,
  },
  [NETWORK.GOERLI]: {
    chainId: NETWORK.GOERLI,
    name: "goerli",
    shortName: "gor",
    nativeAsset: NATIVE_ASSET.ETH,
  },
  [NETWORK.OPTIMISM]: {
    chainId: NETWORK.OPTIMISM,
    name: "optimism",
    shortName: "oeth",
    nativeAsset: NATIVE_ASSET.ETH,
  },
  [NETWORK.GNOSIS_CHAIN]: {
    chainId: NETWORK.GNOSIS_CHAIN,
    name: "gnosis_chain",
    shortName: "gno",
    nativeAsset: NATIVE_ASSET.XDAI,
  },
  [NETWORK.BSC]: {
    chainId: NETWORK.BSC,
    name: "binance_smart_chain",
    shortName: "bnb",
    nativeAsset: NATIVE_ASSET.BNB,
  },
  [NETWORK.POLYGON]: {
    chainId: NETWORK.POLYGON,
    name: "polygon",
    shortName: "matic",
    nativeAsset: NATIVE_ASSET.MATIC,
  },
  [NETWORK.ARBITRUM]: {
    chainId: NETWORK.ARBITRUM,
    name: "arbitrum",
    shortName: "arb1",
    nativeAsset: NATIVE_ASSET.ETH,
  },
  [NETWORK.AVALANCHE]: {
    chainId: NETWORK.AVALANCHE,
    name: "avalanche",
    shortName: "avax",
    nativeAsset: NATIVE_ASSET.AVAX,
  },
  [NETWORK.SEPOLIA]: {
    chainId: NETWORK.SEPOLIA,
    name: "sepolia",
    shortName: "sep",
    nativeAsset: NATIVE_ASSET.ETH,
  },
}

export const NETWORK_NATIVE_ASSET: Record<NETWORK, Coin> = {
  [NETWORK.MAINNET]: NATIVE_ASSET.ETH,
  [NETWORK.GOERLI]: NATIVE_ASSET.ETH,
  [NETWORK.OPTIMISM]: NATIVE_ASSET.ETH,
  [NETWORK.GNOSIS_CHAIN]: NATIVE_ASSET.XDAI,
  [NETWORK.POLYGON]: NATIVE_ASSET.MATIC,
  [NETWORK.BSC]: NATIVE_ASSET.BNB,
  [NETWORK.ARBITRUM]: NATIVE_ASSET.ETH,
  [NETWORK.AVALANCHE]: NATIVE_ASSET.AVAX,
  [NETWORK.SEPOLIA]: NATIVE_ASSET.ETH,
}
