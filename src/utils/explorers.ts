export enum ETHEREUM_NETWORK {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  XDAI = 100,
  ENERGY_WEB_CHAIN = 246,
  LOCAL = 4447,
  VOLTA = 73799,
}

interface ExplorerData {
  networkExplorerName: string;
  networkExplorerUrl: string;
  networkExplorerApiUrl: string;
}

export const EXPLORERS_CONFIG: Record<ETHEREUM_NETWORK, ExplorerData> = {
  [ETHEREUM_NETWORK.MAINNET]: {
    networkExplorerName: "Etherscan",
    networkExplorerUrl: "https://etherscan.io",
    networkExplorerApiUrl: "https://api.etherscan.io/api",
  },
  [ETHEREUM_NETWORK.RINKEBY]: {
    networkExplorerName: "Etherscan",
    networkExplorerUrl: "https://rinkeby.etherscan.io",
    networkExplorerApiUrl: "https://api-rinkeby.etherscan.io/api",
  },
  [ETHEREUM_NETWORK.ROPSTEN]: {
    networkExplorerName: "Etherscan",
    networkExplorerUrl: "https://ropsten.etherscan.io/",
    networkExplorerApiUrl: "https://api-ropsten.etherscan.io/api",
  },
  [ETHEREUM_NETWORK.LOCAL]: {
    networkExplorerName: "Etherscan",
    networkExplorerUrl: "https://rinkeby.etherscan.io",
    networkExplorerApiUrl: "https://api-rinkeby.etherscan.io/api",
  },
  [ETHEREUM_NETWORK.ENERGY_WEB_CHAIN]: {
    networkExplorerName: "Energy web explorer",
    networkExplorerUrl: "https://explorer.energyweb.org",
    networkExplorerApiUrl: "https://explorer.energyweb.org/api",
  },
  [ETHEREUM_NETWORK.VOLTA]: {
    networkExplorerName: "Volta explorer",
    networkExplorerUrl: "https://volta-explorer.energyweb.org",
    networkExplorerApiUrl: "https://volta-explorer.energyweb.org/api",
  },
  [ETHEREUM_NETWORK.XDAI]: {
    networkExplorerName: "Blockscout",
    networkExplorerUrl: "https://blockscout.com/poa/xdai",
    networkExplorerApiUrl: "https://blockscout.com/poa/xdai/api",
  },
};

export const getNetworkExplorerInfo = (chainId: number) => {
  const networkBaseConfig = EXPLORERS_CONFIG[chainId as ETHEREUM_NETWORK];
  if (!networkBaseConfig) return;
  return {
    name: networkBaseConfig.networkExplorerName,
    url: networkBaseConfig.networkExplorerUrl,
    apiUrl: networkBaseConfig.networkExplorerApiUrl,
  };
};
