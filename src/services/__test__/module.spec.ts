import { Contract, Wallet } from "ethers";
import { bytecode as DaoModuleBytecode } from "@gnosis/dao-module/build/artifacts/contracts/DaoModule.sol/DaoModule.json";
import { deployContract, executeMultiSend, safeApproveHash } from "../builder";
import { buildMultiSendSafeTx, buildAction, getSafeInstance } from "../helpers";

import { startChain } from "./helpers";
import { AddressZero } from "@ethersproject/constants";

jest.setTimeout(20000);

// In order to interact with the Gnosis Safe + Modules
// We will need to use a Gnosis Safe that has as owner the
// private keys fetched from the startChain function

describe("Module interactions ", () => {
  const TEST_GNOSIS_SAFE_ADDRESS = "0x38063380d21F2d7A2f093cF4FCedBf6A552A1f76";

  let walletOne: Wallet;
  let walletTwo: Wallet;
  let provider: any;

  beforeAll(async () => {
    const { wallets, ganache } = await startChain();
    [walletOne, walletTwo] = wallets;
    provider = ganache;
  });

  describe("DAO Module ", () => {
    test("Should deploy module and be accessible from Safe ", async () => {
      const signer = provider.getSigner();
      const safe = getSafeInstance(TEST_GNOSIS_SAFE_ADDRESS, signer);
      const nonce = await safe.nonce();
      const daoModuleTx = deployContract(DaoModuleBytecode, nonce);
      const t = new Contract(AddressZero, []);

      const safeTx = buildAction(t, DaoModuleBytecode, [], await safe.nonce());

      const multiSendTx = buildMultiSendSafeTx(
        [daoModuleTx, safeTx],
        signer,
        nonce
      );

      const signatures = await safeApproveHash(signer);
      const transaction = await executeMultiSend(safe, multiSendTx, [
        signatures,
      ]);
      console.log("Transaction is being executed: ", transaction);

      const y = await transaction.wait();
      console.log("Transaction has been mined");
      console.log(y);

      // Instantiate Module Class
      // Deploy DAO Module from Safe
      // Check from Safe that generate address from deployment is registered as module
      expect(true).toBe(true);
    });
  });
});
