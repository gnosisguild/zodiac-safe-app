import React from "react";
import { Link, makeStyles, Typography } from "@material-ui/core";
import { PanelItemProps } from "./PanelItem";
import { DelayModule } from "../../../store/modules/models";
import { Badge } from "../../../components/text/Badge";
import { Address } from "../../../components/ethereum/Address";
import { formatDuration } from "../../../utils/string";
import { useRootDispatch } from "../../../store";
import { setNewTransaction } from "../../../store/transactionBuilder";
import { setCurrentModule, setOperation } from "../../../store/modules";
import { Row } from "../../../components/layout/Row";
import classNames from "classnames";

interface DelayModuleItemProps extends PanelItemProps {
  module: DelayModule;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    gridGap: theme.spacing(0.5),
    "& > *": {
      gridColumn: 1,
    },
  },
  text: {
    fontSize: 12,
    lineHeight: 1,
    letterSpacing: 1,
  },
  moduleName: {},
  link: {
    marginLeft: theme.spacing(1),
    lineHeight: 1,
    cursor: "pointer",
  },
}));

export const DelayModuleItem = ({ module }: DelayModuleItemProps) => {
  const classes = useStyles();
  const dispatch = useRootDispatch();

  const handleClick = (evt: React.MouseEvent) => {
    evt.stopPropagation(); // Avoid triggering ModuleItem click event.

    dispatch(setCurrentModule(module));
    dispatch(setOperation("write"));
    dispatch(
      setNewTransaction({
        func: "setTxCooldown(uint256)",
        params: [module.cooldown],
      })
    );
  };

  return (
    <div className={classes.root}>
      <Typography
        variant="h6"
        className={classNames(classes.text, classes.moduleName)}
      >
        {module.name}
      </Typography>
      <Address
        short
        showOnHover
        address={module.address}
        TypographyProps={{
          variant: "body2",
          className: classes.text,
        }}
      />
      <Row style={{ alignItems: "center" }}>
        <Badge>{formatDuration(module.expiration)} delay</Badge>
        <Link
          color="textPrimary"
          noWrap
          className={classes.link}
          onClick={handleClick}
        >
          Change Delay
        </Link>
      </Row>
    </div>
  );
};
