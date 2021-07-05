import React, { useMemo, useState } from "react";
import { FunctionFragment } from "@ethersproject/abi";
import { Box, Button, makeStyles, Typography } from "@material-ui/core";
import { Collapsable } from "../../Collapsable";
import { ContractQueryForm } from "../contract/ContractQueryForm";
import { TextField } from "../../input/TextField";
import { getWriteFunction } from "../../../utils/contracts";
import classNames from "classnames";
import { Icon } from "@gnosis.pm/safe-react-components";
import { Transaction } from "./TransactionBuilder";

interface AddTransactionBlockProps {
  abi: string | string[];
  onAdd(transaction: Transaction): void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
  },
  greyText: {
    "& select": {
      color: theme.palette.primary.main,
    },
  },
  icon: {
    color: theme.palette.secondary.main,
  },
  queryButton: {
    marginTop: theme.spacing(2),
    textTransform: "none",
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
    color: theme.palette.secondary.main + " !important",
    borderColor: theme.palette.secondary.main + " !important",
  },
}));

type TransactionFieldsProps = { func: FunctionFragment } & Pick<
  AddTransactionBlockProps,
  "onAdd"
>;

const TransactionFields = ({ func, onAdd }: TransactionFieldsProps) => {
  const classes = useStyles();
  const handleAdd = (params: any[]) => {
    onAdd({
      id: `${func.name}_${new Date().getTime()}`,
      func,
      params,
    });
  };
  return (
    <ContractQueryForm func={func}>
      {({ fields, areParamsValid, getParams }) => (
        <>
          {fields.map((field) => (
            <Box marginTop={2}>{field}</Box>
          ))}
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            onClick={() => handleAdd(getParams())}
            disabled={!areParamsValid}
            classes={{ disabled: classes.buttonDisabled }}
            className={classes.queryButton}
            startIcon={
              <Icon
                className={classes.icon}
                type="add"
                size="md"
                color="primary"
              />
            }
          >
            Add this transaction
          </Button>
        </>
      )}
    </ContractQueryForm>
  );
};

export const AddTransactionBlock = ({
  abi,
  onAdd,
}: AddTransactionBlockProps) => {
  const classes = useStyles();
  const writeFunctions = useMemo(() => getWriteFunction(abi), [abi]);
  const [funcIndex, setFuncIndex] = useState<string>("none");

  const content = (
    <>
      <TextField
        select
        value={funcIndex}
        onChange={(event) => setFuncIndex(event.target.value)}
        SelectProps={{ native: true }}
        className={classNames({ [classes.greyText]: funcIndex === "none" })}
        color="secondary"
        label="Function"
      >
        <option value="none">Select function</option>
        {writeFunctions.map((func, index) => (
          <option key={func.format("full")} value={index}>
            {func.name}
          </option>
        ))}
      </TextField>
      {funcIndex && funcIndex !== "none" ? (
        <TransactionFields
          func={writeFunctions[parseInt(funcIndex)]}
          onAdd={onAdd}
        />
      ) : null}
    </>
  );

  return (
    <Collapsable open content={content} className={classes.root}>
      <Typography variant="h6">Add new transaction</Typography>
    </Collapsable>
  );
};
