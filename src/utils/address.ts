import { getNetworkExplorerInfo } from "./explorers";

export const getExplorerInfo = (chainId: number, hash: string) => {
  const explorerData = getNetworkExplorerInfo(chainId);
  if (!explorerData) return;
  const type = hash.length > 42 ? "tx" : "address";
  return () => ({
    url: `${explorerData.url}/${type}/${hash}`,
    alt: explorerData.name,
  });
};
