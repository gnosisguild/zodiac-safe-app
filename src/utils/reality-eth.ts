import { getProvider } from "../services";
import { Contract } from "ethers";

const REALITY_ETH_ERC20_CONTRACT_ABI = [
  "function token() view returns (address)",
];

const ERC20_CONTRACT_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
];

export async function getArbitratorBondToken(
  address: string,
  chainId: number
): Promise<{ isERC20: boolean; symbol: string }> {
  const provider = getProvider(chainId);
  try {
    const realityEthErc20Contract = new Contract(
      address,
      REALITY_ETH_ERC20_CONTRACT_ABI,
      provider
    );
    const tokenAddress: string = await realityEthErc20Contract.token();
    console.log({ tokenAddress });
    const tokenContract = new Contract(
      tokenAddress,
      ERC20_CONTRACT_ABI,
      provider
    );
    return {
      isERC20: true,
      symbol: await tokenContract.symbol(),
    };
  } catch (err) {
    return {
      isERC20: false,
      symbol: "ETH",
    };
  }
}
