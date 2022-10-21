import type { VercelRequest, VercelResponse } from "@vercel/node"
import {
  CreateSentinelRequest,
  NotificationType,
  SentinelClient,
} from "defender-sentinel-client"
import { Network, Body } from "../../lib/types"

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
    const { apiKey, apiSecret, notificationChannels, realityModuleAddress, network } =
      body
    const client = new SentinelClient({ apiKey, apiSecret })
    console.log("Client is ready")

    const notificationChannelIds = await Promise.all(
      notificationChannels.map(async ({ channel, config }) => {
        const notificationChannelSetupResponds = await setupNewNotificationChannel(
          client,
          channel,
          config,
        )
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
