import type { VercelRequest, VercelResponse } from "@vercel/node"
import * as snapshot from "../../lib/snapshot"
import fetch from "node-fetch"
import { getEnv } from "../../lib/util"

const PINATA_BASE_URL = getEnv("PINATA_BASE_URL")
const PINATA_API_KEY = getEnv("PINATA_API_KEY")
const PINATA_SECRET_API_KEY = getEnv("PINATA_SECRET_API_KEY")

interface Body {
  snapshotSpaceEnsName: string
  snapshotSpaceSettings: any
  chainId: number
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
    const { snapshotSpaceEnsName, snapshotSpaceSettings, chainId } = request.body as Body

    // verification
    // this is done to prevent abuse of the pinning service
    const originalSpaceSettings = await snapshot.getSnapshotSpaceSettings(
      snapshotSpaceEnsName,
      chainId,
    )
    snapshot.verifyNewSnapshotSettings(originalSpaceSettings, snapshotSpaceSettings)

    // upload to IPFS and pinning
    const pinataResponds = await fetch(PINATA_BASE_URL + "/pinning/pinJSONToIPFS", {
      method: "POST",

      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(snapshotSpaceSettings),
    }).then((res) => res.json())

    console.log("Pinata responds", pinataResponds)
    const { IpfsHash: cidV0 } = pinataResponds
    return response
      .status(200)
      .setHeader("content-type", "application/json;charset=UTF-8")
      .setHeader("Access-Control-Allow-Origin", "*")
      .send(
        JSON.stringify({
          cidV0,
        }),
      )
  } catch (e) {
    console.error(e)

    const { name, message } = e
    return response
      .status(500)
      .setHeader("content-type", "application/json;charset=UTF-8")
      .setHeader("Access-Control-Allow-Origin", "*")
      .send(
        JSON.stringify({
          name,
          message,
        }),
      )
  }
}
