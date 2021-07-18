import { Provider, Contract } from "ethers-multicall";
import { getModule } from "@gnosis/module-factory";
import { DelayModule, Module, ModuleType } from "./models";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Fragment } from "@ethersproject/abi";

export const AddressOne = "0x0000000000000000000000000000000000000001";

export function isDelayModule(module: Module): module is DelayModule {
  return module.type === ModuleType.DELAY;
}

export async function fetchDelayModule(
  address: string,
  chainId: number
): Promise<DelayModule> {
  // TODO: Fetch Delay Module Data
  const provider = new JsonRpcProvider(
    `https://rinkeby.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`
  );
  const delayModule = getModule("delay", address, provider);
  const abi = delayModule.interface.fragments;
  const module = new Contract(delayModule.address, abi as Fragment[]);
  const ethCallProvider = new Provider(provider, chainId);
  const txCooldown = module.txCooldown();
  const txTimeout = module.txExpiration();
  const modules = module.getModulesPaginated(AddressOne, 10);
  try {
    const [cooldown, timeout, subModules] = await ethCallProvider.all([
      txCooldown,
      txTimeout,
      modules,
    ]);
    return {
      name: "Delay Module",
      type: ModuleType.DELAY,
      address,
      subModules: subModules[0],
      timeout: timeout.toString(),
      cooldown: cooldown.toString(),
    };
  } catch (error) {
    console.log("Eror fetching delay module");
    console.log({ error });
    return {
      name: "Delay Module",
      type: ModuleType.DELAY,
      address: address,
      subModules: [],
      timeout: 86400,
      cooldown: 86400,
    };
  }
}
