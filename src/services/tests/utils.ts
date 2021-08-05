import { Contract, ethers, Signer } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import Ganache from "ganache-core";
import { arrayify, hexlify, parseEther, solidityPack } from "ethers/lib/utils";
import { AddressZero } from "@ethersproject/constants";
import {
  buildTransaction,
  INFURA_URL,
  MultiSendAbi,
  MultiSendAddress,
} from "services/helpers";

const PRIV_KEY_ONE =
  "0x990b68b61853f6418233b1f502a220a8770bb38849d9bd8fc552ed55f5899365";
const PRIV_KEY_TWO =
  "0x0f072260a8d8afe0adb52b6d86d9610f87c2bb17cf3b9e79fe46301e5d83961c";

interface RawTransaction {
  data: string;
  value: string;
  to: string;
  nonce: number;
}

export const BALANCE_IN_ETH = "1";

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

export const prepareSafeTransaction = async (
  transaction: RawTransaction,
  safe: Contract,
  signer: Signer,
  operation: 0 | 1 | 2 = 0
) => {
  const approveHash = await safeApproveHash(signer);
  const signatures = buildSignatureBytes([approveHash]);

  const safeTx = buildSafeTransaction(transaction);

  return safe.execTransaction(
    safeTx.to,
    safeTx.value,
    safeTx.data,
    operation,
    safeTx.safeTxGas,
    safeTx.baseGas,
    safeTx.gasPrice,
    safeTx.gasToken,
    safeTx.refundReceiver,
    signatures
  );
};

const safeApproveHash = async (signer: Signer) => {
  const signerAddress = await signer.getAddress();
  return {
    signer: signerAddress,
    data:
      "0x000000000000000000000000" +
      signerAddress.slice(2) +
      "0000000000000000000000000000000000000000000000000000000000000000" +
      "01",
  };
};

const buildSignatureBytes = (signatures: any): string => {
  signatures.sort((left: any, right: any) =>
    left.signer.toLowerCase().localeCompare(right.signer.toLowerCase())
  );
  let signatureBytes = "0x";
  for (const sig of signatures) {
    signatureBytes += sig.data.slice(2);
  }
  return signatureBytes;
};

export const buildSafeTransaction = (transaction: Partial<RawTransaction>) => {
  return {
    to: transaction.to,
    value: transaction.value || 0,
    data: transaction.data || "0x",
    operation: 0,
    safeTxGas: 0,
    baseGas: 0,
    gasPrice: 0,
    gasToken: AddressZero,
    refundReceiver: AddressZero,
    nonce: transaction.nonce,
  };
};

export const buildMultiSendSafeTx = async (
  transactions: Pick<RawTransaction, "data" | "value" | "to">[],
  signer: Signer
) => {
  const multiSend = new Contract(MultiSendAddress, MultiSendAbi, signer);
  const encodedTxs = transactions.map((t) => encodeMetaTransaction(t)).join("");
  const encodedMultiSend = "0x" + encodedTxs;

  return buildTransaction(multiSend, "multiSend", [encodedMultiSend]);
};

const encodeMetaTransaction = (
  tx: Pick<RawTransaction, "data" | "value" | "to">
): string => {
  const data = arrayify(tx.data);
  const encoded = solidityPack(
    ["uint8", "address", "uint256", "uint256", "bytes"],
    [0, tx.to, tx.value, data.length, data]
  );
  return encoded.slice(2);
};
