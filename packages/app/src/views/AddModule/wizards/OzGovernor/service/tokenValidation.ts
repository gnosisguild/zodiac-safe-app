import { ethers } from "ethers"

const VOTES_ABI = [
  "function getVotes(address account) external view returns (uint256)",
  "function getPastVotes(address account, uint256 blockNumber) external view returns (uint256)",
  "function getPastTotalSupply(uint256 blockNumber) external view returns (uint256)",
  "function delegates(address account) external view returns (address)",
  "function delegate(address delegatee) external",
  "function delegateBySig(address delegatee, uint256 nonce, uint256 expiry, uint8 v, bytes32 r, bytes32 s) external",
]

const RANDOM_VALID_ADDRESS = "0xD028d504316FEc029CFa36bdc3A8f053F6E5a6e4"
const RANDOM_BLOCK_NUMBER = 1234

export const isVotesCompilable =
  (provider: ethers.providers.JsonRpcProvider) => async (tokenAddress: string) => {
    const tokenContract = new ethers.Contract(tokenAddress, VOTES_ABI, provider)

    try {
      await Promise.all([
        tokenContract.getVotes(RANDOM_VALID_ADDRESS),
        tokenContract.getPastVotes(RANDOM_VALID_ADDRESS, RANDOM_BLOCK_NUMBER),
        tokenContract.getPastTotalSupply(RANDOM_BLOCK_NUMBER),
        tokenContract.callStatic.delegates(RANDOM_VALID_ADDRESS),
        tokenContract.callStatic.delegate(RANDOM_VALID_ADDRESS),
      ])
      // eslint-disable-next-line
      tokenContract.functions["delegateBySig"].name
    } catch (e) {
      console.log(e)
      return false
    }

    return true
  }
