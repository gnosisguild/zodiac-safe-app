import React from "react";
import { makeStyles, Paper } from "@material-ui/core";
import { ContractReadFunctionsList } from "./ContractReadFunctionsList";
import { Row } from "../../../components/layout/Row";
import { ContractOperationToggleButtons } from "../ContractOperationToggleButtons";

interface ContractInteractionsProps {
  address: string;
  abi: string | string[];
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
}: ContractInteractionsProps) => {
  const classes = useStyles();

  return (
    <>
      <Row alignItems="end">
        <ContractOperationToggleButtons value="read" disabled />
      </Row>

      <Paper className={classes.content}>
        <ContractReadFunctionsList preview address={address} abi={abi} />
      </Paper>
    </>
  );
};
