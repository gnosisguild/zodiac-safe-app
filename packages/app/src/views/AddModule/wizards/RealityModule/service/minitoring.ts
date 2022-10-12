import { MonitoringSectionData } from "../sections/Monitoring"

const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL

if (BACKEND_API_URL == null) {
  throw new Error("BACKEND_API_URL not set")
}

interface NotificationChannels {
  channel: string
  config: any
}
interface RequestType {
  apiKey: string
  apiSecret: string
  network: string
  realityModuleAddress: string
  notificationChannels: NotificationChannels[]
}

export const setUpMonitoring = async (
  network: string,
  realityModuleAddress: string,
  data: MonitoringSectionData,
) => {
  console.log()
  if ((data.apiKey ?? "") === "" || (data.secretKey ?? "") === "") {
    throw new Error(
      "API keys for monitoring service missing. Monitoring will NOT be set up.",
    )
  }
  if (
    (data.discordKey ?? "") === "" &&
    (data.slackKey ?? "") === "" &&
    data.email.length === 0 &&
    (data.telegram.botToken ?? "") === "" &&
    (data.telegram.chatID ?? "")
  ) {
    throw new Error(
      "No notification channel(s) specified. Monitoring will NOT be set up.",
    )
  }

  const notificationChannels: NotificationChannels[] = []

  if (data.email.length > 0) {
    notificationChannels.push({
      channel: "email",
      config: {
        emails: data.email,
      },
    })
  }

  if (data.discordKey.length > 0) {
    notificationChannels.push({
      channel: "discord",
      config: {
        url: data.discordKey,
      },
    })
  }

  if (data.slackKey.length > 0) {
    notificationChannels.push({
      channel: "slack",
      config: {
        url: data.slackKey,
      },
    })
  }

  if (data.telegram.botToken.length > 0) {
    notificationChannels.push({
      channel: "telegram",
      config: data.telegram,
    })
  }

  const requestBody: RequestType = {
    apiKey: data.apiKey,
    apiSecret: data.secretKey,
    network,
    realityModuleAddress,
    notificationChannels,
  }

  return fetch(BACKEND_API_URL + "/monitoring/notification", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(requestBody),
  })
}
