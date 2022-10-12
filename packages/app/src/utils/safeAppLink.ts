import { NETWORK, NETWORKS } from "./networks"

export const getLink = (chainId: number, safeAddress: string, appPath: string) => {
  const currentChainShortName = NETWORKS[chainId as NETWORK].shortName
  const prevUrl = window.location.ancestorOrigins[0]
  if (prevUrl == null) {
    return undefined
  }
  return `${prevUrl}/app/${currentChainShortName}:${safeAddress}/apps?appUrl=${appPath.replace(
    "#",
    "%23",
  )}`
}
