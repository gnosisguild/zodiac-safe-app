import { ethers } from "ethers";
import { Transaction } from "@gnosis.pm/safe-apps-sdk";

/**
 * This only works for domains using the PublicResolver (the default).
 */

const ensPublicResolver = "0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41"; // ENS: Public Resolver 2

const abi = [
  "function setText(bytes32 node, string calldata key, string calldata value) external",
];

export const setTextRecordTx = async (
  provider: ethers.providers.Provider,
  ensName: string,
  key: string,
  content: string
): Promise<Transaction> => {
  const contract = new ethers.Contract(ensPublicResolver, abi, provider);
  const nameHash = ethers.utils.namehash(ensName);
  const populatedTx = await contract.populateTransaction.setText(
    nameHash,
    "snapshot",
    key,
    content
  );
  if (populatedTx.to == null) {
    throw new Error("Missing to address");
  }
  if (populatedTx.data == null) {
    throw new Error("Missing data");
  }

  return {
    to: populatedTx.to,
    data: populatedTx.data,
    value: "0",
  };
};
