// Takes care of the interaction with Custom Modules (DAOModule - AMBModule) and Gnosis Safe contracts

const DAO_MODULE_METHODS = {
  setQuestion: "setQuestion",
};
const AMB_MODULE_METHODS = {
  setAmb: "setAmb",
};

type Methods =
  | keyof typeof DAO_MODULE_METHODS
  | keyof typeof AMB_MODULE_METHODS;

export class Module {
  public executeUpdate(method: Methods) {}
  //Abstract all methods from contracts
}

const t = new Module();
t.executeUpdate("setAmb");
