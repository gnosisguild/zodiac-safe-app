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

  const title = hasModules ? "Add another mod" : "Start by adding a mod";

  return (
    <div className={classes.root}>
      <div className={classes.gridContainer}>
        <div className={classes.introBox}>
          <Paper className={classes.paper}>
            <Typography variant="h5" className={classes.title}>
              {title}
            </Typography>
            <Typography variant="body2">
              Built according to an open standard, the Zodiac collection of
              tools are mods that support, expand, and transform how
              organizations operate. Learn more about Zodiac in{" "}
              <a
                href="https://gnosisguild.mirror.xyz/OuhG5s2X5uSVBx1EK4tKPhnUc91Wh9YM0fwSnC8UNcg"
                target="_blank"
                rel="noopener noreferrer"
                className={classes.link}
              >
                this article
              </a>{" "}
              and about Gnosis Safe modules more generally in{" "}
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
          description="Enables on-chain execution based on the outcome of events reported by the Reality.eth oracle"
          image={<img src={RealityModuleImage} alt="Reality Module Logo" />}
          className={classes.firstModule}
          onClick={() => setModule(ModuleType.REALITY_ETH)}
        />

        <ModuleButton
          title="Delay Modifier"
          description="Enables a time delay between when a module initiates a transaction and when it can be executed"
          image={<img src={DelayModuleImage} alt="Delay Module Logo" />}
          onClick={() => setModule(ModuleType.DELAY)}
        />

        <ModuleButton
          title="Bridge Module"
          description="Enables an address on one chain to control an avatar on another chain using an Arbitrary Message Bridge (AMB)"
          image={<img src={AMBModuleImage} alt="AMB Module Logo" />}
          onClick={() => setModule(ModuleType.BRIDGE)}
        />

        <ModuleButton
          title="Exit Module"
          description="Enables participants to redeem a designated token for a proportional share of this account’digital assets"
          image={<img src={ExitModuleImage} alt="Exit Module Logo" />}
          onClick={() => setModule(ModuleType.EXIT)}
        />

        <ModuleButton
          title="Custom Module"
          description="Enable a custom contract as a module"
          image={<img src={CustomModuleImage} alt="Custom Module Logo" />}
          onClick={() => setModule(ModuleType.UNKNOWN)}
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
