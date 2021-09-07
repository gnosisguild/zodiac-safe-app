import React from "react";
import { makeStyles, Typography, TypographyProps } from "@material-ui/core";
import { CopyToClipboardBtn } from "@gnosis.pm/safe-react-components";
import { AddressExplorerButton } from "./AddressExplorerButton";
import { shortAddress } from "../../utils/string";
import classNames from "classnames";

interface AddressProps {
  address: string;
  short?: boolean;
  hideCopyBtn?: boolean;
  hideExplorerBtn?: boolean;
  showOnHover?: boolean;
  gutterBottom?: boolean;
  classes?: {
    icon?: string;
    container?: string;
  };
  TypographyProps?: TypographyProps;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    gridGap: theme.spacing(0.5),
    justifyContent: "start",
    alignItems: "center",
    minWidth: 0,
    "& > *": {
      gridRow: 1,
    },
  },
  gutterBottom: {
    marginBottom: theme.spacing(1),
  },
  showOnHover: {
    "& .btn": {
      visibility: "hidden",
    },
    "&:hover .btn": {
      visibility: "initial",
    },
  },
}));

export const Address = ({
  address,
  short = false,
  hideCopyBtn = false,
  hideExplorerBtn = false,
  showOnHover = false,
  gutterBottom = false,
  classes: { icon, container } = {},
  TypographyProps,
}: AddressProps) => {
  const classes = useStyles();

  return (
    <div
      className={classNames(classes.root, container, {
        [classes.showOnHover]: showOnHover,
        [classes.gutterBottom]: gutterBottom,
      })}
    >
      <Typography noWrap {...TypographyProps}>
        {short ? shortAddress(address) : address}
      </Typography>
      {hideCopyBtn ? null : (
        <CopyToClipboardBtn
          textToCopy={address}
          className={classNames(icon, "btn")}
        />
      )}
      {hideExplorerBtn ? null : (
        <AddressExplorerButton
          address={address}
          className={classNames(icon, "btn")}
        />
      )}
    </div>
  );
};
