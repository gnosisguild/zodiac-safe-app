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

    if (originalSpaceSettings == null) {
      throw new Error(
        "Failed to get the original space settings. Most likely there is no configured space for this ENS name.",
      )
    }

    if (
      !snapshot.verifyNewSnapshotSettings(originalSpaceSettings, snapshotSpaceSettings)
    ) {
      throw new Error(
        "The new Snapshot Space settings file is changed in unexpected ways, or the new Space settings file is not valid.",
      )
    }

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

    if (pinataResponds == null || pinataResponds.IpfsHash == null) {
      throw new Error("Failed to pin the new Snapshot Space settings to IPFS.")
    }

    const { IpfsHash: cidV0 } = pinataResponds
    return response
      .status(200)
      .setHeader("content-type", "application/json;charset=UTF-8")
      .setHeader("Access-Control-Allow-Origin", "*")
      .send({
        cidV0,
        success: true,
      })
  } catch (e) {
    console.error(e)

    const { name, message } = e
    return response
      .status(500)
      .setHeader("content-type", "application/json;charset=UTF-8")
      .setHeader("Access-Control-Allow-Origin", "*")
      .send({
        name,
        message,
        success: false,
      })
  }
}
