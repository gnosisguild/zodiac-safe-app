import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import Ganache from "ganache-core";
import { hexlify, parseEther } from "ethers/lib/utils";
import { INFURA_URL } from "services/helpers";

const PRIV_KEY_ONE =
  "0x990b68b61853f6418233b1f502a220a8770bb38849d9bd8fc552ed55f5899365";
const PRIV_KEY_TWO =
  "0x0f072260a8d8afe0adb52b6d86d9610f87c2bb17cf3b9e79fe46301e5d83961c";

export const BALANCE_IN_ETH = "1000";
export const startChain = async () => {
  const ganache: any = Ganache.provider({
    fork: INFURA_URL,
    networkId: 4,
    accounts: [
      {
        secretKey: PRIV_KEY_ONE,
        balance: hexlify(parseEther(BALANCE_IN_ETH)),
      },
      {
        secretKey: PRIV_KEY_TWO,
        balance: hexlify(parseEther(BALANCE_IN_ETH)),
      },
    ],
  });

  const provider = new Web3Provider(ganache);
  const walletOne = new ethers.Wallet(PRIV_KEY_ONE, provider);
  const walletTwo = new ethers.Wallet(PRIV_KEY_TWO, provider);

  return { wallets: [walletOne, walletTwo], provider };
};
