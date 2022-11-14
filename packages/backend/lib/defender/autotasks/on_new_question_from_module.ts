export default `
const { SentinelClient } = require("defender-sentinel-client")

const PROPOSAL_QUESTION_CREATED_EVENT_TOPIC =
  "0xa1f5047031a658827550a2c4be07648493f3ac88a09c857b3961d1336429a31f" // Keccak-256("ProposalQuestionCreated(bytes32,string)")

// @param event: AutotaskEvent
exports.handler = async function (event) {
  // variable from the event
  const evmEvent = event.request.body.transaction.logs.find(
    (log) => log.topics[0] === PROPOSAL_QUESTION_CREATED_EVENT_TOPIC,
  )
  const questionId = evmEvent.topics[1]
  console.log("QuestionId to monitor for:", questionId)

  // variables from autotask creation
  const network = "{{network}}"
  const oracleAddress = "{{oracleAddress}}"
  const notificationChannels = "{{notificationChannels}}"
  const apiKey = "{{apiKey}}"
  const apiSecret = "{{apiSecret}}"

  const client = new SentinelClient({
    apiKey,
    apiSecret,
  })

  const requestParameters = {
    type: "BLOCK",
    network,
    name:
      "Answer submitted for a proposal question at Reality.eth for the Reality Module (on " +
      network +
      ")",
    addresses: [oracleAddress],
    paused: false,
    abi: \`[
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "answer",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "question_id",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "history_hash",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "bond",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "ts",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "is_commitment",
        type: "bool",
      },
    ],
    name: "LogNewAnswer",
    type: "event",
  }
]\`,
    eventConditions: [
      {
        eventSignature:
          "LogNewAnswer(bytes32,bytes32,bytes32,address,uint256,uint256,bool)",
        expression: '$1 == "' + questionId + '"',
      },
    ],
    notificationChannels: notificationChannels,
  }

  return client.create(requestParameters)
}
`
