import React from "react";
import {
  makeStyles,
  Theme,
  Typography,
  TypographyProps,
} from "@material-ui/core";
import { CopyToClipboardBtn } from "@gnosis.pm/safe-react-components";
import { AddressExplorerButton } from "./AddressExplorerButton";
import { shortAddress } from "../../utils/string";
import classNames from "classnames";
import { Row } from "../layout/Row";

interface AddressProps extends TypographyProps {
  address: string;
  spacing?: number;
  iconSpacing?: number;
  short?: boolean;
  hideCopyBtn?: boolean;
  hideExplorerBtn?: boolean;
  showOnHover?: boolean;
}

const useStyles = makeStyles<Theme, { spacing: number; iconSpacing: number }>(
  (theme) => ({
    root: {
      alignItems: "center",
    },
    text: (props) => ({
      marginLeft: theme.spacing(props.spacing),
    }),
    icon: (props) => ({
      marginLeft: theme.spacing(props.iconSpacing),
    }),
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
  })
);

export const Address = ({
  address,
  spacing = 2,
  iconSpacing = 2,
  short = false,
  hideCopyBtn = false,
  hideExplorerBtn = false,
  showOnHover = false,
  gutterBottom,
  ...typographyProps
}: AddressProps) => {
  const classes = useStyles({ spacing, iconSpacing });

  return (
    <Row
      className={classNames(classes.root, {
        [classes.showOnHover]: showOnHover,
        [classes.gutterBottom]: gutterBottom,
      })}
    >
      <Typography noWrap className={classes.text} {...typographyProps}>
        {short ? shortAddress(address) : address}
      </Typography>
      {hideCopyBtn ? null : (
        <CopyToClipboardBtn
          textToCopy={address}
          className={classNames(classes.icon, "btn")}
        />
      )}
      {hideExplorerBtn ? null : (
        <AddressExplorerButton
          address={address}
          className={classNames(classes.icon, "btn")}
        />
      )}
    </Row>
  );
};
