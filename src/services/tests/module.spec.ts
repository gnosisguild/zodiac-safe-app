import { BigNumber, Contract, Signer, Wallet } from "ethers";
import { bytecode as DaoModuleBytecode } from "@gnosis/dao-module/build/artifacts/contracts/DaoModule.sol/DaoModule.json";
import { AddressZero } from "@ethersproject/constants";

import { AddressOne, DaoModuleAbi, getSafeInstance } from "services/helpers";
import { prepareSafeTransaction, startChain } from "./helpers";
import {
  disableModule,
  editModule,
  enableModule,
  fetchModules,
} from "services";

jest.setTimeout(80000);

// In order to interact with the Gnosis Safe + Modules
// We will need to use a Gnosis Safe that has as owner the
// private keys fetched from the startChain function
describe("Module interactions ", () => {
  const TEST_GNOSIS_SAFE_ADDRESS = "0x38063380d21F2d7A2f093cF4FCedBf6A552A1f76";

  let walletOne: Wallet;
  let walletTwo: Wallet;
  let provider: any;

  let signer: Signer;
  let safe: Contract;

  beforeAll(async () => {
    const { wallets, provider: p } = await startChain();
    [walletOne, walletTwo] = wallets;
    provider = p;

    signer = p.getSigner();
    safe = getSafeInstance(TEST_GNOSIS_SAFE_ADDRESS, signer);
  });

  describe("DAO Module ", () => {
    test("Should edit module config ", async () => {
      const MINIMUM_BOND = "123456789";

      const nonce = await safe.nonce();
      const daoModule = new Contract(
        "0xA04EAC970D550C6717822Ff07d075C07A0d01586",
        DaoModuleAbi,
        signer
      );

      const editModuleTransaction = await editModule(
        "dao",
        "0xA04EAC970D550C6717822Ff07d075C07A0d01586",
        {
          setMinimumBond: MINIMUM_BOND,
        }
      );

      // @TODO: We need to be able to pass the array of
      // editModuleTransaction applying multisend contract
      const txData = {
        ...editModuleTransaction[0],
        nonce,
      };

      const executeTx = prepareSafeTransaction(txData, safe, signer);
      await executeTx;

      const newMinimumBond = await daoModule.minimumBond();
      expect(newMinimumBond).toEqual(BigNumber.from(MINIMUM_BOND));
    });

    test("Should disable module of Safe ", async () => {
      const OLD_MODULE = "0xA04EAC970D550C6717822Ff07d075C07A0d01586";
      const actualSafeModules = await fetchModules(safe.address);
      expect(actualSafeModules).toContainEqual(OLD_MODULE);

      const nonce = await safe.nonce();

      const disableModuleTransaction = await disableModule(
        TEST_GNOSIS_SAFE_ADDRESS,
        OLD_MODULE
      );

      const safeTx = {
        ...disableModuleTransaction,
        nonce,
      };
      const executeTx = prepareSafeTransaction(safeTx, safe, signer);
      await executeTx;

      const [modules] = await safe.getModulesPaginated(AddressOne, 10);
      expect(modules).not.toContainEqual(OLD_MODULE);
    });

    test("Should enable module of Safe ", async () => {
      const NEW_MODULE = "0x327F67C24D1F24fcE614ae8a6D7309bf8736C8B3";

      const nonce = await safe.nonce();

      const enableModuleTransaction = await enableModule(
        TEST_GNOSIS_SAFE_ADDRESS,
        NEW_MODULE
      );

      const safeTx = {
        ...enableModuleTransaction,
        nonce,
      };
      const executeTx = prepareSafeTransaction(safeTx, safe, signer);
      await executeTx;

      const [modules] = await safe.getModulesPaginated(AddressOne, 10);
      expect(modules).toContainEqual(NEW_MODULE);
    });
  });
});
