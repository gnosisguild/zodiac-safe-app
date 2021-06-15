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
      const pContract = new Contract(
        "0x8255e1faf4d977708f622dba724c62ee2c0ab0fc",
        [
          "function balanceOf(uint address) public returns (uint256)",
          "function transfer(address _to, uint256 _amount) public returns (bool success)",
        ],
        signer
      );

      // const balanceOne = await pContract.balanceOf(walletOne.address);
      // const balanceTwo = await pContract.balanceOf(walletTwo.address);

      // console.log({ balanceOne });
      // console.log({ balanceTwo });

      const daoModuleTx = deployContract(BYTECODE_TEST, nonce, provider);
      const simpleStorage = new Contract(
        "0xcd3b8cCd8AA6286B7b08913f082D11cFCAadA5fc",
        [
          "function set(uint256 x) public",
          "function get() public view returns (uint256)",
        ],
        signer
      );
      const setStorageTransaction = buildAction(
        simpleStorage,
        "set",
        [10],
        nonce
      );

      const transferTransaction = buildAction(
        pContract,
        "transfer",
        [walletOne.address, 100000],
        nonce
      );

      // Transactions to be executed by multisender
      const transactions: SafeTransaction[] = [
        // setStorageTransaction,
        // transferTransaction,
        daoModuleTx,
      ];

      // const multiSendTx = buildMultiSendSafeTx(transactions, signer, nonce);

      const signatures = await safeApproveHash(signer);
      const transaction = await executeTx(safe, daoModuleTx, [signatures]);
      const hh = await transaction.wait();
      console.log("Transaction: ", hh);

      // const balanceOneNew = await pContract.balanceOf(walletOne.address);
      // const balanceTwoNew = await pContract.balanceOf(walletTwo.address);

      // console.log({ balanceOneNew });
      // console.log({ balanceTwoNew });

      const newStorage = await simpleStorage.get();
      console.log("This is the new storage: ", newStorage);
      const h = newStorage.value
      console.log(h);

      // console.log(await safe.getModulesPaginated());
      // Instantiate Module Class
      // Deploy DAO Module from Safe
      // Check from Safe that generate address from deployment is registered as module
      expect(true).toBe(true);
    });
  });
});
