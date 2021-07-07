import React, { useEffect } from "react";
import { AppLayout } from "./views/AppLayout";
import { ModuleDetails } from "./views/ModuleDetails/ModuleDetails";
import { useModules, useModulesSelector } from "./contexts/modules";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { fetchSafeModulesAddress } from "./services";
import { loadModules } from "./contexts/modules/actions";

const App: React.FC = () => {
  const currentModule = useModulesSelector((state) => state.current);

  const { safe } = useSafeAppsSDK();
  const { dispatch } = useModules();

  useEffect(() => {
    (async () => {
      //@TODO: Create a sanitize function which retrieve the subModules & name
      const moduleAddress = await fetchSafeModulesAddress(safe.safeAddress);
      //Since it's not interacting with any service we this helper should be in utils folder
      // or something like that
      const modules = moduleAddress.map((module: any) => ({
        address: module,
        subModules: [],
        name: "Cool Module",
      }));
      dispatch(loadModules(modules));
    })();
  }, [safe, dispatch]);

  return (
    <AppLayout>
      <ModuleDetails module={currentModule} />
    </AppLayout>
  );
};

export default App;
