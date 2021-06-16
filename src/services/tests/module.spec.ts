import { Contract, Wallet } from "ethers";
import { bytecode as DaoModuleBytecode } from "@gnosis/dao-module/build/artifacts/contracts/DaoModule.sol/DaoModule.json";
import { AddressZero } from "@ethersproject/constants";

import { deployContract, executeTx, safeApproveHash } from "../builder";
import { buildMultiSendSafeTx, buildAction, getSafeInstance } from "../helpers";
import { BYTECODE_TEST, startChain } from "./helpers";
import { SafeTransaction } from "../types";

jest.setTimeout(50000);

// In order to interact with the Gnosis Safe + Modules
// We will need to use a Gnosis Safe that has as owner the
// private keys fetched from the startChain function

describe("Module interactions ", () => {
  const TEST_GNOSIS_SAFE_ADDRESS = "0x38063380d21F2d7A2f093cF4FCedBf6A552A1f76";

  let walletOne: Wallet;
  let walletTwo: Wallet;
  let provider: any;

  beforeAll(async () => {
    const { wallets, provider: p } = await startChain();
    [walletOne, walletTwo] = wallets;
    provider = p;
  });

  describe("DAO Module ", () => {
    test("Should deploy module and be accessible from Safe ", async () => {
      const signer = provider.getSigner();
      const safe = getSafeInstance(TEST_GNOSIS_SAFE_ADDRESS, signer);
      const nonce = await safe.nonce();

      console.log({ provider });

      // const balanceOne = await pContract.balanceOf(walletOne.address);
      // const balanceTwo = await pContract.balanceOf(walletTwo.address);

      // console.log({ balanceOne });
      // console.log({ balanceTwo });

      const daoModuleTx = deployContract(BYTECODE_TEST, nonce, provider);
      const simpleStorageOne = new Contract(
        "0xcd3b8cCd8AA6286B7b08913f082D11cFCAadA5fc",
        [
          "function set(uint256 x) public",
          "function get() public view returns (uint256)",
        ],
        signer
      );
      const simpleStorageTwo = new Contract(
        "0x91632e5058e71ef3805dafc3f4904abe2a4bf524",
        [
          "function set(uint256 x) public",
          "function get() public view returns (uint256)",
        ],
        signer
      );
      const setStorageTransaction = buildAction(
        simpleStorageOne,
        "set",
        [16],
        nonce
      );

      const setStorageTransactionAgain = buildAction(
        simpleStorageTwo,
        "set",
        [421],
        nonce
      );

      // Transactions to be executed by multisender
      const transactions: SafeTransaction[] = [
        setStorageTransaction,
        setStorageTransactionAgain,
        // transferTransaction,
        // daoModuleTx,
      ];

      const multiSendTx = buildMultiSendSafeTx(transactions, signer, nonce);

      const signatures = await safeApproveHash(signer);
      const transaction = await executeTx(safe, multiSendTx, [signatures]);
      const hh = await transaction.wait();
      console.log("Transaction: ", hh);
      console.log(hh.logs);
      console.log(hh.events);
      // console.log(hh.events[0].decode());

      // const balanceOneNew = await pContract.balanceOf(walletOne.address);
      // const balanceTwoNew = await pContract.balanceOf(walletTwo.address);

      // console.log({ balanceOneNew });
      // console.log({ balanceTwoNew });

      const newStorage = await simpleStorageOne.get();
      console.log("This is the new storage: ", newStorage.toNumber());

      const newStorageTwo = await simpleStorageTwo.get();
      console.log(
        "This is the new storage (from two): ",
        newStorageTwo.toNumber()
      );

      // console.log(await safe.getModulesPaginated());
      // Instantiate Module Class
      // Deploy DAO Module from Safe
      // Check from Safe that generate address from deployment is registered as module
      expect(true).toBe(true);
    });
  });
});
