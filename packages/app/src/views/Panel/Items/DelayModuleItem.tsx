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

interface DelayModuleItemProps extends PanelItemProps {
  module: DelayModule;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    gridGap: theme.spacing(0.25),
    "& > *": {
      gridColumn: 1,
    },
  },
  text: {
    lineHeight: 1,
    letterSpacing: 1,
  },
  moduleName: {
    textTransform: "uppercase",
  },
  address: {
    fontFamily: "Roboto Mono",
  },
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
      <Typography variant="body2" className={classes.moduleName}>
        {module.name}
      </Typography>
      <Address
        short
        showOnHover
        address={module.address}
        TypographyProps={{
          variant: "body2",
          className: classes.address,
        }}
      />
      <Row style={{ alignItems: "center" }}>
        <Badge>{formatDuration(module.cooldown)} delay</Badge>
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
