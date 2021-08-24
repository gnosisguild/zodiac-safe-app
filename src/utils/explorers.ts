const REACT_APP_ETHERSCAN_KEY = process.env.REACT_APP_ETHERSCAN_KEY;

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
  safeTransactionApi: string;
  safeUrl: string;
  explorerApiKey?: string;
}

export const EXPLORERS_CONFIG: Record<ETHEREUM_NETWORK, ExplorerData> = {
  [ETHEREUM_NETWORK.MAINNET]: {
    networkExplorerName: "Etherscan",
    networkExplorerUrl: "https://etherscan.io",
    networkExplorerApiUrl: "https://api.etherscan.io/api",
    safeTransactionApi: "https://safe-transaction.gnosis.io/",
    safeUrl: "https://gnosis-safe.io/",
    explorerApiKey: REACT_APP_ETHERSCAN_KEY,
  },
  [ETHEREUM_NETWORK.RINKEBY]: {
    networkExplorerName: "Etherscan",
    networkExplorerUrl: "https://rinkeby.etherscan.io",
    networkExplorerApiUrl: "https://api-rinkeby.etherscan.io/api",
    safeTransactionApi: "https://safe-transaction.rinkeby.gnosis.io/",
    safeUrl: "https://rinkeby.gnosis-safe.io/",
    explorerApiKey: REACT_APP_ETHERSCAN_KEY,
  },
  [ETHEREUM_NETWORK.ROPSTEN]: {
    networkExplorerName: "Etherscan",
    networkExplorerUrl: "https://ropsten.etherscan.io/",
    networkExplorerApiUrl: "https://api-ropsten.etherscan.io/api",
    safeTransactionApi: "https://safe-transaction.rinkeby.gnosis.io/",
    safeUrl: "https://rinkeby.gnosis-safe.io/",
    explorerApiKey: REACT_APP_ETHERSCAN_KEY,
  },
  [ETHEREUM_NETWORK.LOCAL]: {
    networkExplorerName: "Etherscan",
    networkExplorerUrl: "https://rinkeby.etherscan.io",
    networkExplorerApiUrl: "https://api-rinkeby.etherscan.io/api",
    safeTransactionApi: "https://safe-transaction.rinkeby.gnosis.io/",
    safeUrl: "https://rinkeby.gnosis-safe.io/",
    explorerApiKey: REACT_APP_ETHERSCAN_KEY,
  },
  [ETHEREUM_NETWORK.ENERGY_WEB_CHAIN]: {
    networkExplorerName: "Energy web explorer",
    networkExplorerUrl: "https://explorer.energyweb.org",
    networkExplorerApiUrl: "https://explorer.energyweb.org/api",
    safeUrl: "https://rinkeby.gnosis-safe.io/",
    safeTransactionApi: "https://safe-transaction.rinkeby.gnosis.io/",
  },
  [ETHEREUM_NETWORK.VOLTA]: {
    networkExplorerName: "Volta explorer",
    networkExplorerUrl: "https://volta-explorer.energyweb.org",
    networkExplorerApiUrl: "https://volta-explorer.energyweb.org/api",
    safeUrl: "https://volta.gnosis-safe.io/",
    safeTransactionApi: "https://safe-transaction.rinkeby.gnosis.io/",
  },
  [ETHEREUM_NETWORK.XDAI]: {
    networkExplorerName: "Blockscout",
    networkExplorerUrl: "https://blockscout.com/poa/xdai",
    networkExplorerApiUrl: "https://blockscout.com/poa/xdai/api",
    safeUrl: "https://xdai.gnosis-safe.io/",
    safeTransactionApi: "https://safe-transaction.gnosis.io/",
  },
};

export const getNetworkExplorerInfo = (chainId: number) => {
  const networkBaseConfig = EXPLORERS_CONFIG[chainId as ETHEREUM_NETWORK];
  if (!networkBaseConfig) return;
  return {
    name: networkBaseConfig.networkExplorerName,
    url: networkBaseConfig.networkExplorerUrl,
    apiUrl: networkBaseConfig.networkExplorerApiUrl,
    apiKey: networkBaseConfig.explorerApiKey,
    safeTransactionApi: networkBaseConfig.safeTransactionApi,
    safeUrl: networkBaseConfig.safeUrl,
  };
};

export const getExplorerInfo = (chainId: number, hash: string) => {
  const explorerData = getNetworkExplorerInfo(chainId);
  if (!explorerData) return;
  const type = hash.length > 42 ? "tx" : "address";
  return () => ({
    url: `${explorerData.url}/${type}/${hash}`,
    alt: explorerData.name,
  });
};
