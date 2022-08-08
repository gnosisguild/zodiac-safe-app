import { addSafeSnapToSettings } from "./setupService";
import snapshot from "@snapshot-labs/snapshot.js";

const SNAPSHOT_SETTINGS_SAMPLE = {
  name: "GnosisDAO",
  skin: "gnosis",
  about:
    "GnosisDAO transparently guides decisions on development, support, and governance of its GNO token ecosystem. Start your proposal here: https://forum.gnosis.io",
  terms: "ipfs://QmYMwQwmsDPTtt3ncu1CaZXyJgdYD4EMbn86oAxT3AVtye",
  avatar: "ipfs://QmVD5UHMZfvsuXJRdVcbnmrPgsUFjDjpSXAmfdv3W7MN42",
  github: "gnosis",
  symbol: "GNO",
  filters: {
    minScore: 1,
    defaultTab: "all",
  },
  network: "1",
  voting: {
    type: "basic",
    delay: 0,
    period: 604800,
    hideAbstain: false,
  },
  plugins: {
    quorum: {
      total: 75000,
      strategy: "static",
      basicCount: [0, 2],
    },
  },
  twitter: "gnosisdao",
  website: "https://gnosis.io",
  location: "Ethereum",
  strategies: [
    {
      name: "gno",
      network: "1",
      params: {
        symbol: "GNO",
        decimals: 18,
        SUBGRAPH_URL:
          "https://api.thegraph.com/subgraphs/id/QmYNFPz2j1S8wdm2nhou6wRhGXfVVFzVi37LKuvcHBayip",
      },
    },
    {
      name: "delegation",
      network: "1",
      params: {
        strategies: [
          {
            name: "gno",
            params: {
              symbol: "GNO",
              decimals: 18,
              SUBGRAPH_URL:
                "https://api.thegraph.com/subgraphs/id/QmYNFPz2j1S8wdm2nhou6wRhGXfVVFzVi37LKuvcHBayip",
            },
          },
        ],
      },
    },
    {
      name: "gno",
      network: "100",
      params: {
        symbol: "GNO",
        decimals: 18,
        SUBGRAPH_URL:
          "https://api.thegraph.com/subgraphs/id/QmduKVUHCPjR5tmNEgooXHBMGKqDJWrUPdp6dEMeJM6Kqa",
      },
    },
    {
      name: "delegation",
      network: "100",
      params: {
        strategies: [
          {
            name: "gno",
            params: {
              symbol: "GNO",
              decimals: 18,
              SUBGRAPH_URL:
                "https://api.thegraph.com/subgraphs/id/QmduKVUHCPjR5tmNEgooXHBMGKqDJWrUPdp6dEMeJM6Kqa",
            },
          },
        ],
      },
    },
  ],
};
const oracleAddress = "0x0000000000000000000000000000000000000005";

test("The SafeSnap plugin should be set", () => {
  expect(SNAPSHOT_SETTINGS_SAMPLE.plugins).not.toHaveProperty("safeSnap");
  const newSpaceSettings = addSafeSnapToSettings(
    SNAPSHOT_SETTINGS_SAMPLE,
    3,
    oracleAddress
  );
  expect(newSpaceSettings.plugins).toHaveProperty("safeSnap");
});

test("The new Space settings file should be a valide Snapshot Settings file", () => {
  const newSpaceSettings = addSafeSnapToSettings(
    SNAPSHOT_SETTINGS_SAMPLE,
    3,
    oracleAddress
  );
  const valid = snapshot.utils.validateSchema(
    snapshot.schemas.space,
    newSpaceSettings
  );
  expect(valid).toBe(true);
});

export {};
