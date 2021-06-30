import { BigNumber, Contract, Signer, Wallet } from "ethers";
import { AddressOne, getSafeInstance } from "services/helpers";
import { getModule } from "@gnosis/module-factory";
import {
  buildMultiSendSafeTx,
  prepareSafeTransaction,
  startChain,
} from "services/tests/utils";
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
  const SAFE_ADDRESS = "0x38063380d21F2d7A2f093cF4FCedBf6A552A1f76";
  const OLD_DAO_MODULE = "0xA04EAC970D550C6717822Ff07d075C07A0d01586";
  const NEW_DAO_MODULE = "0x327F67C24D1F24fcE614ae8a6D7309bf8736C8B3";

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
    safe = getSafeInstance(SAFE_ADDRESS, signer);
  });

  describe("DAO Module ", () => {
    test("Should fetch modules from Safe", async () => {
      const safeModules = await fetchModules(safe.address);
      expect(Array.isArray(safeModules)).toBeTruthy;
      expect(safeModules).toContainEqual(OLD_DAO_MODULE);
    });

    test("Should edit module config ", async () => {
      const NEW_MINIMUM_BOND = "123456789";
      const NEW_QUESTION_TIMEOUT = "987654321";
      const NEW_QUESTION_COOLDOWN = "5";

      const nonce = await safe.nonce();
      const daoModule = getModule("dao", OLD_DAO_MODULE, signer);

      const editModuleTransaction = await editModule("dao", OLD_DAO_MODULE, {
        setMinimumBond: NEW_MINIMUM_BOND,
        setQuestionTimeout: NEW_QUESTION_TIMEOUT,
        setQuestionCooldown: NEW_QUESTION_COOLDOWN,
      });

      const multiSendTx = await buildMultiSendSafeTx(
        editModuleTransaction,
        signer
      );

      const txData = {
        ...multiSendTx,
        nonce,
      };

      const executeTx = prepareSafeTransaction(txData, safe, signer, 1);
      await executeTx;

      const newMinimumBond = await daoModule.minimumBond();
      const newQuestionTimeout = await daoModule.questionTimeout();
      const newQuestionCooldown = await daoModule.questionCooldown();

      expect(newMinimumBond).toEqual(BigNumber.from(NEW_MINIMUM_BOND));
      expect(newQuestionTimeout).toEqual(Number(NEW_QUESTION_TIMEOUT));
      expect(newQuestionCooldown).toEqual(Number(NEW_QUESTION_COOLDOWN));
    });

    test("Should disable module of Safe ", async () => {
      const actualSafeModules = await fetchModules(safe.address);
      expect(actualSafeModules).toContainEqual(OLD_DAO_MODULE);

      const nonce = await safe.nonce();

      const disableModuleTransaction = await disableModule(
        SAFE_ADDRESS,
        OLD_DAO_MODULE
      );

      const safeTx = {
        ...disableModuleTransaction,
        nonce,
      };
      const executeTx = prepareSafeTransaction(safeTx, safe, signer);
      await executeTx;

      const [modules] = await safe.getModulesPaginated(AddressOne, 10);
      expect(modules).not.toContainEqual(OLD_DAO_MODULE);
    });

    test("Should enable module of Safe ", async () => {
      const nonce = await safe.nonce();

      const enableModuleTransaction = await enableModule(
        SAFE_ADDRESS,
        NEW_DAO_MODULE
      );

      const safeTx = {
        ...enableModuleTransaction,
        nonce,
      };
      const executeTx = prepareSafeTransaction(safeTx, safe, signer);
      await executeTx;

      const [modules] = await safe.getModulesPaginated(AddressOne, 10);
      expect(modules).toContainEqual(NEW_DAO_MODULE);
    });
  });
});
