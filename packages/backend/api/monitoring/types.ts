import { NotificationType } from "defender-sentinel-client"

export interface Body {
  apiKey: string
  apiSecret: string
  network: Network
  realityModuleAddress: string
  notificationChannels: [
    {
      channel: NotificationType
      config: any
    },
  ]
}

export type Network =
  | "mainnet"
  | "rinkeby"
  | "ropsten"
  | "kovan"
  | "goerli"
  | "xdai"
  | "sokol"
  | "fuse"
  | "bsc"
  | "bsctest"
  | "fantom"
  | "fantomtest"
  | "moonbase"
  | "moonriver"
  | "moonbeam"
  | "matic"
  | "mumbai"
  | "avalanche"
  | "fuji"
  | "optimism"
  | "optimism-kovan"
  | "optimism-goerli"
  | "arbitrum"
  | "arbitrum-rinkeby"
  | "arbitrum-goerli"
  | "celo"
  | "alfajores"
  | "harmony-s0"
  | "harmony-test-s0"
  | "aurora"
  | "auroratest"
  | "hedera"
  | "hederatest"
