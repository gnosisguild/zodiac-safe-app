import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import React from "react";
import {
  Box,
  IconButton,
  makeStyles,
  Paper,
  withStyles,
} from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import { ContractReadFunctionsList } from "./ContractReadFunctionsList";
import { Row } from "../../../components/layout/Row";
import { ReactComponent as ReloadIcon } from "../../../assets/icons/reload-icon.svg";
import { TransactionBuilder } from "../transaction/TransactionBuilder";
import { increaseReloadCount, setOperation } from "../../../store/modules";
import { useRootDispatch, useRootSelector } from "../../../store";
import classNames from "classnames";
import { Operation } from "../../../store/modules/models";
import { getOperation } from "../../../store/modules/selectors";

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

interface ContractInteractionsProps {
  address: string;
  abi: string | string[];
}

const useStyles = makeStyles((theme) => ({
  content: {
    padding: theme.spacing(2.5),
    marginTop: theme.spacing(3),
  },
  hide: {
    display: "none",
  },
}));

export const ContractInteractions = ({
  address,
  abi,
}: ContractInteractionsProps) => {
  const classes = useStyles();
  const dispatch = useRootDispatch();
  const operation = useRootSelector(getOperation);

  const handleOperationChange = (operation?: Operation) => {
    if (operation) dispatch(setOperation(operation));
  };

  const handleReload = () => dispatch(increaseReloadCount());

  return (
    <>
      <Row alignItems="end">
        <ToggleButtonGroup
          exclusive
          size="small"
          value={operation}
          onChange={(evt, value) => handleOperationChange(value)}
        >
          <StyledToggleButton value="read">Read Contract</StyledToggleButton>
          <StyledToggleButton value="write">Write Contract</StyledToggleButton>
        </ToggleButtonGroup>

        <Box flexGrow={1} />

        {operation === "read" ? (
          <IconButton onClick={handleReload}>
            <ReloadIcon />
          </IconButton>
        ) : null}
      </Row>

      <Paper className={classes.content}>
        <div className={classNames({ [classes.hide]: operation !== "read" })}>
          <ContractReadFunctionsList address={address} abi={abi} />
        </div>
        <div className={classNames({ [classes.hide]: operation !== "write" })}>
          <TransactionBuilder address={address} abi={abi} />
        </div>
      </Paper>
    </>
  );
};
