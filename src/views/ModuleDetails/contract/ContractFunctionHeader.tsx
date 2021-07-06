import React from "react";
import { Address } from "../../../components/ethereum/Address";
import { Typography } from "@material-ui/core";
import TimeAgo from "timeago-react";
import { Skeleton } from "@material-ui/lab";

interface ContractFunctionHeaderProps {
  date?: Date;
  loading?: boolean;
  address?: string;
}

export const ContractFunctionHeader = ({
  address,
  loading = false,
  date,
}: ContractFunctionHeaderProps) => {
  if (loading) {
    return <Skeleton variant="text" width={300} />;
  }
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
