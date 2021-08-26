import React, { useState } from "react";
import { Row } from "../../components/layout/Row";
import { Checkbox } from "../../components/input/Checkbox";
import { makeStyles, Radio, Typography } from "@material-ui/core";
import { Badge } from "../../components/text/Badge";
import { Address } from "../../components/ethereum/Address";
import classNames from "classnames";
import { DelayModule } from "../../store/modules/models";
import { formatDuration } from "../../utils/string";

interface AttachDaoModuleFormProps {
  modules: DelayModule[];
  value?: string;
  description?: React.ReactNode;

  onChange(address?: string): void;
}

const defaultDescription = (
  <Typography variant="body2">
    This will add a timedelay to any transactions created by this module.
  </Typography>
);

const useStyles = makeStyles((theme) => ({
  container: {
    marginLeft: theme.spacing(1.5),
  },
  item: {
    marginTop: theme.spacing(2),
  },
  text: {
    fontSize: 12,
  },
  delayText: {
    marginBottom: theme.spacing(0.5),
  },
}));

export const AttachDaoModuleForm = ({
  modules,
  value,
  description = defaultDescription,
  onChange,
}: AttachDaoModuleFormProps) => {
  const classes = useStyles();
  const [checked, setChecked] = useState(false);

  const handleCheck = () => {
    if (checked) onChange(undefined);
    setChecked(!checked);
  };

  return (
    <Row alignItems="flex-start">
      <Checkbox checked={checked} onChange={handleCheck} />
      <div className={classes.container}>
        <Typography gutterBottom>Attach to Delay Module</Typography>
        {description}

        {checked
          ? modules.map((module) => (
              <Row key={module.address} className={classes.item}>
                <Radio
                  checked={value === module.address}
                  onClick={() => onChange(module.address)}
                />
                <div>
                  <Badge
                    className={classNames(classes.text, classes.delayText)}
                  >
                    {formatDuration(module.expiration)} delay
                  </Badge>
                  <Address
                    short
                    hideCopyBtn
                    hideExplorerBtn
                    address={module.address}
                    TypographyProps={{ className: classes.text }}
                  />
                </div>
              </Row>
            ))
          : null}
      </div>
    </Row>
  );
};
