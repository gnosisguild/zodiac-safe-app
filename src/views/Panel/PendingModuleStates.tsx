import React, { useEffect } from "react";
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
import { ModulePendingItem } from "./Items/ModulePendingItem";
import { LoadingIcon } from "../../components/icons/LoadingIcon";
import { ReactComponent as AddIcon } from "../../assets/icons/add-circle-icon.svg";
import { ReactComponent as ModulePendingImg } from "../../assets/images/dao-module-pending.svg";
import { getModuleContractMetadata } from "../../utils/modulesValidation";
import { getModuleName } from "../../store/modules/helpers";

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
            retry: true,
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

  const image = isInstantExecution ? (
    <LoadingIcon icon={<AddIcon />} />
  ) : (
    <ModulePendingImg style={{ marginLeft: -4 }} />
  );
  const linkText = isInstantExecution
    ? "Transaction confirming..."
    : "Awaiting approval";

  return (
    <>
      {pendingCreateModuleTransactions.map((pendingModule, index) => {
        const props = {
          key: index,
          instant: isInstantExecution,
          onClick: () => dispatch(setCurrentPendingModule(pendingModule)),
          active: currentPending?.address === pendingModule.address,
        };
        const metadata = getModuleContractMetadata(pendingModule.module);
        const name = getModuleName(metadata?.type);
        return (
          <ModulePendingItem
            title={name}
            linkText={linkText}
            image={image}
            {...props}
          />
        );
      })}
    </>
  );
};
