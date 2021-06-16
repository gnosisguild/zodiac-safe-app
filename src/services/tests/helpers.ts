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

export const BYTECODE_TEST = `0x608060405234801561001057600080fd5b5061012f806100206000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c80632e64cec11460375780636057361d146051575b600080fd5b603d6069565b6040516048919060c2565b60405180910390f35b6067600480360381019060639190608f565b6072565b005b60008054905090565b8060008190555050565b60008135905060898160e5565b92915050565b60006020828403121560a057600080fd5b600060ac84828501607c565b91505092915050565b60bc8160db565b82525050565b600060208201905060d5600083018460b5565b92915050565b6000819050919050565b60ec8160db565b811460f657600080fd5b5056fea2646970667358221220c019e4614043d8adc295c3046ba5142c603ab309adeef171f330c51c38f1498964736f6c63430008040033`;
