import React from "react";
import { makeStyles, Paper } from "@material-ui/core";
import { ContractReadFunctionsList } from "./ContractReadFunctionsList";
import { ContractOperationToggleButtons } from "../ContractOperationToggleButtons";
import { ABI } from "../../../store/modules/models";

interface ContractInteractionsPreviewProps {
  address: string;
  abi: ABI;
}

const useStyles = makeStyles((theme) => ({
  content: {
    padding: theme.spacing(2.5),
    marginTop: theme.spacing(3),
  },
}));

export const ContractInteractionsPreview = ({
  address,
  abi,
}: ContractInteractionsPreviewProps) => {
  const classes = useStyles();

  return (
    <>
      <ContractOperationToggleButtons value="read" disabled />

      <Paper className={classes.content}>
        <ContractReadFunctionsList preview address={address} abi={abi} />
      </Paper>
    </>
  );
};
