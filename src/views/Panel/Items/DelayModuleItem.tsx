import { HashInfo } from "../../../components/ethereum/HashInfo";
import { Link, makeStyles, Typography } from "@material-ui/core";
import { PanelItem, PanelItemProps } from "./PanelItem";
import React from "react";
import { DelayModule } from "../../../store/modules/models";
import { Badge } from "../../../components/text/Badge";
import { Address } from "../../../components/ethereum/Address";
import { ModuleList } from "../ModuleList";
import { formatDuration } from "../../../utils/string";

interface DelayModuleItemProps extends PanelItemProps {
  module: DelayModule;
}

const useStyles = makeStyles((theme) => ({
  text: {
    lineHeight: 1,
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
        active={active}
        {...panelItemProps}
      >
        <Typography variant="h6" className={classes.text} gutterBottom>
          {module.name}
        </Typography>
        <Address
          short
          hideCopyBtn
          hideExplorerBtn
          address={module.address}
          variant="body2"
          className={classes.text}
          gutterBottom
        />
        <div>
          {/*TODO: Validate delay = timeout*/}
          <Badge>{formatDuration(module.timeout)} delay</Badge>
          {active ? (
            <Link color="secondary" noWrap className={classes.link}>
              Change Delay
            </Link>
          ) : null}
        </div>
      </PanelItem>

      {module.subModules.length ? (
        <ModuleList sub modules={module.subModules} />
      ) : null}
    </>
  );
};
