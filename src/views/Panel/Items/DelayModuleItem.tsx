import { HashInfo } from "../../../components/ethereum/HashInfo";
import { makeStyles, Typography, Link } from "@material-ui/core";
import { shortAddress } from "../../../utils/string";
import { PanelItem, PanelItemProps } from "./PanelItem";
import React from "react";
import { Module } from "../../../store/modules/models";

interface DelayModuleItemProps extends PanelItemProps {
  module: Module;
}

const useStyles = makeStyles((theme) => ({
  text: {
    lineHeight: 1,
  },
  tag: {
    display: "inline-block",
    padding: theme.spacing(0.5),
    lineHeight: 1,
    borderRadius: 4,
    backgroundColor: theme.palette.primary.light,
  },
  link: {
    marginLeft: theme.spacing(1),
  },
}));

export const DelayModuleItem = ({
  module,
  active,
  ...panelItemProps
}: DelayModuleItemProps) => {
  const classes = useStyles();

  return (
    <PanelItem
      image={
        <HashInfo
          showAvatar
          avatarSize="lg"
          showHash={false}
          hash={module.address}
        />
      }
      active={active}
      {...panelItemProps}
    >
      <Typography variant="h6" className={classes.text} gutterBottom>
        {module.name}
      </Typography>
      <Typography variant="body2" className={classes.text} gutterBottom>
        {shortAddress(module.address)}
      </Typography>
      <div>
        <div className={classes.tag}>24 hours delay</div>
        {active ? (
          <Link color="secondary" noWrap className={classes.link}>
            Change Delay
          </Link>
        ) : null}
      </div>
    </PanelItem>
  );
};
