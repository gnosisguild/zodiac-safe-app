import { Contract, ethers } from "ethers"
import { Coin, NETWORK, NETWORKS } from "../utils/networks"

const REALITY_ETH_ERC20_CONTRACT_ABI = ["function token() view returns (address)"]

const ERC20_CONTRACT_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() public view returns (uint8)",
]

export const ERC721_CONTRACT_ABI = [
  "function supportsInterface(bytes4 interfaceID) external view returns (bool)",
]

export async function getArbitratorBondToken(
  provider: ethers.providers.JsonRpcProvider,
  address: string,
  chainId: number,
): Promise<{ isERC20: boolean; coin: Coin }> {
  try {
    const realityEthErc20Contract = new Contract(
      address,
      REALITY_ETH_ERC20_CONTRACT_ABI,
      provider,
    )
    const tokenAddress: string = await realityEthErc20Contract.token()
    const tokenContract = new Contract(tokenAddress, ERC20_CONTRACT_ABI, provider)
    const coin: Coin = {
      symbol: await tokenContract.symbol(),
      decimals: await tokenContract.decimals(),
    }
    return { isERC20: true, coin }
  } catch (err) {
    return {
      isERC20: false,
      coin: NETWORKS[chainId as NETWORK].nativeAsset,
    }
  }
}
