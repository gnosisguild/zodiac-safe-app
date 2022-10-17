import type { VercelRequest, VercelResponse } from "@vercel/node"
import { SentinelClient } from "defender-sentinel-client"
import { Query } from "./types"

export default async (request: VercelRequest, response: VercelResponse) => {
  response.setHeader("Access-Control-Allow-Credentials", "true")
  response.setHeader("Access-Control-Allow-Origin", "*")
  response.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT")
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
    const client = new SentinelClient({ apiKey, apiSecret })
    console.log("Client is ready")
    const notifications = await validateCredentials(client)
    console.log("Notifications response", notifications)

    // Recreate the response so you can modify the headers
    return response
      .status(200)
      .setHeader("content-type", "application/json;charset=UTF-8")
      .setHeader("Access-Control-Allow-Origin", "*")
      .send({
        success: true,
      })
  } catch (e) {
    console.error(e)
    return response.status(400).send({
      success: false,
    })
  }
}

const validateCredentials = (client: SentinelClient) => client.listNotificationChannels()
