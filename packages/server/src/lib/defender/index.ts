
import { packageCode, replaceInString } from "../util"
import autotaskJsCode from "./autotasks/on_new_question_from_module"
import { Query } from "../types"
import { Defender } from "@openzeppelin/defender-sdk"

export type NotificationType =
  | "slack"
  | "email"
  | "discord"
  | "telegram"
  | "datadog"
  | "webhook"
  | "opsgenie"
  | "pager-duty"

export const setupDefenderClient = ({ apiKey, apiSecret }: Query) =>
  new Defender({ apiKey, apiSecret })

export const setupNewNotificationChannel = async (
  client: Defender,
  channel: NotificationType,
  config: any,
  realityModuleAddress: string,
  network: string,
) => {
  const notificationChannel = await client.monitor.createNotificationChannel({
    type: channel,
    name: `ZodiacRealityModuleNotification-${network}:${realityModuleAddress}-${channel}`,
    config,
    paused: false,
  })

  console.log(
    "Created Notification Channel with ID: ",
    notificationChannel.notificationId,
  )

  return notificationChannel.notificationId
}

export const createSentinel = async (
  client: Defender,
  network: string,
  realityModuleAddress: string,
  autotaskId: string,
) => {
  const requestParameters: any = {
    type: "BLOCK",
    network,
    name: `Proposal added to the Reality Module (${realityModuleAddress} on ${network})`,
    addresses: [realityModuleAddress],
    paused: false,
    abi: `[{
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "questionId",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "string",
          "name": "proposalId",
          "type": "string"
        }
      ],
      "name": "ProposalQuestionCreated",
      "type": "event"
    }]`,
    eventConditions: [
      {
        eventSignature: "ProposalQuestionCreated(bytes32,string)",
      },
    ],
    autotaskTrigger: autotaskId,
    notificationChannels: [],
  }

  const sentinel = await client.monitor.create(requestParameters)
  console.log("Created Sentinel with monitor ID: ", sentinel.monitorId)

  return sentinel.monitorId
}

export const createAction = async (
  client: Defender,
  oracleAddress: string,
  notificationChannels: string[],
  network: string,
  apiKey: string,
  apiSecret: string,
) => {
  const code = replaceInString(autotaskJsCode, {
    "{{network}}": network,
    "{{oracleAddress}}": oracleAddress,
    '"{{notificationChannels}}"': JSON.stringify(notificationChannels),
    "{{apiKey}}": apiKey,
    "{{apiSecret}}": apiSecret,
  })

  const params: any = {
    name: "Setup Sentinel for new Reality.eth question",
    encodedZippedCode: await packageCode(code),
    trigger: {
      type: "webhook",
    },
    paused: false,
  }

  const createdAutotask = await client.action.create(params)
  console.log("Created Autotask with ID: ", createdAutotask.actionId)

  return createdAutotask.actionId
}
