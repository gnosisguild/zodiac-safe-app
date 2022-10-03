import type { VercelRequest, VercelResponse } from "@vercel/node"
import {
  CreateSentinelRequest,
  NotificationType,
  SentinelClient,
} from "defender-sentinel-client"
import { Network, Body } from "./types"

export default async (request: VercelRequest, response: VercelResponse) => {
  try {
    console.log("Incoming request", request.body)
    const body = request.body as Body
    const {
      apiKey,
      apiSecret,
      notificationChannels,
      realityModuleAddress,
      network,
    } = body
    const client = new SentinelClient({ apiKey, apiSecret })
    console.log("Client is ready")

    const notificationChannelIds = await Promise.all(
      notificationChannels.map(async ({ channel, config }) => {
        const notificationChannelSetupResponds =
          await setupNewNotificationChannel(client, channel, config)
        console.log(
          "Notification channel set up responds",
          notificationChannelSetupResponds,
        )
        const { notificationId } = notificationChannelSetupResponds
        return notificationId
      }),
    )
    const sentinelCreationResponds = await createSentinel(
      client,
      notificationChannelIds,
      network,
      realityModuleAddress,
    )
    console.log("Sentinel creation responds", sentinelCreationResponds)
    // Recreate the response so you can modify the headers
    return response
      .status(200)
      .setHeader("content-type", "application/json;charset=UTF-8")
      .setHeader("Access-Control-Allow-Origin", "*")
      .send("ok")
  } catch (e) {
    console.error(e)
    return response.status(500).send("error")
  }
}

const setupNewNotificationChannel = (
  client: SentinelClient,
  channel: NotificationType,
  config: any,
) =>
  client.createNotificationChannel({
    type: channel,
    name: `ZodiacRealityModuleNotification-${channel}`,
    config,
    paused: false,
  })

const createSentinel = (
  client: SentinelClient,
  notificationChannels: string[],
  network: Network,
  realityModuleAddress: string,
) => {
  const requestParameters: CreateSentinelRequest = {
    type: "BLOCK",
    network: network,
    // optional
    name: "New proposal added to the Reality Module",
    addresses: [realityModuleAddress],
    // optional
    paused: false,
    // optional
    eventConditions: [
      {
        eventSignature: "ProposalQuestionCreated(bytes32, string)",
      },
    ],
    // optional
    notificationChannels: notificationChannels,
  }

  return client.create(requestParameters)
}
