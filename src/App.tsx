import React, { useEffect } from "react";
import { AppLayout } from "./views/AppLayout";
import { fetchModulesList } from "./store/modules";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { useRootDispatch } from "./store";
import { Panel } from "./views/Panel/Panel";
import { Views } from "./Views";

const App: React.FC = () => {
  const dispatch = useRootDispatch();
  const { safe } = useSafeAppsSDK();

  useEffect(() => {
    dispatch(
      fetchModulesList({ chainId: safe.chainId, safeAddress: safe.safeAddress })
    );
  }, [dispatch, safe]);

  return (
    <AppLayout left={<Panel />}>
      <Views />
    </AppLayout>
  );
};

export default App;
