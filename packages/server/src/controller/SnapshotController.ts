import asyncHandler from "express-async-handler"
import { Request, Response, NextFunction } from "express"
import * as snapshot from "../lib/snapshot"

import pinataSDK from "@pinata/sdk"

const PINATA_API_KEY = process.env.PINATA_API_KEY
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY
const pinata = new pinataSDK(PINATA_API_KEY, PINATA_SECRET_API_KEY)
interface Body {
  snapshotSpaceEnsName: string
  snapshotSpaceSettings: any
  chainId: number
}

// @Desc setSnapshotSettings
// @Route /api/ipfs-pinning/snapshot-settings
// @Method POST
export const setSnapshotSettings = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    response.setHeader("Access-Control-Allow-Origin", "*")
    response.setHeader("Access-Control-Allow-Methods", "OPTIONS,POST")
    response.setHeader(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
    )
    try {
      console.log("Incoming request at ", request.url)
      console.log("Request body", request.body)
      const { snapshotSpaceEnsName, snapshotSpaceSettings, chainId } =
        request.body as Body
      // verification
      // this is done to prevent abuse of the pinning service
      const originalSpaceSettings = await snapshot.getSnapshotSpaceSettings(
        snapshotSpaceEnsName,
        chainId,
      )
      console.log("originalSpaceSettings", originalSpaceSettings)
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
      const pinataResponds = await pinata.pinJSONToIPFS(snapshotSpaceSettings)

      console.log("Pinata responds", pinataResponds.IpfsHash)

      if (pinataResponds == null || pinataResponds.IpfsHash == null) {
        throw new Error("Failed to pin the new Snapshot Space settings to IPFS.")
      }

      const { IpfsHash: cidV0 } = pinataResponds
      response
        .status(200)
        .setHeader("content-type", "application/json;charset=UTF-8")
        .setHeader("Access-Control-Allow-Origin", "*")
        .send({
          cidV0,
          success: true,
        })
    } catch (error) {
      console.error(error)

      const { name, message } = error
      response
        .status(500)
        .setHeader("content-type", "application/json;charset=UTF-8")
        .setHeader("Access-Control-Allow-Origin", "*")
        .send({
          name,
          message,
          success: false,
        })
    }
  },
)
