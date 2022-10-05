import snapshot from "@snapshot-labs/snapshot.js"
import * as R from "ramda"
import fetch from "node-fetch"

const SNAPSHOT_HUB = process.env.SNAPSHOT_HUB

// Returns snapshot space settings, or undefined if no space was found for the ENS name.
export const getSnapshotSpaceSettings = async (ensName: string) => {
  await updateSnapshotCache(ensName) // make sure that the returned snapshot space settings is the newest version
  const res = await fetch(`${SNAPSHOT_HUB}/api/spaces/${ensName}`)
  if (res.ok) {
    try {
      return await res.json()
    } catch (error) {
      return undefined // there is not snapshot space for this ENS
    }
  } else {
    throw res
  }
}

export const validateSchema = (spaceSettings: any) =>
  snapshot.utils.validateSchema(snapshot.schemas.space, spaceSettings)

export const updateSnapshotCache = async (ensName: string) =>
  fetch(`${SNAPSHOT_HUB}/api/spaces/${ensName}/poke`)

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
