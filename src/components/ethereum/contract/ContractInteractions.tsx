import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import React, { useState } from "react";
import { makeStyles, Paper, withStyles } from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import { ContractReadFunctionList } from "./ContractReadFunctionList";

const StyledToggleButton = withStyles((theme) => ({
  root: {
    borderColor: theme.palette.secondary.main,
    padding: theme.spacing(1, 2.5),
    "& span": {
      fontFamily: theme.typography.fontFamily,
      fontSize: 16,
      textTransform: "none",
      color: theme.palette.text.primary + " !important",
    },
  },
  selected: {
    backgroundColor: theme.palette.secondary.main + " !important",
    "& span": {
      color: theme.palette.common.white + " !important",
    },
  },
}))(ToggleButton);

type Operation = "read" | "write";

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

export const ContractInteractions = ({
  address,
  abi,
}: ContractInteractionsProps) => {
  const classes = useStyles();
  const [operation, setOperation] = useState<Operation>("read");

  const handleOperationChange = (operation?: Operation) => {
    if (operation) setOperation(operation);
  };

  return (
    <>
      <ToggleButtonGroup
        exclusive
        size="small"
        value={operation}
        onChange={(evt, value) => handleOperationChange(value)}
      >
        <StyledToggleButton value="read">Read Contract</StyledToggleButton>
        <StyledToggleButton value="write">Write Contract</StyledToggleButton>
      </ToggleButtonGroup>

      <Paper className={classes.content}>
        {operation === "read" ? (
          <ContractReadFunctionList address={address} abi={abi} />
        ) : null}
      </Paper>
    </>
  );
};
