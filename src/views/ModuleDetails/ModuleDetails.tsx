import React from "react";
import { Module } from "../../contexts/modules";
import { Box, makeStyles } from "@material-ui/core";
import { HashInfo } from "../../components/ethereum/HashInfo";
import {
  Text,
  Button,
  CopyToClipboardBtn,
  ExplorerButton,
} from "@gnosis.pm/safe-react-components";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { getExplorerInfo } from "../../utils/explorers";

interface ModuleDetailsProps {
  module: Module;
}

const useStyles = makeStyles((theme) => ({
  header: {
    minHeight: 88,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
  },
  text: {
    marginLeft: "16px !important",
    color: theme.palette.text.primary + " !important",
  },
  icon: {
    marginLeft: "16px",
  },
}));

export const ModuleDetails = ({ module }: ModuleDetailsProps) => {
  const { safe } = useSafeAppsSDK();
  const classes = useStyles();
  const safeExplorer = getExplorerInfo(safe.chainId, safe.safeAddress);

  return (
    <div className={classes.header}>
      <HashInfo hash={module.address} showAvatar showHash={false} />
      <Text size="xl" strong className={classes.text}>
        Address:
      </Text>
      <Text size="xl" className={classes.text}>
        {module.address}
      </Text>
      <CopyToClipboardBtn
        textToCopy={module.address}
        className={classes.icon}
      />
      {safeExplorer ? (
        <ExplorerButton explorerUrl={safeExplorer} className={classes.icon} />
      ) : null}

      <Box flexGrow={1} />

      <Button size="md" iconType="edit" variant="outlined">
        Edit
      </Button>
      <Button size="md" iconType="delete" variant="outlined">
        Remove
      </Button>
    </div>
  );
};
