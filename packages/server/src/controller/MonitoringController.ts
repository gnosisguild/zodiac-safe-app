import {
  setupDefenderClient,
  NotificationType,
  setupNewNotificationChannel,
  createSentinel,
  createAction,
} from "../lib/defender"
import { Request, Response, NextFunction } from "express"
import asyncHandler from "express-async-handler"

import { Query } from "../lib/types"
import { Defender } from "@openzeppelin/defender-sdk"

export interface Body {
  apiKey: string
  apiSecret: string
  network: string
  realityModuleAddress: string
  oracleAddress: string
  notificationChannels: [
    {
      channel: NotificationType
      config: any
    },
  ]
}
const validateCredentials = (client: Defender) =>
  client.monitor.listNotificationChannels()

export const setUpMonitoring = asyncHandler(
  async (request: Request, response: Response, _next: NextFunction): Promise<void> => {
    response.setHeader("Access-Control-Allow-Origin", "*")
    response.setHeader("Access-Control-Allow-Methods", "OPTIONS,POST")
    response.setHeader(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
    )
    try {
      console.log("Incoming request at ", request.url)
      console.log("Request body", request.body)
      const body = request.body as Body
      const {
        apiKey,
        apiSecret,
        notificationChannels,
        oracleAddress,
        realityModuleAddress,
        network,
      } = body
      const sentinelClient = setupDefenderClient({ apiKey, apiSecret })
      console.log("Client is ready")

      const notificationChannelIds = await Promise.all(
        notificationChannels.map(
          async ({ channel, config }) =>
            await setupNewNotificationChannel(
              sentinelClient,
              channel,
              config,
              realityModuleAddress,
              network,
            ),
        ),
      )

      const autotaskId = await createAction(
        sentinelClient,
        oracleAddress,
        notificationChannelIds,
        network,
        apiKey,
        apiSecret,
      )

      const sentinelCreationResponds = await createSentinel(
        sentinelClient,
        network,
        realityModuleAddress,
        autotaskId,
      )
      console.log("Sentinel creation responds", sentinelCreationResponds)

      response
        .status(200)
        .setHeader("content-type", "application/json;charset=UTF-8")
        .setHeader("Access-Control-Allow-Origin", "*")
        .send({
          success: true,
        })
    } catch (e) {
      console.error(e)

      const { name, message } = e
      response.status(500).send({
        name,
        message,
        success: false,
      })
    }
  },
)

export const monitoringValidation = asyncHandler(
  async (request: Request, response: Response, _next: NextFunction): Promise<void> => {
    response.setHeader("Access-Control-Allow-Credentials", "true")
    response.setHeader("Access-Control-Allow-Origin", "*")
    response.setHeader(
      "Access-Control-Allow-Methods",
      "GET,OPTIONS,PATCH,DELETE,POST,PUT",
    )
    response.setHeader(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
    )
    if (request.method === "OPTIONS") {
      response.status(200).end()
      return
    }
    if (request.method !== "GET") {
      response.status(404).end()
      return
    }

    try {
      console.log("Incoming request at ", request.url)
      console.log("Request query", request.query)
      const query = request.query as unknown as Query
      const { apiKey, apiSecret } = query
      const client = setupDefenderClient({ apiKey, apiSecret })
      console.log("Client is ready")
      const notifications = await validateCredentials(client)
      console.log("Notifications response", notifications)

      // Send the response
      response
        .status(200)
        .setHeader("content-type", "application/json;charset=UTF-8")
        .setHeader("Access-Control-Allow-Origin", "*")
        .send({
          success: true,
        })
    } catch (e) {
      console.error(e)
      response.status(400).send({
        success: false,
      })
    }
  },
)
