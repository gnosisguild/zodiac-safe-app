import { HashInfo } from "../../../components/ethereum/HashInfo";
import { makeStyles, Typography } from "@material-ui/core";
import { shortAddress } from "../../../utils/string";
import { PanelItem, PanelItemProps } from "./PanelItem";
import React from "react";
import { Module, ModuleType } from "../../../store/modules/models";
import { DelayModuleItem } from "./DelayModuleItem";

interface ModuleItemProps extends PanelItemProps {
  module: Module;
}

const useStyles = makeStyles((theme) => ({
  text: {
    lineHeight: 1,
  },
}));

export const ModuleItem = ({ module, ...panelItemProps }: ModuleItemProps) => {
  const classes = useStyles();

  if (module.type === ModuleType.DELAY)
    return <DelayModuleItem module={module} {...panelItemProps} />;

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
      {...panelItemProps}
    >
      <Typography variant="h6" className={classes.text} gutterBottom>
        {module.name}
      </Typography>
      <Typography variant="body2" className={classes.text}>
        {shortAddress(module.address)}
      </Typography>
    </PanelItem>
  );
};
