import { Body, NotificationType } from "./types"
import { SentinelClient } from "defender-sentinel-client"

addEventListener("fetch", async (event) => {
  const { request, respondWith } = event
  const { pathname } = new URL(request.url)

  if (request.method === "POST" && pathname.startsWith("/monitoring/notification")) {
    try {
      const text = await request.text()
      const body = JSON.parse(text) as Body
      const { apiKey, apiSecret, channel, config } = body
      const client = new SentinelClient({ apiKey, apiSecret })
      console.log("client is set up")

      const notificationSetupResponds = await setupNewNotification(client, channel, config)
      console.log(notificationSetupResponds)
      // Recreate the response so you can modify the headers
      const notificationSetupRespondsJson = JSON.stringify(notificationSetupResponds, null, 2)
      const response = new Response(notificationSetupRespondsJson, {
        headers: {
          "content-type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
        },
      })
      return respondWith(response)
    } catch (e) {
      console.error(e)
      return respondWith(new Response("error", { status: 500 }))
    }
  }
  return respondWith(new Response("error", { status: 500 }))
})

const setupNewNotification = (client: SentinelClient, channel: NotificationType, config: any) =>
  client.createNotificationChannel({
    type: channel,
    name: `ZodiacRealityModuleNotification-${channel}`,
    config,
    paused: false,
  })
