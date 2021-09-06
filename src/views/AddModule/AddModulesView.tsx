import React, { useState } from "react";
import { makeStyles, Paper, Typography } from "@material-ui/core";
import { ModuleButton } from "./ModuleButton";
import { ReactComponent as RealityModuleImage } from "../../assets/images/dao-module.svg";
import { ReactComponent as DelayModuleImage } from "../../assets/images/delay-module.svg";
import { ReactComponent as CustomModuleImage } from "../../assets/images/custom-module-logo.svg";
import { useRootDispatch, useRootSelector } from "../../store";
import { getModulesList } from "../../store/modules/selectors";
import { ModuleModals } from "./modals/ModuleModals";
import { ModuleType } from "../../store/modules/models";
import { fetchPendingModules, setModuleAdded } from "../../store/modules";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import classNames from "classnames";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(284px, 1fr))",
    gap: theme.spacing(2),
    "@media (max-width:930px)": {
      gridTemplateColumns: "repeat(auto-fill, minmax(243px, 1fr))",
    },
  },
  paper: {
    padding: theme.spacing(2.5, 2),
    background: theme.palette.background.default,
  },
  title: {
    marginBottom: theme.spacing(2),
    fontSize: "20px",
  },
  introBox: {
    gridColumn: "1/3",
    "@media (max-width:930px)": {
      gridColumn: "1/2",
    },
  },
  firstModule: {
    gridColumn: 1,
  },
  modules: {
    borderRadius: "6px",
    border: "2px solid white",
    "&:hover": {
      borderColor: theme.palette.secondary.main,
    },
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
      <div className={classes.gridContainer}>
        <div className={classes.introBox}>
          <Paper className={classes.paper}>
            <Typography variant="h4" className={classes.title}>
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
        </div>
        <div className={classNames(classes.firstModule, classes.modules)}>
          <ModuleButton
            title="Transaction Delay"
            description="Delay transactions so members can intervene"
            image={<DelayModuleImage />}
            onClick={() => setModule(ModuleType.DELAY)}
          />
        </div>
        <div className={classes.modules}>
          <ModuleButton
            title="DAO Module"
            description="Connect Reality.eth questions to your safe"
            image={<RealityModuleImage />}
            onClick={() => setModule(ModuleType.REALITY_ETH)}
          />
        </div>
        <div className={classes.modules}>
          <ModuleButton
            title="AMB Module"
            description="Execute transactions initiated on another chain"
            image={<CustomModuleImage />}
            onClick={() => setModule(ModuleType.AMB)}
          />
        </div>
        <div className={classes.modules}>
          <ModuleButton
            title="Exit Module"
            description="Connect Reality.eth questions to your safe"
            image={<CustomModuleImage />}
            onClick={() => setModule(ModuleType.EXIT)}
          />
        </div>
        <div className={classes.modules}>
          <ModuleButton
            title="Custom Module"
            description="Connect a pre-existing contract as a module"
            image={<CustomModuleImage />}
            onClick={() => setModule(ModuleType.UNKNOWN)}
          />
        </div>
      </div>

      <ModuleModals
        selected={module}
        onClose={() => setModule(undefined)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
