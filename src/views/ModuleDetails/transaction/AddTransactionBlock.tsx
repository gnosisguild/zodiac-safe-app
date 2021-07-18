import React, { useEffect, useMemo, useState } from "react";
import { FunctionFragment } from "@ethersproject/abi";
import { Box, makeStyles, Typography } from "@material-ui/core";
import { Collapsable } from "../../../components/Collapsable";
import { ContractQueryForm } from "../../../components/ethereum/ContractQueryForm";
import { TextField } from "../../../components/input/TextField";
import { getWriteFunction } from "../../../utils/contracts";
import classNames from "classnames";
import { Icon } from "@gnosis.pm/safe-react-components";
import { ModuleTransaction } from "./TransactionBuilder";
import { ActionButton } from "../../../components/ActionButton";
import { ParamInput } from "../../../components/ethereum/ParamInput";
import { useRootDispatch, useRootSelector } from "../../../store";
import { getAddTransaction } from "../../../store/transactionBuilder/selectors";
import { resetAddTransaction } from "../../../store/transactionBuilder";

interface AddTransactionBlockProps {
  abi: string | string[];
  onAdd(transaction: ModuleTransaction): void;
}

const useStyles = makeStyles((theme) => ({
  greyText: {
    "& select": {
      color: theme.palette.primary.main,
    },
  },
  icon: {
    color: theme.palette.secondary.main,
  },
  addButton: {
    marginTop: theme.spacing(2),
  },
}));

type TransactionFieldsProps = {
  func?: FunctionFragment;
  defaultParams?: any[];
} & Pick<AddTransactionBlockProps, "onAdd">;

const TransactionFields = ({
  func,
  onAdd,
  defaultParams,
}: TransactionFieldsProps) => {
  const classes = useStyles();

  if (!func) {
    return (
      <ActionButton
        fullWidth
        disabled
        className={classes.addButton}
        startIcon={
          <Icon className={classes.icon} type="add" size="md" color="primary" />
        }
      >
        Add this transaction
      </ActionButton>
    );
  }

  const handleAdd = (params: any[]) => {
    onAdd({
      id: `${func.name}_${new Date().getTime()}`,
      func,
      params,
    });
  };

  return (
    <ContractQueryForm func={func} defaultParams={defaultParams}>
      {({ paramInputProps, areParamsValid, getParams }) => (
        <>
          {paramInputProps.map((props, index) => (
            <Box marginTop={2} key={index}>
              <ParamInput {...props} />
            </Box>
          ))}
          <ActionButton
            fullWidth
            onClick={() => handleAdd(getParams())}
            disabled={!areParamsValid}
            className={classes.addButton}
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
          </ActionButton>
        </>
      )}
    </ContractQueryForm>
  );
};

const getSelectedFunction = (
  writeFunctions: FunctionFragment[],
  selectedFunc?: string
): number | undefined => {
  if (selectedFunc) {
    const index = writeFunctions.findIndex(
      (func) => func.format() === selectedFunc
    );
    if (index >= 0) return index;
  }
  return;
};

export const AddTransactionBlock = ({
  abi,
  onAdd,
}: AddTransactionBlockProps) => {
  const classes = useStyles();
  const dispatch = useRootDispatch();
  const writeFunctions = useMemo(() => getWriteFunction(abi), [abi]);
  const { func: selectedFunc, params: defaultParams } =
    useRootSelector(getAddTransaction);

  const [funcIndex, setFuncIndex] = useState(() =>
    getSelectedFunction(writeFunctions, selectedFunc)
  );

  useEffect(() => {
    if (selectedFunc)
      setFuncIndex(getSelectedFunction(writeFunctions, selectedFunc));
  }, [selectedFunc, writeFunctions]);

  const handleAdd = (transaction: ModuleTransaction) => {
    setFuncIndex(undefined);
    onAdd(transaction);
  };

  const handleFuncChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFuncIndex(parseInt(event.target.value));
    dispatch(resetAddTransaction());
  };

  const content = (
    <>
      <TextField
        select
        value={funcIndex}
        onChange={handleFuncChange}
        SelectProps={{ native: true }}
        className={classNames({ [classes.greyText]: funcIndex === undefined })}
        color="secondary"
        label="Function"
      >
        <option>Select function</option>
        {writeFunctions.map((func, index) => (
          <option key={func.format("full")} value={index}>
            {func.name}
          </option>
        ))}
      </TextField>
      <TransactionFields
        key={`${funcIndex}_${selectedFunc}`}
        defaultParams={defaultParams}
        func={funcIndex !== undefined ? writeFunctions[funcIndex] : undefined}
        onAdd={handleAdd}
      />
    </>
  );

  return (
    <Collapsable open content={content}>
      <Typography variant="h6">Add new transaction</Typography>
    </Collapsable>
  );
};
