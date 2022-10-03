export enum NETWORK {
  MAINNET = 1,
  RINKEBY = 4,
  GOERLI = 5,
  XDAI = 100,
  BSC = 56,
  GNOSIS_CHAIN = 100,
  POLYGON = 137,
}

export interface Coin {
  symbol: string
  decimals: number
}

export const NATIVE_ASSET: Record<string, Coin> = {
  ETH: { symbol: "ETH", decimals: 18 },
  XDAI: { symbol: "xDai", decimals: 18 },
  MATIC: { symbol: "MATIC", decimals: 18 },
  BNB: { symbol: "BNB", decimals: 18 },
}

export const NETWORK_NATIVE_ASSET: Record<NETWORK, Coin> = {
  [NETWORK.MAINNET]: NATIVE_ASSET.ETH,
  [NETWORK.RINKEBY]: NATIVE_ASSET.ETH,
  [NETWORK.GOERLI]: NATIVE_ASSET.ETH,
  [NETWORK.XDAI]: NATIVE_ASSET.XDAI,
  [NETWORK.POLYGON]: NATIVE_ASSET.MATIC,
  [NETWORK.BSC]: NATIVE_ASSET.BNB,
}

export enum ChainNames {
  MAINNET = "mainnet",
  RINKEBY = "rinkeby",
  GNOSIS_CHAIN = "gnosis_chain",
  GOERLI = "goerli",
  POLYGON = "polygon",
  ARBITRUM = "arbitrum",
  OPTIMISM = "optimism",
  OPTIMISM_ON_GNOSIS_CHAIN = "optimism_on_gnosis_chain",
}

export const chainIdToChainName = (chainId: number) => {
  switch (chainId) {
    case NETWORK.MAINNET:
      return ChainNames.MAINNET
    case NETWORK.RINKEBY:
      return ChainNames.RINKEBY
    case NETWORK.GNOSIS_CHAIN:
      return ChainNames.GNOSIS_CHAIN
    case NETWORK.GOERLI:
      return ChainNames.GOERLI
    case NETWORK.POLYGON:
      return ChainNames.POLYGON
    default:
      return ChainNames.MAINNET
  }
}

export function getNetworkNativeAsset(network: NETWORK) {
  return NETWORK_NATIVE_ASSET[network]
}
