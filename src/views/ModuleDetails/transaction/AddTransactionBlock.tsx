import React, { useEffect, useMemo, useState } from "react";
import { FunctionFragment } from "@ethersproject/abi";
import { Box, makeStyles, MenuItem, Typography } from "@material-ui/core";
import { Collapsable } from "../../../components/Collapsable";
import { ContractQueryForm } from "../../../components/ethereum/ContractQueryForm";
import { TextField } from "../../../components/input/TextField";
import { getWriteFunction } from "../../../utils/contracts";
import classNames from "classnames";
import { Transaction } from "../../../store/transactionBuilder/models";
import { ActionButton } from "../../../components/ActionButton";
import { useRootDispatch, useRootSelector } from "../../../store";
import { getAddTransaction } from "../../../store/transactionBuilder/selectors";
import { resetNewTransaction } from "../../../store/transactionBuilder";
import { getCurrentModule } from "../../../store/modules/selectors";
import { ABI } from "../../../store/modules/models";
import { TransactionField } from "./TransactionField";
import { ReactComponent as AddIcon } from "../../../assets/icons/add-icon.svg";

interface AddTransactionBlockProps {
  abi: ABI;

  onAdd(transaction: Transaction): void;
}

const useStyles = makeStyles((theme) => ({
  greyText: {
    "& select": {
      color: theme.palette.primary.main,
    },
  },
  icon: {
    color: theme.palette.common.white,
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
  const module = useRootSelector(getCurrentModule);

  if (!func) {
    return (
      <ActionButton
        fullWidth
        disabled
        className={classes.addButton}
        startIcon={<AddIcon className={classes.icon} />}
      >
        Add this transaction
      </ActionButton>
    );
  }

  const handleAdd = (params: any[]) => {
    if (!module) return;
    onAdd({
      func,
      params,
      module,
      to: module.address,
      id: `${func.name}_${new Date().getTime()}`,
    });
  };

  return (
    <ContractQueryForm func={func} defaultParams={defaultParams}>
      {({ paramInputProps, areParamsValid, getParams }) => (
        <>
          {paramInputProps.map((props, index) => (
            <Box marginTop={2} key={index}>
              <TransactionField func={func} param={props} />
            </Box>
          ))}
          <ActionButton
            fullWidth
            onClick={() => handleAdd(getParams())}
            disabled={!areParamsValid}
            className={classes.addButton}
            startIcon={<AddIcon className={classes.icon} />}
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
): number => {
  if (selectedFunc) {
    const index = writeFunctions.findIndex(
      (func) => func.format() === selectedFunc
    );
    if (index >= 0) return index;
  }
  return -1;
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

  const handleAdd = (transaction: Transaction) => {
    setFuncIndex(-1);
    onAdd(transaction);
  };

  const handleFuncChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFuncIndex(parseInt(event.target.value));
    dispatch(resetNewTransaction());
  };

  const content = (
    <>
      <TextField
        select
        value={funcIndex}
        onChange={handleFuncChange}
        className={classNames({ [classes.greyText]: funcIndex === undefined })}
        color="secondary"
        label="Function"
      >
        <MenuItem value={-1}>Select function</MenuItem>
        {writeFunctions.map((func, index) => (
          <MenuItem key={func.format("full")} value={index}>
            {func.name}
          </MenuItem>
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
