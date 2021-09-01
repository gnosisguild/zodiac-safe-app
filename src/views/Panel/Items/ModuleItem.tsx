import { HashInfo } from "../../../components/ethereum/HashInfo";
import { makeStyles, Typography } from "@material-ui/core";
import { PanelItem, PanelItemProps } from "./PanelItem";
import React from "react";
import { Module } from "../../../store/modules/models";
import { DelayModuleItem } from "./DelayModuleItem";
import { isDelayModule } from "../../../store/modules/helpers";
import { ModuleList } from "../ModuleList";
import { Address } from "../../../components/ethereum/Address";
import { ModulePendingRemoval } from "./ModulePendingRemovalItem";
import { Badge } from "../../../components/text/Badge";
import { shortAddress } from "../../../utils/string";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";

interface ModuleItemProps extends PanelItemProps {
  remove?: boolean;
  instant?: boolean;
  module: Module;
}

const useStyles = makeStyles((theme) => ({
  text: {
    lineHeight: 1,
    fontSize: "12px",
    textTransform: "uppercase",
    color: "rgb(93, 109, 116)",
    letterSpacing: "1px",
  },
  spacing: {
    marginTop: theme.spacing(1),
  },
}));

export const ModuleItem = ({
  module,
  remove = false,
  instant = false,
  ...panelItemProps
}: ModuleItemProps) => {
  const classes = useStyles();
  const { safe } = useSafeAppsSDK();

  if (remove) {
    return (
      <ModulePendingRemoval
        module={module}
        instant={instant}
        {...panelItemProps}
      />
    );
  }

  if (isDelayModule(module)) {
    return <DelayModuleItem module={module} {...panelItemProps} />;
  }

  const ownerBadge =
    module.owner && module.owner !== safe.safeAddress ? (
      <Badge secondary={shortAddress(module.owner)} className={classes.spacing}>
        External Owner
      </Badge>
    ) : null;

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
        {module.name ? (
          <Typography variant="h6" className={classes.text} gutterBottom>
            {module.name}
          </Typography>
        ) : null}
        <Address
          short
          showOnHover
          address={module.address}
          TypographyProps={{
            variant: "body2",
            className: classes.text,
          }}
        />
        {ownerBadge}
      </PanelItem>

      {module.subModules.length ? (
        <ModuleList sub modules={module.subModules} />
      ) : null}
    </>
  );
};
