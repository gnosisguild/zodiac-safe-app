import { ModuleDetails } from "./views/ModuleDetails/ModuleDetails";
import React from "react";
import { useRootSelector } from "./store";
import {
  getCurrentModule,
  getCurrentPendingModule,
} from "./store/modules/selectors";
import { AddModulesView } from "./views/AddModule/AddModulesView";
import { ModulePendingTransaction } from "./views/ModuleDetails/ModulePendingTransaction";

export const Views = () => {
  const currentModule = useRootSelector(getCurrentModule);
  const currentPendingModule = useRootSelector(getCurrentPendingModule);
  const loadingModules = useRootSelector(
    (state) => state.modules.loadingModules
  );

  if (currentModule) {
    return <ModuleDetails module={currentModule} />;
  }

  if (currentPendingModule) {
    return <ModulePendingTransaction />;
  }

  if (!loadingModules) {
    return <AddModulesView />;
  }

  return null;
};
