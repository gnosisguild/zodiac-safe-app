import React, { useEffect } from "react";
import { AppLayout } from "./views/AppLayout";
import { ModuleDetails } from "./views/ModuleDetails/ModuleDetails";
import { fetchModulesList } from "./store/modules";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { useRootDispatch, useRootSelector } from "./store";
import { getCurrentModule } from "./store/modules/selectors";
import { Panel } from "./views/Panel/Panel";

const App: React.FC = () => {
  const dispatch = useRootDispatch();
  const { safe } = useSafeAppsSDK();
  const currentModule = useRootSelector(getCurrentModule);

  useEffect(() => {
    dispatch(fetchModulesList(safe.safeAddress));
  }, [dispatch, safe]);

  return (
    <AppLayout left={<Panel />}>
      <ModuleDetails module={currentModule} />
    </AppLayout>
  );
};

export default App;
