import type { VercelRequest, VercelResponse } from "@vercel/node"
import * as snapshot from "./snapshot"
import { create } from "ipfs-http-client"
import fetch from "node-fetch"

const PINNING_SERVICES_API_URL = process.env.PINNING_SERVICES_API_URL
const PINNINGS_SERVICE_KEY = process.env.PINNINGS_SERVICE_KEY
const IPFS_INFURA_IPFS_PROJECT_ID = process.env.IPFS_INFURA_IPFS_PROJECT_ID
const IPFS_INFURA_IPFS_API_KEY_SECRET = process.env.IPFS_INFURA_IPFS_API_KEY_SECRET

const IPFS_INFURA_AUTH =
  "Basic " +
  Buffer.from(
    IPFS_INFURA_IPFS_PROJECT_ID + ":" + IPFS_INFURA_IPFS_API_KEY_SECRET,
  ).toString("base64")

interface Body {
  snapshotSpaceEnsName: string
  snapshotSpaceSettings: any
}

export default async (request: VercelRequest, response: VercelResponse) => {
  response.setHeader("Access-Control-Allow-Origin", "*")
  response.setHeader("Access-Control-Allow-Methods", "OPTIONS,POST")
  response.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  )
  if (request.method === "OPTIONS") {
    return response.status(200).end()
  }
  try {
    console.log("Incoming request at ", request.url)
    console.log("Request body", request.body)
    const { snapshotSpaceEnsName, snapshotSpaceSettings } = request.body as Body

    // verification
    // this is done to prevent abuse of the pinning service
    const originalSpaceSettings = await snapshot.getSnapshotSpaceSettings(
      snapshotSpaceEnsName,
    )
    snapshot.verifyNewSnapshotSettings(originalSpaceSettings, snapshotSpaceSettings)

    // upload to IPFS and pinning
    const ipfs = create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      apiPath: "/api/v0",
      headers: {
        authorization: IPFS_INFURA_AUTH,
      },
    })
    const { cid: rawCid } = await ipfs.add(JSON.stringify(snapshotSpaceSettings))
    console.log("Respond CID from IPFS (Infura) raw:", rawCid)

    const cid = rawCid.toV1().toString()
    console.log("Converted CIDv1:", cid)

    try {
      const pinningRes = await fetch(`${PINNING_SERVICES_API_URL}/pins`, {
        method: "POST",
        body: JSON.stringify({
          cid: cid,
          name: `SnapshotSpaceSettings-${snapshotSpaceEnsName}`,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PINNINGS_SERVICE_KEY}`,
        },
      })
      console.log("Responds from Pinning Service API", pinningRes)
    } catch (error) {
      if (error.reason !== "DUPLICATE_OBJECT") {
        return response
          .status(500)
          .setHeader("content-type", "application/json;charset=UTF-8")
          .setHeader("Access-Control-Allow-Origin", "*")
          .send("error from pinning service")
      }
      console.log("Pinning Service API error:", error)
    }

    console.log("SUCCESS: Pinnings successfully. CIDv1:", cid)
    return response
      .status(200)
      .setHeader("content-type", "application/json;charset=UTF-8")
      .setHeader("Access-Control-Allow-Origin", "*")
      .send(
        JSON.stringify({
          cidV1: cid,
        }),
      )
  } catch (e) {
    console.error(e)
    return response.status(500).send("error")
  }
}
