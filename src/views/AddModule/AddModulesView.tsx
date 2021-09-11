import React, { useState } from "react";
import { makeStyles, Paper, Typography } from "@material-ui/core";
import { ModuleButton } from "./ModuleButton";
import RealityModuleImage from "../../assets/images/reality-module-logo.png";
import DelayModuleImage from "../../assets/images/delay-module-logo.png";
import CustomModuleImage from "../../assets/images/custom-module-logo.png";
import AMBModuleImage from "../../assets/images/bridge-module-logo.png";
import ExitModuleImage from "../../assets/images/exit-module-logo.png";
import { useRootDispatch, useRootSelector } from "../../store";
import { getModulesList } from "../../store/modules/selectors";
import { ModuleModals } from "./modals/ModuleModals";
import { ModuleType } from "../../store/modules/models";
import { fetchPendingModules, setModuleAdded } from "../../store/modules";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1.5),
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2.5, 2),
    background: "none",
    "&::before": {
      content: "none",
    },
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
  link: {
    color: theme.palette.text.primary,
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
                className={classes.link}
              >
                this article
              </a>
              .
            </Typography>
          </Paper>
        </div>

        <ModuleButton
          title="Reality Module"
          description="Connect Reality.eth questions to your safe"
          image={<img src={RealityModuleImage} alt="Reality Module Logo" />}
          className={classes.firstModule}
          onClick={() => setModule(ModuleType.REALITY_ETH)}
        />

        <ModuleButton
          title="Custom Module"
          description="Connect a pre-existing contract as a module"
          image={<img src={CustomModuleImage} alt="Custom Module Logo" />}
          onClick={() => setModule(ModuleType.UNKNOWN)}
        />

        <ModuleButton
          title="Transaction Delay"
          description="Delay transactions so members can intervene"
          image={<img src={DelayModuleImage} alt="Delay Module Logo" />}
          onClick={() => setModule(ModuleType.DELAY)}
        />

        <ModuleButton
          title="AMB Module"
          description="Execute transactions initiated on another chain"
          image={<img src={AMBModuleImage} alt="AMB Module Logo" />}
          onClick={() => setModule(ModuleType.AMB)}
        />

        <ModuleButton
          title="Exit Module"
          description="Connect Reality.eth questions to your safe"
          image={<img src={ExitModuleImage} alt="Exit Module Logo" />}
          onClick={() => setModule(ModuleType.EXIT)}
        />
      </div>

      <ModuleModals
        selected={module}
        onClose={() => setModule(undefined)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
