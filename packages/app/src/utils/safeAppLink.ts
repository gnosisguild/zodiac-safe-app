import { NETWORK, NETWORKS } from "./networks"

export const getLink = (chainId: number, safeAddress: string, appPath: string) => {
  const currentChainShortName = NETWORKS[chainId as NETWORK].shortName
  const ancestorOrigins = window.location.ancestorOrigins
  const baseUrl = ancestorOrigins != null ? ancestorOrigins[0] : "https://gnosis-safe.io"
  return `${baseUrl}/app/${currentChainShortName}:${safeAddress}/apps?appUrl=${appPath.replace(
    "#",
    "%23",
  )}`
}
