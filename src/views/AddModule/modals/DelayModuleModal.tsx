import { AddModuleModal } from "./AddModuleModal";
import { ReactComponent as DelayModuleImage } from "../../../assets/images/delay-module.svg";
import React, { useState } from "react";
import { Typography } from "@material-ui/core";
import { Row } from "../../../components/layout/Row";
import { Checkbox } from "../../../components/input/Checkbox";

interface DaoModuleModalProps {
  open: boolean;

  onClose?(): void;
}

export const DelayModuleModal = ({ open, onClose }: DaoModuleModalProps) => {
  // TODO: List modules
  const [checked, setChecked] = useState(false);

  const content = (
    <>
      <Typography variant="h6" gutterBottom>
        Deploy Options
      </Typography>
      <Typography gutterBottom>Attach existing modules</Typography>
      <Typography variant="body2" gutterBottom>
        This will add a delay to the selected modules.
      </Typography>

      <Row alignItems="center">
        <Checkbox
          name="checkedB"
          checked={checked}
          onChange={() => setChecked(!checked)}
        />
        <Typography>DAO Module</Typography>
      </Row>
    </>
  );

  return (
    <AddModuleModal
      open={open}
      onClose={onClose}
      content={content}
      title="Transaction Delay"
      description="Adds a settable delay time to any transaction originating from this module."
      image={<DelayModuleImage />}
      tags={["Stackable", "Has SafeApp", "From Gnosis"]}
      onAdd={() => {}}
      readMoreLink="https://help.gnosis-safe.io/en/articles/4934378-what-is-a-module"
    />
  );
};
