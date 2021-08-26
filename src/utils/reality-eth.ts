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
): Promise<string> {
  const provider = getProvider(chainId);
  try {
    const realityEthErc20Contract = new Contract(
      address,
      REALITY_ETH_ERC20_CONTRACT_ABI,
      provider
    );
    const tokenAddress: string = await realityEthErc20Contract.token();
    const tokenContract = new Contract(
      tokenAddress,
      ERC20_CONTRACT_ABI,
      provider
    );
    return await tokenContract.symbol();
  } catch (err) {
    return "ETH";
  }
}
