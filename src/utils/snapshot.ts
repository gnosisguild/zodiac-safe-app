import snapshot from "@snapshot-labs/snapshot.js"

const SNAPSHOT_HUB = process.env.REACT_APP_SNAPSHOT_HUB

export const getSnapshotSpaceSettings = async (ensName: string) => {
  try {
    const response = fetch(`${SNAPSHOT_HUB}/api/spaces/${ensName}`).then((res) => {
      if (res.ok) {
        return res.json().catch(() => {
          console.error(`We couldn't find your snapshot space`)
          return null
        })
      }
      throw res
    })
    return response
  } catch (error) {
    console.error(error)
  }
}

export const validateSchema = (spaceSettings: any) =>
  snapshot.utils.validateSchema(snapshot.schemas.space, spaceSettings)
