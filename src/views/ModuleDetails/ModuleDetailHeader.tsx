import React from "react";
import { Module } from "../../contexts/modules";
import { Box, makeStyles } from "@material-ui/core";
import { HashInfo } from "../../components/ethereum/HashInfo";
import { Button, Text } from "@gnosis.pm/safe-react-components";
import { Address } from "../../components/ethereum/Address";

interface ModuleDetailHeaderProps {
  module: Module;
}

const useStyles = makeStyles((theme) => ({
  header: {
    minHeight: 88,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing(3),
  },
  text: {
    marginLeft: "16px !important",
    color: theme.palette.text.primary + " !important",
  },
  icon: {
    marginLeft: "16px",
  },
}));

export const ModuleDetailHeader = ({ module }: ModuleDetailHeaderProps) => {
  const classes = useStyles();

  return (
    <div className={classes.header}>
      <HashInfo hash={module.address} showAvatar showHash={false} />
      <Text size="xl" strong className={classes.text}>
        Address:
      </Text>
      <Address address={module.address} />

      <Box flexGrow={1} />

      <Button size="md" iconType="delete" variant="outlined">
        Remove
      </Button>
    </div>
  );
};
