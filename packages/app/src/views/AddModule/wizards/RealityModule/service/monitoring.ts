import { NETWORK } from "utils/networks"
import { MonitoringSectionData } from "../sections/Monitoring"

const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL

if (BACKEND_API_URL == null) {
  throw new Error("BACKEND_API_URL not set")
}

interface MonitoringCredentials {
  apiKey: string
  apiSecret: string
}

interface NotificationChannels {
  channel: string
  config: any
}
interface RequestType extends MonitoringCredentials {
  network: string
  realityModuleAddress: string
  oracleAddress: string
  notificationChannels: NotificationChannels[]
}

export const setUpMonitoring = async (
  chainId: NETWORK,
  realityModuleAddress: string,
  oracleAddress: string,
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
    (data.telegram.chatId ?? "")
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
    network: networkToOzDefenderNetworkName(chainId),
    oracleAddress,
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

export const validationCredentials = async (query: MonitoringCredentials) => {
  const { apiKey, apiSecret } = query
  return fetch(
    `${BACKEND_API_URL}/monitoring/validation?apiKey=${apiKey}&apiSecret=${apiSecret}`,
    {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  )
}

const networkToOzDefenderNetworkName = (network: NETWORK) => {
  switch (network) {
    case NETWORK.MAINNET:
      return "mainnet"
    case NETWORK.GOERLI:
      return "goerli"
    case NETWORK.OPTIMISM:
      return "optimism"
    case NETWORK.BSC:
      return "bsc"
    case NETWORK.GNOSIS_CHAIN:
      return "xdai"
    case NETWORK.POLYGON:
      return "matic"
    case NETWORK.ARBITRUM:
      return "arbitrum"
    case NETWORK.AVALANCHE:
      return "avalanche"
    case NETWORK.SEPOLIA:
      return "sepolia"
    default:
      throw new Error("Unsupported network")
  }
}
