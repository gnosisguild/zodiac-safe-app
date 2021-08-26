import React from "react";
import { Box, makeStyles } from "@material-ui/core";
import { HashInfo } from "../../components/ethereum/HashInfo";
import { Button, Text } from "@gnosis.pm/safe-react-components";
import { Address } from "../../components/ethereum/Address";
import { Module } from "../../store/modules/models";
import { disableModule } from "services";
import { useRootDispatch, useRootSelector } from "../../store";
import { getPendingRemoveModuleTransactions } from "../../store/modules/selectors";
import {
  addTransaction,
  openTransactionBuilder,
} from "../../store/transactionBuilder";
import {
  getRemoveModuleTxId,
  serializeTransaction,
} from "../../store/transactionBuilder/helpers";
import { Transaction } from "../../store/transactionBuilder/models";
import { SafeAbi } from "../../services/helpers";
import { Interface } from "@ethersproject/abi";
import { getTransactions } from "../../store/transactionBuilder/selectors";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";

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
  const { safe } = useSafeAppsSDK();
  const pendingRemoveModuleTransactions = useRootSelector(
    getPendingRemoveModuleTransactions
  );
  const txBuildersTransaction = useRootSelector(getTransactions);

  const isRemoveTxOnQueue = txBuildersTransaction.some(
    (tx) => tx.id === getRemoveModuleTxId(module)
  );
  const isModuleToBeRemoved = pendingRemoveModuleTransactions
    .map((pending) => pending.address)
    .includes(module.address);
  const disabledRemoveButton = isRemoveTxOnQueue || isModuleToBeRemoved;

  const removeModule = async () => {
    try {
      const { params } = await disableModule(
        module.parentModule,
        safe.chainId,
        module.address
      );
      const safeInterface = new Interface(SafeAbi);
      const disableModuleFunc = safeInterface.getFunction("disableModule");
      const transaction: Transaction = {
        module,
        params,
        id: getRemoveModuleTxId(module),
        func: disableModuleFunc,
        to: module.parentModule,
      };
      dispatch(addTransaction(serializeTransaction(transaction)));
      dispatch(openTransactionBuilder());
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
        disabled={disabledRemoveButton}
      >
        Remove
      </Button>
    </div>
  );
};
