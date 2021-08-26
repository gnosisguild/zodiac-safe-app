import React from "react";
import { Box, makeStyles } from "@material-ui/core";
import { HashInfo } from "../../components/ethereum/HashInfo";
import { Button, Text } from "@gnosis.pm/safe-react-components";
import { Address } from "../../components/ethereum/Address";
import { Module } from "../../store/modules/models";
import { disableModule } from "services";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { fetchPendingModules } from "../../store/modules";
import { useRootDispatch, useRootSelector } from "../../store";
import { getPendingRemoveModuleTransactions } from "../../store/modules/selectors";

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
  spacing: {
    marginLeft: theme.spacing(2),
  },
}));

export const ModuleDetailHeader = ({ module }: ModuleDetailHeaderProps) => {
  const classes = useStyles();
  const dispatch = useRootDispatch();
  const { sdk, safe } = useSafeAppsSDK();
  const pendingRemoveModuleTransactions = useRootSelector(
    getPendingRemoveModuleTransactions
  );

  const isModuleToBeRemoved = pendingRemoveModuleTransactions
    .map((pending) => pending.address)
    .includes(module.address);

  const removeModule = async () => {
    try {
      const transactions = await disableModule(
        module.parentModule || safe.safeAddress,
        safe.chainId,
        module.address
      );
      await sdk.txs.send({ txs: [transactions] });
      dispatch(fetchPendingModules(safe));
    } catch (error) {
      console.warn("could not remove module", error);
    }
  };

  return (
    <div className={classes.header}>
      <HashInfo
        showAvatar
        showHash={false}
        avatarSize="lg"
        hash={module.address}
      />
      <Text size="xl" strong className={classes.text}>
        Address:
      </Text>
      <Address
        address={module.address}
        classes={{
          container: classes.spacing,
          icon: classes.spacing,
        }}
      />

      <Box flexGrow={1} />

      <Button
        size="md"
        iconType="delete"
        variant="outlined"
        onClick={removeModule}
        disabled={isModuleToBeRemoved}
      >
        Remove
      </Button>
    </div>
  );
};
