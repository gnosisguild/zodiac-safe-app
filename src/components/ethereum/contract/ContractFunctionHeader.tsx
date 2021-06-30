import React from "react";
import { Address } from "../Address";
import { Typography } from "@material-ui/core";
import TimeAgo from "timeago-react";

interface ContractFunctionHeaderProps {
  date?: Date;
  address?: string;
}

export const ContractFunctionHeader = ({
  address,
  date,
}: ContractFunctionHeaderProps) => {
  if (address) {
    return <Address address={address} />;
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
