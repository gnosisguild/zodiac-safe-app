import React, { useEffect } from "react";
import { AppLayout } from "./components/layout/AppLayout";
import { fetchModulesList } from "./store/modules";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { useRootDispatch } from "./store";
import { Panel } from "./views/Panel/Panel";
import { Views } from "./Views";
import { Header } from "./views/Header/Header";
import { makeStyles } from "@material-ui/core";
import { TransactionBuilder } from "./views/TransactionBuilder/TransactionBuilder";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3, 4, 4, 4),
    height: "100%",
  },
}));

const App: React.FC = () => {
  const dispatch = useRootDispatch();
  const { safe, sdk } = useSafeAppsSDK();
  const classes = useStyles();

  useEffect(() => {
    dispatch(
      fetchModulesList({
        safeSDK: sdk,
        chainId: safe.chainId,
        safeAddress: safe.safeAddress,
      })
    );
  }, [sdk, dispatch, safe]);

  return (
    <div className={classes.root}>
      <Header />
      <AppLayout left={<Panel />}>
        <Views />
      </AppLayout>
      <TransactionBuilder />
    </div>
  );
};

export default App;
