import React, { useEffect } from "react";
import { AppLayout } from "./components/layout/AppLayout";
import { fetchModulesList, fetchPendingModules } from "./store/modules";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { useRootDispatch } from "./store";
import { Panel } from "./views/Panel/Panel";
import { Views } from "./Views";

const App: React.FC = () => {
  const dispatch = useRootDispatch();
  const { safe, sdk } = useSafeAppsSDK();

  useEffect(() => {
    dispatch(fetchPendingModules(safe));
    dispatch(
      fetchModulesList({
        safeSDK: sdk,
        chainId: safe.chainId,
        safeAddress: safe.safeAddress,
      })
    );
  }, [sdk, dispatch, safe]);

  return (
    <AppLayout left={<Panel />}>
      <Views />
    </AppLayout>
  );
};

export default App;
