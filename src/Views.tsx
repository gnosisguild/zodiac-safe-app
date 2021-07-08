import { ModuleDetails } from "./views/ModuleDetails/ModuleDetails";
import React from "react";
import { useRootSelector } from "./store";
import { getCurrentModule } from "./store/modules/selectors";
import { AddModulesView } from "./views/AddModule/AddModulesView";

export const Views = () => {
  const currentModule = useRootSelector(getCurrentModule);
  const loadingModules = useRootSelector(
    (state) => state.modules.loadingModules
  );

  if (currentModule) {
    return <ModuleDetails module={currentModule} />;
  }

  if (!loadingModules) {
    return <AddModulesView />;
  }

  return null;
};
