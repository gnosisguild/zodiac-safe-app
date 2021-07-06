import React, { useEffect, useState } from "react";
import { ContractInteractions } from "./contract/ContractInteractions";
import { Module } from "../../contexts/modules";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { Loader } from "@gnosis.pm/safe-react-components";
import { fetchContractABI } from "../../utils/contracts";

interface ModuleInteractionsProps {
  module: Module;
}

export const ModuleInteractions = ({ module }: ModuleInteractionsProps) => {
  const { safe } = useSafeAppsSDK();
  const [loading, setLoading] = useState(true);
  const [abi, setABI] = useState("");

  useEffect(() => {
    setLoading(true);
    setABI("");
    fetchContractABI(safe.chainId, module.address)
      .then(setABI)
      .catch((error) => console.warn("fetchContractABI", error))
      .finally(() => setLoading(false));
  }, [module, safe]);

  if (loading || !abi) return <Loader size="md" />;

  return <ContractInteractions address={module.address} abi={abi} />;
};
