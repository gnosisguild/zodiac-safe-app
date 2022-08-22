import snapshot from "@snapshot-labs/snapshot.js";

const SNAPSHOT_HUB = process.env.REACT_APP_SNAPSHOT_HUB;

export const getSnapshotSpaceSettings = (ensName: string) =>
  fetch(`${SNAPSHOT_HUB}/api/spaces/${ensName}`).then((res) => {
    if (res.ok) return res.json();
    throw res;
  });

export const validateSchema = (spaceSettings: any) =>
  snapshot.utils.validateSchema(snapshot.schemas.space, spaceSettings);
