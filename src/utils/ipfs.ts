const IPFS_GATEWAY = process.env.IPFS_GATEWAY;

export const getData = async (hash: string, ipns = false) => {
  const res = await fetch(`${IPFS_GATEWAY}/${ipns ? "ipns" : "ipfs"}/${hash}`);
  return res.json();
};
