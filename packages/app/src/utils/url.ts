import { SafeInfo } from "@gnosis.pm/safe-apps-sdk"
import { NETWORK, NETWORKS } from "./networks"

export function safeAppUrl(safeInfo: SafeInfo, appUrl: string) {
  const base = "https://gnosis-safe.io"
  const prefix = chainPrefix(safeInfo)
  const pathname = `/app/${prefix}:${safeInfo.safeAddress}/apps`
  const params = new URLSearchParams({ appUrl })

  return new URL(`${base}${pathname}?${params}`).href
}

export function rolesV1AppUrl(safeInfo: SafeInfo, rolesAddress: string) {
  const base = "https://roles-v1.gnosisguild.org"
  const prefix = chainPrefix(safeInfo)

  return new URL(`${base}/#/${prefix}:${rolesAddress}`).href
}

export function rolesV2AppUrl(safeInfo: SafeInfo, rolesAddress: string) {
  const base = "http://localhost:3000" //"https://roles.gnosisguild.org"
  const prefix = chainPrefix(safeInfo)

  return new URL(`${base}/${prefix}:${rolesAddress}`).href
}

function chainPrefix(safeInfo: SafeInfo): string {
  return NETWORKS[safeInfo.chainId as NETWORK].shortName
}
