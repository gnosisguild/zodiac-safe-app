import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import Ganache from "ganache-core";

const PRIV_KEY_ONE =
  "0x990b68b61853f6418233b1f502a220a8770bb38849d9bd8fc552ed55f5899365";
const PRIV_KEY_TWO =
  "0x0f072260a8d8afe0adb52b6d86d9610f87c2bb17cf3b9e79fe46301e5d83961c";

const INFURA_URL =
  "https://rinkeby.infura.io/v3/" + process.env.REACT_APP_INFURA_ID;
export const BALANCE_IN_ETH = "1000";

export const startChain = async () => {
  console.log("Before starting chain...");
  const ganache: any = Ganache.provider({
    fork: INFURA_URL,
    network_id: 4,
    accounts: [
      {
        secretKey: PRIV_KEY_ONE,
      },
    ],
  });

  console.log("After starting chain: ", ganache);
  const provider = new Web3Provider(ganache);
  const walletOne = new ethers.Wallet(PRIV_KEY_ONE, provider);
  const walletTwo = new ethers.Wallet(PRIV_KEY_TWO, provider);

  return { wallets: [walletOne, walletTwo], ganache };
};
