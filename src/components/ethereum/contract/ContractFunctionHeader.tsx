import React from "react";
import { FunctionOutputs } from "../../../hooks/useContractQuery";
import { Address } from "../Address";
import { Typography } from "@material-ui/core";
import TimeAgo from "timeago-react";
import { isHashResult } from "../../../utils/contracts";

interface ContractFunctionHeaderProps {
  date?: Date;
  result?: FunctionOutputs;
}

export const ContractFunctionHeader = ({
  result,
  date,
}: ContractFunctionHeaderProps) => {
  if (isHashResult(result)) {
    return <Address address={result[0].toString()} />;
  }

  if (date) {
    return (
      <Typography variant="subtitle1">
        Queried <TimeAgo datetime={date} />
      </Typography>
    );
  }

  return <Typography variant="subtitle1">Query</Typography>;
};
