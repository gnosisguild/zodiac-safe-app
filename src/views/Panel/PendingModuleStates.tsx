import React, { useEffect } from "react";
import { DaoModulePendingItem } from "./Items/DaoModulePendingItem";
import { DelayModulePendingItem } from "./Items/DelayModulePendingItem";
import { ModuleType } from "../../store/modules/models";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { useRootDispatch, useRootSelector } from "../../store";
import {
  getCurrentPendingModule,
  getPendingCreateModuleTransactions,
  getPendingModules,
  getSafeThreshold,
} from "../../store/modules/selectors";
import {
  fetchModulesList,
  fetchPendingModules,
  setCurrentPendingModule,
} from "../../store/modules";
import { UnknownModulePendingItem } from "./Items/UnknownModulePendingItem";

export const PendingModuleStates = () => {
  const { sdk, safe } = useSafeAppsSDK();

  const dispatch = useRootDispatch();
  const currentPending = useRootSelector(getCurrentPendingModule);
  const pendingModuleTransactions = useRootSelector(getPendingModules);
  const pendingCreateModuleTransactions = useRootSelector(
    getPendingCreateModuleTransactions
  );
  const safeThreshold = useRootSelector(getSafeThreshold);
  const isInstantExecution = safeThreshold === 1;

  useEffect(() => {
    dispatch(fetchPendingModules(safe));
  }, [dispatch, safe]);

  useEffect(() => {
    if (isInstantExecution && pendingModuleTransactions.length) {
      const interval = setInterval(
        () => dispatch(fetchPendingModules(safe)),
        3000
      );
      return () => {
        clearInterval(interval);
        dispatch(
          fetchModulesList({
            safeSDK: sdk,
            chainId: safe.chainId,
            safeAddress: safe.safeAddress,
          })
        );
      };
    }
  }, [
    dispatch,
    isInstantExecution,
    sdk,
    safe,
    pendingModuleTransactions.length,
  ]);

  return (
    <>
      {pendingCreateModuleTransactions.map((pendingModule, index) => {
        const props = {
          key: index,
          instant: isInstantExecution,
          onClick: () => dispatch(setCurrentPendingModule(pendingModule)),
          active: currentPending?.address === pendingModule.address,
        };

        if (pendingModule.module === ModuleType.DAO)
          return <DaoModulePendingItem {...props} />;

        if (pendingModule.module === ModuleType.DELAY)
          return <DelayModulePendingItem {...props} />;

        return <UnknownModulePendingItem {...props} />;
      })}
    </>
  );
};
