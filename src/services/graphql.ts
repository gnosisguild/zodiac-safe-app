import { createClient, defaultExchanges } from "urql"
import { NETWORK } from "utils/networks"

const BASE_SUBGRAPH_URL = "https://hub.snapshot.org/graphql"
const TEST_BASE_SUBGRAPH_URL = "https://testnet.snapshot.org/graphql"

const getUrl = (chainId?: NETWORK) => {
  switch (chainId) {
    case NETWORK.MAINNET:
    case NETWORK.BSC:
    case NETWORK.POLYGON:
    case NETWORK.XDAI:
      return BASE_SUBGRAPH_URL

    case NETWORK.RINKEBY:
    case NETWORK.GOERLI:
      return TEST_BASE_SUBGRAPH_URL

    default:
      return BASE_SUBGRAPH_URL
  }
}

export const subgraphClient = (chainId?: number) =>
  createClient({
    url: getUrl(chainId),
    exchanges: [...defaultExchanges],
    fetchOptions: {
      cache: "no-cache",
    },
  })
