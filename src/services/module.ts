import { Contract, ContractFactory, Signer } from "ethers";
import {
  abi as DaoModuleAbi,
  bytecode as DaoModuleBytecode,
} from "@gnosis/dao-module/build/artifacts/contracts/DaoModule.sol/DaoModule.json";
import {
  abi as AmbModuleAbi,
  bytecode as AmbModuleBytecode,
} from "@gnosis/AMBModule/build/artifacts/contracts/AMBModule.sol/AMBModule.json";

const MODULE_METHODS = {
  dao: {
    setQuestion: "setQuestion",
    setArbitrator: "setArbitrator",
    setQuestionTimeout: "setQuestionTimeout",
    setQuestionCooldown: "setQuestionCooldown",
    setMinimumBond: "setMinimumBond",
    setTemplate: "setTemplate",
    setAnswerExpiration: "setAnswerExpiration",
  },
  amb: {
    setAmb: "setAmb",
    setChainId: "setChainId",
    setOwner: "setOwner",
  },
};

type KnownModules = keyof typeof MODULE_METHODS;

interface DaoModuleParams {
  executor: string;
  oracle: string;
  timeout: number;
  cooldown: number;
  expiration: number;
  bond: number;
  templateId: number;
}

interface AmbModuleParams {
  executor: string;
  amb: string;
  owner: string;
  chainId: string;
}

type ModuleDeploymentParams = DaoModuleParams | AmbModuleParams;

// Takes care of the interaction with Custom Modules (DAOModule - AMBModule) and Gnosis Safe contracts
export class Module {
  public static async deploy(
    module: KnownModules,
    args: ModuleDeploymentParams,
    signer: Signer
  ) {
    switch (module) {
      case "dao":
        return await this.deployContract(
          DaoModuleAbi,
          DaoModuleBytecode,
          args,
          signer
        );
      case "amb":
        return await this.deployContract(
          AmbModuleAbi,
          AmbModuleBytecode,
          args,
          signer
        );
    }
  }

  public enable() {}
  public fetchModules() {}
  public disable() {}
  public executeUpdate<T extends KnownModules>(
    module: T,
    method: keyof typeof MODULE_METHODS[T]
  ) {
    switch (module) {
      case "dao":
    }

    // const a = module
  }

  private static deployContract = async (
    abi: any,
    bytecode: string,
    args: ModuleDeploymentParams,
    signer: Signer
  ) => {
    const factory = new ContractFactory(abi, bytecode, signer);
    const contract = await factory.deploy(args);
    await contract.deployTransaction.wait();
    return contract.address;
  };
}

// const t = new Module();
// t.executeUpdate("dao", "setQuestion");
