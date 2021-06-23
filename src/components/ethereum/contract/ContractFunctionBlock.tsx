import React, { useCallback, useEffect, useState } from "react";
import { FunctionFragment } from "@ethersproject/abi";
import { Box, Button, makeStyles, Paper, Typography } from "@material-ui/core";
import { Collapsable } from "../../Collapsable";
import { Address } from "../Address";
import { callContract } from "../../../services";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import TimeAgo from "timeago-react";
import classNames from "classnames";
import { Icon } from "@gnosis.pm/safe-react-components";
import { isHexString } from "@ethersproject/bytes";
import { TextField } from "../../input/TextField";
import { BigNumber } from "ethers";

interface ContractFunctionBlockProps {
  address: string;
  abi: string | string[];
  func: FunctionFragment;
}

type FunctionOutputs = (string | BigNumber)[];

const useStyles = makeStyles((theme) => ({
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  clickable: {
    cursor: "pointer",
  },
  grow: {
    flexGrow: 1,
  },
  resultContent: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.black,
    fontFamily: "Monaco",
    fontSize: 12,
    padding: theme.spacing(2),
  },
  resultHeader: {
    color: "rgba(0, 20, 40, 0.5)",
  },
  icon: {
    color: theme.palette.secondary.main,
  },
  expandIcon: {
    marginLeft: theme.spacing(2),
  },
  queryButton: {
    marginTop: theme.spacing(2),
  },
}));

const useContractLazyQuery = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FunctionOutputs>();
  const [error, setError] = useState<string | undefined>();

  const fetch = useCallback((...params: Parameters<typeof callContract>) => {
    setLoading(true);
    callContract(...params)
      .then((response) => {
        setResult(response);
        setError(undefined);
      })
      .catch((error) => {
        setError(error);
        setResult(undefined);
      })
      .finally(() => setLoading(false));
  }, []);

  return { loading, error, result, fetch };
};

const isBasicFunction = (func: FunctionFragment) => {
  return !func.inputs.length;
};

interface ContractFunctionResultProps {
  func: FunctionFragment;
  result?: FunctionOutputs;
}

export const ContractFunctionResult = ({
  func,
  result,
}: ContractFunctionResultProps) => {
  const classes = useStyles();
  if (!result) return null;
  return (
    <Paper className={classes.resultContent} elevation={0}>
      {func.outputs?.map((param, index) => (
        <div>
          <span className={classes.resultHeader}>{param.type}: </span>
          <span>{result[index].toString()}</span>
        </div>
      ))}
    </Paper>
  );
};

interface ContractFunctionInputProps {
  func: FunctionFragment;

  onChange(params: string[]): void;
}

export const ContractFunctionInput = ({
  func,
  onChange,
}: ContractFunctionInputProps) => {
  return (
    <>
      {func.inputs?.map((param, index) => {
        const label = param.name
          ? `${param.name} (${param.type})`
          : `(${param.type})`;
        return (
          <Box key={index} marginTop={2}>
            <TextField color="secondary" label={label} />
          </Box>
        );
      })}
    </>
  );
};

interface ContractFunctionHeaderProps {
  date?: Date;
  result?: FunctionOutputs;
}

const isHashResult = (result?: FunctionOutputs): result is FunctionOutputs => {
  return result?.length === 1 && isHexString(result[0]);
};

export const ContractFunctionHeader = ({
  result,
  date,
}: ContractFunctionHeaderProps) => {
  if (isHashResult(result)) {
    return <Address address={result[0].toString()} />;
  }

  if (date) {
    return (
      <Typography>
        Queried <TimeAgo datetime={new Date()} />
      </Typography>
    );
  }

  return <Typography>Query</Typography>;
};

export const ContractFunctionQueryBlock = ({
  address,
  abi,
  func,
}: ContractFunctionBlockProps) => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [data, setData] = useState<string[]>([]);
  const [lastQueryDate, setLastQueryDate] = useState<Date>();

  const { loading, result, fetch } = useContractLazyQuery();

  const execQuery = useCallback(() => {
    fetch(address, abi, func.name, data);
  }, [abi, address, data, fetch, func.name]);

  useEffect(() => {
    if (!loading && result) {
      setLastQueryDate(new Date());
    }
  }, [loading, result]);

  useEffect(() => {
    if (isBasicFunction(func)) {
      execQuery();
    }
  }, [execQuery, func]);

  const arrow = open ? (
    <ExpandLessIcon className={classes.expandIcon} />
  ) : (
    <ExpandMoreIcon className={classes.expandIcon} />
  );

  const content = (
    <>
      <ContractFunctionResult func={func} result={result} />
      <ContractFunctionInput func={func} onChange={setData} />
      <Button
        fullWidth
        variant="outlined"
        color="secondary"
        className={classes.queryButton}
        onClick={execQuery}
        startIcon={
          <Icon
            color="primary"
            size="md"
            type="sent"
            className={classes.icon}
          />
        }
      >
        RUN QUERY
      </Button>
    </>
  );

  const isHash = isHashResult(result);

  return (
    <Collapsable open={open && !isHash} content={content}>
      <Box
        className={classNames(classes.row, { [classes.clickable]: !isHash })}
        onClick={() => setOpen(!open)}
      >
        <Typography variant="h6">{func.name}</Typography>
        <div className={classes.grow} />
        <ContractFunctionHeader date={lastQueryDate} result={result} />
        {!isHash ? arrow : null}
      </Box>
    </Collapsable>
  );
};
