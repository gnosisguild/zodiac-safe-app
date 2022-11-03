import { ethers } from "ethers"
import { TxWitMeta } from "services"

export async function deployOzGovernorModule(
  provider: ethers.providers.JsonRpcProvider,
  safeAddress: string,
  tokenAddress: string,
  name: string,
  initialVotingDelay: number,
  initialVotingPeriod: number,
  initialProposalThreshold: number,
  quorumNumeratorValue: number,
): Promise<TxWitMeta> {
  return {
    txs: [], // transactions to be executed by the safe
    meta: {}, // any additional data needed from the setup process
  }
}
