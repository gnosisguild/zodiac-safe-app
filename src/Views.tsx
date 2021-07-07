import { ModuleDetails } from "./views/ModuleDetails/ModuleDetails";
import React from "react";
import { useRootSelector } from "./store";
import { getCurrentModule } from "./store/modules/selectors";
import { AppModule } from "./views/AddModule/AddModule";

export const Views = () => {
  const currentModule = useRootSelector(getCurrentModule);

  if (currentModule) {
    return <ModuleDetails module={currentModule} />;
  }

  return <AppModule />;
};
