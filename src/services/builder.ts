import { Contract, Signer } from "ethers";
import { AddressZero } from "@ethersproject/constants";
import { buildSafeTransaction, buildSignatureBytes } from "./helpers";
import { SafeSignature, SafeTransaction } from "./types";

export const deployContract = (data: string, nonce: number) => {
  return buildSafeTransaction({
    to: AddressZero,
    data,
    nonce,
  });
};

export const executeMultiSend = async (
  safe: Contract,
  safeTx: SafeTransaction,
  signatures: SafeSignature[]
) => {
  const signatureBytes = buildSignatureBytes(signatures);

  return await safe.execTransaction(
    safeTx.to,
    safeTx.value,
    safeTx.data,
    safeTx.operation,
    safeTx.safeTxGas,
    safeTx.baseGas,
    safeTx.gasPrice,
    safeTx.gasToken,
    safeTx.refundReceiver,
    signatureBytes,
    {}
  );
};

export const safeApproveHash = async (signer: Signer) => {
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
