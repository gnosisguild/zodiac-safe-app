import React, { useState } from "react";
import { Grid, makeStyles, Paper, Typography } from "@material-ui/core";
import { ModuleButton } from "./ModuleButton";
import { ReactComponent as DaoModuleImage } from "../../assets/images/dao-module.svg";
import { ReactComponent as DelayModuleImage } from "../../assets/images/delay-module.svg";
import { ReactComponent as CustomModuleImage } from "../../assets/images/custom-module-logo.svg";
import { useRootDispatch, useRootSelector } from "../../store";
import { getModulesList } from "../../store/modules/selectors";
import { ModuleModals } from "./modals/ModuleModals";
import { ModuleType } from "../../store/modules/models";
import { fetchPendingModules, setModuleAdded } from "../../store/modules";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(2.5, 2),
  },
  spacing: {
    marginBottom: theme.spacing(2),
  },
}));

export const AddModulesView = () => {
  const classes = useStyles();
  const dispatch = useRootDispatch();
  const { safe } = useSafeAppsSDK();
  const hasModules = useRootSelector(
    (state) => getModulesList(state).length > 0
  );
  const [module, setModule] = useState<ModuleType>();

  const handleSubmit = () => {
    dispatch(fetchPendingModules(safe));
    dispatch(setModuleAdded(true));
  };

  const title = hasModules ? "Add another module" : "Start by adding a module";

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item md={6} xs={8}>
          <Paper className={classes.paper}>
            <Typography variant="h4" className={classes.spacing}>
              {title}
            </Typography>
            <Typography variant="body2">
              Gnosis Safe Modules enable additional access-control logic for
              your Gnosis Safe account. Read more about what they are and how
              they can be used in{" "}
              <a
                href="https://help.gnosis-safe.io/en/articles/4934378-what-is-a-module"
                target="_blank"
                rel="noopener noreferrer"
              >
                this article
              </a>
              .
            </Typography>
          </Paper>
        </Grid>
        <Grid item md={6} xs={4} />
        <Grid item md={3} xs={4}>
          <ModuleButton
            title="Transaction Delay"
            description="Delay transactions so members can intervene"
            image={<DelayModuleImage />}
            onClick={() => setModule(ModuleType.DELAY)}
          />
        </Grid>
        <Grid item md={3} xs={4}>
          <ModuleButton
            title="DAO Module"
            description="Connect Reality.eth questions to your safe"
            image={<DaoModuleImage />}
            onClick={() => setModule(ModuleType.DAO)}
          />
        </Grid>
        <Grid item md={3} xs={4}>
          <ModuleButton
            title="Custom Module"
            description="Connect a pre-existing contract as a module"
            image={<CustomModuleImage />}
            onClick={() => setModule(ModuleType.UNKNOWN)}
          />
        </Grid>
      </Grid>

      <ModuleModals
        selected={module}
        onClose={() => setModule(undefined)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
