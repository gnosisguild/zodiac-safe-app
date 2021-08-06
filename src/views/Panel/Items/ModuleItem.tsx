import { HashInfo } from "../../../components/ethereum/HashInfo";
import { makeStyles, Typography } from "@material-ui/core";
import { shortAddress } from "../../../utils/string";
import { PanelItem, PanelItemProps } from "./PanelItem";
import React from "react";
import { Module } from "../../../store/modules/models";
import { DelayModuleItem } from "./DelayModuleItem";
import { isDelayModule } from "../../../store/modules/helpers";
import { ModuleList } from "../ModuleList";

interface ModuleItemProps extends PanelItemProps {
  module: Module;
}

const useStyles = makeStyles(() => ({
  text: {
    lineHeight: 1,
  },
}));

export const ModuleItem = ({ module, ...panelItemProps }: ModuleItemProps) => {
  const classes = useStyles();

  if (isDelayModule(module))
    return <DelayModuleItem module={module} {...panelItemProps} />;

  return (
    <>
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

      {module.subModules.length ? (
        <ModuleList sub modules={module.subModules} />
      ) : null}
    </>
  );
};
