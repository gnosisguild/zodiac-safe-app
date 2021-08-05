import React from "react";
import classNames from "classnames";
import { Box, Chip, makeStyles } from "@material-ui/core";
import { ArrowIcon } from "../../../components/icons/ArrowIcon";
import { AddressChip } from "../../../components/ethereum/AddressChip";
import { ModuleTransaction } from "../../../store/transactionBuilder/models";

const useStyles = makeStyles((theme) => ({
  title: {
    padding: theme.spacing(2, 0.5, 2, 0),
    marginRight: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    flexGrow: 1,
  },
  clickable: {
    cursor: "pointer",
  },
  moduleChip: {
    marginRight: theme.spacing(1),
    fontSize: 14,
  },
}));

export interface TransactionBlockHeaderTitleProps {
  edit: boolean;
  open: boolean;
  transaction: ModuleTransaction;

  onToggle(): void;
}

export const TransactionBlockHeaderTitle = ({
  edit,
  open,
  transaction,
  onToggle,
}: TransactionBlockHeaderTitleProps) => {
  const classes = useStyles();
  return (
    <Box
      className={classNames(classes.title, {
        [classes.clickable]: !edit,
      })}
      onClick={onToggle}
    >
      {transaction.module ? (
        <AddressChip
          className={classes.moduleChip}
          address={transaction.module.address}
          name={transaction.module.name}
        />
      ) : null}
      <Chip label={<b>{transaction.func.name}</b>} />
      <Box flexGrow={1} />
      {!edit ? <ArrowIcon up={open} /> : null}
    </Box>
  );
};
