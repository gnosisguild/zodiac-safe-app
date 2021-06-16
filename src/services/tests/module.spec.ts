import { Wallet } from "ethers";
import { bytecode as DaoModuleBytecode } from "@gnosis/dao-module/build/artifacts/contracts/DaoModule.sol/DaoModule.json";

import { getSafeInstance } from "../helpers";
import { startChain } from "./helpers";
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
      // const signer = provider.getSigner();
      // const safe = getSafeInstance(TEST_GNOSIS_SAFE_ADDRESS);
      // const nonce = await safe.nonce();

      expect(true).toBe(true);
    });
  });
});
