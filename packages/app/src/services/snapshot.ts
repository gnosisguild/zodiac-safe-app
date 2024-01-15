import snapshot from "@snapshot-labs/snapshot.js"
import * as R from "ramda"
import { NETWORK } from "utils/networks"

const SNAPSHOT_HUB = "https://hub.snapshot.org"
const SNAPSHOT_HUB_GOERLI = "https://testnet.hub.snapshot.org"
const SNAPSHOT_SPACE = "https://snapshot.org"
const SNAPSHOT_SPACE_GOERLI = "https://testnet.snapshot.org"

// Returns snapshot space settings, or undefined if no space was found for the ENS name.
export const getSnapshotSpaceSettings = async (ensName: string, chainId: number) => {
  await updateSnapshotCache(ensName, chainId) // make sure that the returned snapshot space settings is the newest version
  const res = await fetch(`${getHubUrl(chainId)}/api/spaces/${ensName}`)
  if (res.ok) {
    try {
      return await res.json().then((res) => {
        // Remove flagged, verified, hibernated, and turbo properties from res, as they are not part of the space config, but rater extra info from the server.
        const { flagged, verified, hibernated, turbo, ...filteredRes } = res
        return filteredRes
      })
    } catch (error) {
      return undefined // there is not snapshot space for this ENS
    }
  } else {
    throw res
  }
}

export const validateSchema = (spaceSettings: any) =>
  snapshot.utils.validateSchema(snapshot.schemas.space, spaceSettings)

export const updateSnapshotCache = (ensName: string, chainId: number) =>
  fetch(`${getHubUrl(chainId)}/api/spaces/${ensName}/poke`)

export const verifyNewSnapshotSettings = (originalSettings: any, newSettings: any) =>
  R.and(
    // check that there are no unintended changes to the new Snapshot Space settings
    R.equals(
      R.omit(["plugins", "safeSnap"], originalSettings),
      R.omit(["plugins", "safeSnap"], newSettings),
    ),
    // validate the schema
    // we must be strict here, if not a truthy error value can be returned
    validateSchema(newSettings) === true,
  )

const getHubUrl = (chainId: number) =>
  chainId === NETWORK.GOERLI ? SNAPSHOT_HUB_GOERLI : SNAPSHOT_HUB

export const getSnapshotSpaceUrl = (chainId: number, ensName: string) =>
  (chainId === NETWORK.GOERLI ? SNAPSHOT_SPACE_GOERLI : SNAPSHOT_SPACE) + `/#/${ensName}`
