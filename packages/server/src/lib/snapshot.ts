import snapshot from "@snapshot-labs/snapshot.js"
import * as R from "ramda"
import axios from "axios"
const SNAPSHOT_HUB = "https://hub.snapshot.org"
const TESTNET_SNAPSHOT_HUB = "https://testnet.hub.snapshot.org"
const SNAPSHOT_SPACE = "https://snapshot.org"
const DEMO_SNAPSHOT_SPACE = "https://demo.snapshot.org"
const CHAIN_ID_SEPOLIA = 11155111

// Returns snapshot space settings, or undefined if no space was found for the ENS name.
export const getSnapshotSpaceSettings = async (ensName: string, chainId: number) => {
  await updateSnapshotCache(ensName, chainId) // make sure that the returned snapshot space settings is the newest version
  const res = await axios.get(`${getHubUrl(chainId)}/api/spaces/${ensName}`)
  console.log("getSnapshotSpaceSettings data =>", res.data)
  const spaceConfig = res.data

  if (spaceConfig) {
    // Remove flagged, verified, hibernated, and turbo properties from res, as they are not part of the space config, but rater extra info from the server.
    const { flagged, verified, hibernated, turbo, ...filteredRes } = spaceConfig
    return filteredRes
  } else {
    throw res
  }
}

export const validateSchema = (spaceSettings: any) => {
  snapshot.utils.validateSchema(snapshot.schemas.space, spaceSettings)
  return true
}
export const updateSnapshotCache = async (ensName: string, chainId: number) => {
  const snapshot = await axios.get(`${getHubUrl(chainId)}/api/spaces/${ensName}/poke`)
  return snapshot.data
}

export const verifyNewSnapshotSettings = (originalSettings: any, newSettings: any) => {
  const originalOmitted = R.omit(["plugins", "safeSnap"], originalSettings)
  const newOmitted = R.omit(["plugins", "safeSnap"], newSettings)
  const areEqual = R.equals(originalOmitted, newOmitted)
  const isValid = validateSchema(newSettings) === true

  console.log("Are Equal: ", areEqual)
  console.log("Is Valid: ", isValid)

  return R.and(areEqual, isValid)
}
// R.and(
//   // check that there are no unintended changes to the new Snapshot Space settings
//   R.equals(
//     R.omit(["plugins", "safeSnap"], originalSettings),
//     R.omit(["plugins", "safeSnap"], newSettings),
//   ),
//   // validate the schema
//   // we must be strict here, if not a truthy error value can be returned
//   validateSchema(newSettings) === true,
// )

const getHubUrl = (chainId: number) =>
  chainId === CHAIN_ID_SEPOLIA ? TESTNET_SNAPSHOT_HUB : SNAPSHOT_HUB

export const getSnapshotSpaceUrl = (chainId: number, ensName: string) =>
  (chainId === CHAIN_ID_SEPOLIA ? DEMO_SNAPSHOT_SPACE : SNAPSHOT_SPACE) + `/#/${ensName}`
