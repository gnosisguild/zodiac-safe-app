import React, { useEffect, useState } from "react";
import { ContractInteractions } from "./contract/ContractInteractions";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { getModuleABI } from "../../utils/contracts";
import { Module } from "../../store/modules/models";
import { ModuleNoAvailable } from "./ModuleNoAvailable";
import { Skeleton } from "@material-ui/lab";

interface ModuleInteractionsProps {
  module: Module;
}

export const ModuleInteractions = ({ module }: ModuleInteractionsProps) => {
  const { safe, sdk } = useSafeAppsSDK();
  const [loading, setLoading] = useState(true);
  const [abi, setABI] = useState<string>();

  useEffect(() => {
    setLoading(true);
    setABI(undefined);
    getModuleABI(sdk, safe.chainId, module.address)
      .then(setABI)
      .catch((error) => console.warn("getModuleABI", error))
      .finally(() => setLoading(false));
  }, [module, safe, sdk]);

  if (loading) return <Skeleton variant="rect" width={300} height={48} />;

  if (!abi) return <ModuleNoAvailable />;

  return <ContractInteractions address={module.address} abi={abi} />;
};
