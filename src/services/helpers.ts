import { BigNumber, Contract, Signer } from "ethers";
import {
  abi as MultiSendAbi,
  defaultAddress as MultiSendAddress,
} from "@gnosis.pm/safe-deployments/dist/assets/v1.3.0/multi_send.json";
import { abi as SafeAbi } from "@gnosis.pm/safe-deployments/dist/assets/v1.3.0/gnosis_safe_l2.json";
import { arrayify, solidityPack } from "ethers/lib/utils";
import { AddressZero } from "@ethersproject/constants";

import { MetaTransaction, SafeSignature, SafeTransaction } from "./types";

export const buildSignatureBytes = (signatures: SafeSignature[]): string => {
  signatures.sort((left, right) =>
    left.signer.toLowerCase().localeCompare(right.signer.toLowerCase())
  );
  let signatureBytes = "0x";
  for (const sig of signatures) {
    signatureBytes += sig.data.slice(2);
  }
  return signatureBytes;
};

export const getMultiSendInstance = (signer: Signer) => {
  return new Contract(MultiSendAddress, MultiSendAbi, signer);
};

export const encodeMetaTransaction = (tx: MetaTransaction): string => {
  const data = arrayify(tx.data);
  const encoded = solidityPack(
    ["uint8", "address", "uint256", "uint256", "bytes"],
    [tx.operation, tx.to, tx.value, data.length, data]
  );
  return encoded.slice(2);
};

export const encodeMultiSend = (txs: MetaTransaction[]): string => {
  return "0x" + txs.map((tx) => encodeMetaTransaction(tx)).join("");
};

export const getSafeInstance = (address: string, signer: Signer) => {
  return new Contract(address, SafeAbi, signer);
};

export const buildAction = (
  contract: Contract,
  method: string,
  params: any[],
  nonce: number,
  value?: number
) => {
  const data = contract.interface.encodeFunctionData(method, params);
  return buildSafeTransaction(
    Object.assign({
      to: contract.address,
      data,
      nonce,
      value,
    })
  );
};

export const buildMultiSendSafeTx = (
  txs: SafeTransaction[],
  signer: Signer,
  nonce: number
) => {
  const multiSendInstance = getMultiSendInstance(signer);
  return buildAction(
    multiSendInstance,
    "multiSend",
    [encodeMultiSend(txs)],
    nonce
  );
};

export const buildSafeTransaction = (template: {
  to: string;
  value?: BigNumber | number | string;
  data?: string;
  nonce: number;
}): SafeTransaction => {
  return {
    to: template.to,
    value: template.value || 0,
    data: template.data || "0x",
    nonce: template.nonce,
    operation: 0,
    safeTxGas: 0,
    baseGas: 0,
    gasPrice: 0,
    gasToken: AddressZero,
    refundReceiver: AddressZero,
  };
};
