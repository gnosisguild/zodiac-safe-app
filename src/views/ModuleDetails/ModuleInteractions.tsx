import React, { useEffect, useState } from "react";
import { ContractInteractions } from "./contract/ContractInteractions";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { getModuleData } from "../../utils/contracts";
import { ABI, Module } from "../../store/modules/models";
import { ModuleNoAvailable } from "./ModuleNoAvailable";
import { Skeleton } from "@material-ui/lab";

interface ModuleInteractionsProps {
  module: Module;
}

export const ModuleInteractions = ({ module }: ModuleInteractionsProps) => {
  const { safe, sdk } = useSafeAppsSDK();
  const [loading, setLoading] = useState(true);
  const [abi, setABI] = useState<ABI>();

  useEffect(() => {
    setLoading(true);
    setABI(undefined);
    getModuleData(sdk, safe.chainId, module.address)
      .then(({ abi }) => setABI(abi))
      .catch((error) => console.warn("getModuleABI", error))
      .finally(() => setLoading(false));
  }, [module, safe, sdk]);

  if (loading) return <Skeleton variant="rect" width={300} height={48} />;

  if (!abi) return <ModuleNoAvailable />;

  return <ContractInteractions address={module.address} abi={abi} />;
};
