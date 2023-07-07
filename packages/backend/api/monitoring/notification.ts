import type { VercelRequest, VercelResponse } from "@vercel/node"
import {
  setupSentinelClient,
  NotificationType,
  setupNewNotificationChannel,
  createSentinel,
  createAutotask,
  setupAutotaskClient,
} from "../../lib/defender"
import { Network } from "defender-base-client"

export interface Body {
  apiKey: string
  apiSecret: string
  network: Network
  realityModuleAddress: string
  oracleAddress: string
  notificationChannels: [
    {
      channel: NotificationType
      config: any
    },
  ]
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
    const body = request.body as Body
    const {
      apiKey,
      apiSecret,
      notificationChannels,
      oracleAddress,
      realityModuleAddress,
      network,
    } = body
    const sentinelClient = setupSentinelClient({ apiKey, apiSecret })
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

    const autotaskClient = setupAutotaskClient({ apiKey, apiSecret })

    const autotaskId = await createAutotask(
      autotaskClient,
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
    return response
      .status(200)
      .setHeader("content-type", "application/json;charset=UTF-8")
      .setHeader("Access-Control-Allow-Origin", "*")
      .send({
        success: true,
      })
  } catch (e) {
    console.error(e)

    const { name, message } = e
    // this is safe for we are requesting on behalf of the user (with their API key)
    return response.status(500).send({
      name,
      message,
      success: false,
    })
  }
}
