import React, { useEffect } from "react";
import { DaoModulePendingItem } from "./Items/DaoModulePendingItem";
import { DelayModulePendingItem } from "./Items/DelayModulePendingItem";
import { ModuleOperation, ModuleType } from "../../store/modules/models";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { useRootDispatch, useRootSelector } from "../../store";
import {
  getPendingModules,
  getSafeThreshold,
} from "../../store/modules/selectors";
import { fetchModulesList, fetchPendingModules } from "../../store/modules";
import { UnknownModulePendingItem } from "./Items/UnknownModulePendingItem";

export const PendingModuleStates = () => {
  const { sdk, safe } = useSafeAppsSDK();

  const dispatch = useRootDispatch();
  const pendingModules = useRootSelector(getPendingModules);
  const safeThreshold = useRootSelector(getSafeThreshold);

  const isInstantExecution = safeThreshold === 1;

  useEffect(() => {
    dispatch(fetchPendingModules(safe));
  }, [dispatch, safe]);

  useEffect(() => {
    if (isInstantExecution && pendingModules.length) {
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
  }, [dispatch, isInstantExecution, sdk, safe, pendingModules.length]);

  const isCreateDaoModulePending = pendingModules.some(
    (pending) =>
      pending.operation === ModuleOperation.CREATE &&
      pending.module === ModuleType.DAO
  );
  const isCreateDelayModulePending = pendingModules.some(
    (pending) =>
      pending.operation === ModuleOperation.CREATE &&
      pending.module === ModuleType.DELAY
  );
  const isCreateCustomModulePending = pendingModules.some(
    (pending) =>
      pending.operation === ModuleOperation.CREATE &&
      pending.module === ModuleType.UNKNOWN
  );

  const isRemoveDaoModulePending = pendingModules.some(
    (pending) =>
      pending.operation === ModuleOperation.REMOVE &&
      pending.module === ModuleType.DAO
  );
  const isRemoveDelayModulePending = pendingModules.some(
    (pending) =>
      pending.operation === ModuleOperation.REMOVE &&
      pending.module === ModuleType.DELAY
  );
  const isRemoveUnknownModulePending = pendingModules.some(
    (pending) =>
      pending.operation === ModuleOperation.REMOVE &&
      pending.module === ModuleType.DELAY
  );
  return (
    <>
      {isCreateDaoModulePending ? (
        <DaoModulePendingItem instant={isInstantExecution} />
      ) : null}
      {isCreateDelayModulePending ? (
        <DelayModulePendingItem instant={isInstantExecution} />
      ) : null}
      {isCreateCustomModulePending ? (
        <UnknownModulePendingItem instant={isInstantExecution} />
      ) : null}
      {isRemoveDaoModulePending ? (
        <DaoModulePendingItem remove instant={isInstantExecution} />
      ) : null}
      {isRemoveDelayModulePending ? (
        <DelayModulePendingItem remove instant={isInstantExecution} />
      ) : null}
      {isRemoveUnknownModulePending ? (
        <UnknownModulePendingItem remove instant={isInstantExecution} />
      ) : null}
    </>
  );
};
