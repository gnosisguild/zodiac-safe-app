import React, { useEffect } from "react";
import { Box, makeStyles } from "@material-ui/core";
import { Button, Title } from "@gnosis.pm/safe-react-components";
import { ModuleList } from "./ModuleList";
import { loadModules, useModules } from "../../contexts/modules";
import { Row } from "../../components/layout/Row";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { createAndAddModule, fetchModules } from "services";
import { deployAndSetUpModule } from "@gnosis/module-factory";

const useStyles = makeStyles((theme) => ({
  hashInfo: {
    "& p": {
      color: theme.palette.text.primary + " !important",
    },
  },
  content: {
    padding: theme.spacing(3),
  },
  smallButton: {
    minWidth: "auto !important",
    height: "auto !important",
    padding: "8px 12px 8px 12px !important",
    borderRadius: "2px !important",
  },
  moduleList: {
    marginTop: theme.spacing(3),
  },
}));

export const Panel = () => {
  const classes = useStyles();
  const { sdk, safe } = useSafeAppsSDK();
  const { state, dispatch } = useModules();

  useEffect(() => {
    (async () => {
      const modules = await fetchModules(safe.safeAddress);
      //@TODO: Create a sanitize function which retrieve the subModules & name
      //Since it's not interacting with any service we this helper should be in utils folder
      // or something like that
      const m = modules.map((e: any) => ({
        address: e,
        subModules: [],
        name: "Cool Module",
      }));
      dispatch(loadModules(m));
    })();
  }, [safe, dispatch]);

  // @TODO: Make the deployment dynamic - Attach to UI state
  const deployModule = async () => {
    try {
      const txs = await createAndAddModule(
        "dao",
        {
          executor: safe.safeAddress,
          timeout: 100,
          cooldown: 180,
          expiration: 2000,
          bond: 10000,
          templateId: 10,
        },
        safe.safeAddress
      );

      const { safeTxHash } = await sdk.txs.send({
        txs,
      });
      console.log({ safeTxHash });
      const safeTx = await sdk.txs.getBySafeTxHash(safeTxHash);
      console.log({ safeTx });
    } catch (error) {
      console.log("Error deploying module: ")
      console.log(error);
    }
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Row alignItems="center" className={classes.content}>
        <Title size="sm" strong withoutMargin>
          <span style={{ letterSpacing: -1, fontSize: 28 }}>
            Module Manager
          </span>
        </Title>
        <Box flexGrow={1} />
        <Button
          className={classes.smallButton}
          variant="outlined"
          size="md"
          color="primary"
          iconType="add"
          onClick={deployModule}
        >
          Add
        </Button>
      </Row>

      <ModuleList modules={state.list} />
    </Box>
  );
};
