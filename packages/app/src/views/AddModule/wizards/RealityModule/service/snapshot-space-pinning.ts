const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL

if (BACKEND_API_URL == null) {
  throw new Error("BACKEND_API_URL not set")
}

interface RequestType {
  snapshotSpaceEnsName: string
  snapshotSpaceSettings: any
}

interface Responds {
  cidV1: string
}

export const pinSnapshotSpace: (request: RequestType) => Promise<Responds> = async (
  request,
) => {
  const res = await fetch(BACKEND_API_URL + "/ipfs-pinning/snapshot-settings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(request),
  })
  return res.json()
}
