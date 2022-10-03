import type { VercelRequest, VercelResponse } from "@vercel/node"
import { NotificationType, SentinelClient } from "defender-sentinel-client"
import { Body } from "./types"

export default async (request: VercelRequest, response: VercelResponse) => {
  try {
    console.log(request.body)
    const body = request.body as Body
    console.log(body.apiKey)
    const { apiKey, apiSecret, channel, config } = body
    const client = new SentinelClient({ apiKey, apiSecret })
    console.log("client is set up")

    const notificationSetupResponds = await setupNewNotification(client, channel, config)
    console.log(notificationSetupResponds)
    // Recreate the response so you can modify the headers
    const notificationSetupRespondsJson = JSON.stringify(notificationSetupResponds, null, 2)
    return response
      .status(200)
      .setHeader("content-type", "application/json;charset=UTF-8")
      .setHeader("Access-Control-Allow-Origin", "*")
      .send(notificationSetupResponds)
  } catch (e) {
    console.error(e)
    return response.status(500).send("error")
  }
}

const setupNewNotification = (client: SentinelClient, channel: NotificationType, config: any) =>
  client.createNotificationChannel({
    type: channel,
    name: `ZodiacRealityModuleNotification-${channel}`,
    config,
    paused: false,
  })
