import { Wallet } from "ethers";

import { startChain } from "./helpers";

jest.setTimeout(20000);

// In order to interact with the Gnosis Safe + Modules
// We will need to use a Gnosis Safe that has as owner the
// private keys fetched from the startChain function

describe("Module interactions ", () => {
  const TEST_GNOSIS_SAFE_ADDRESS = "";
  const TEST_DAO_MODULE_ADDRESS = "";
  const TEST_AMB_MODULE_ADDRESS = "";

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
      // Instantiate Module Class
      // Deploy DAO Module from Safe
      // Check from Safe that generate address from deployment is registered as module
      expect(true).toBe(true);
    });
  });
});
