import React, { useState } from "react";
import { Box, Grid, makeStyles, Typography } from "@material-ui/core";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { AddModuleModal } from "./AddModuleModal";
import { ReactComponent as DelayModuleImage } from "../../../assets/images/delay-module.svg";
import { Row } from "../../../components/layout/Row";
import { Checkbox } from "../../../components/input/Checkbox";
import { TimeSelect } from "../../../components/input/TimeSelect";
import { createAndAddModule } from "services";
import { useRootDispatch } from "store";
import { fetchModulesList } from "store/modules";

interface DaoModuleModalProps {
  open: boolean;
  onClose?(): void;
}

interface DelayModuleParams {
  timeout: number;
  cooldown: number;
}

const useStyles = makeStyles((theme) => ({
  fields: {
    marginBottom: theme.spacing(1),
  },
}));

export const DelayModuleModal = ({ open, onClose }: DaoModuleModalProps) => {
  const classes = useStyles();
  const [checked, setChecked] = useState(false);
  const { sdk, safe } = useSafeAppsSDK();
  const dispatch = useRootDispatch();

  const [params, setParams] = useState<DelayModuleParams>({
    timeout: 86400,
    cooldown: 86400,
  });

  const onParamChange = <Field extends keyof DelayModuleParams>(
    field: Field,
    value: DelayModuleParams[Field]
  ) => {
    setParams({
      ...params,
      [field]: value,
    });
  };

  const handleAddDelayModule = async () => {
    try {
      const txs = await createAndAddModule(
        "delay",
        {
          executor: safe.safeAddress,
          txCooldown: params.cooldown,
          txExpiration: params.timeout,
        },
        safe.safeAddress
      );
      console.log({ txs });
      const { safeTxHash } = await sdk.txs.send({
        txs,
      });
      console.log({ safeTxHash });
      const safeTx = await sdk.txs.getBySafeTxHash(safeTxHash);
      console.log({ safeTx });

      dispatch(
        fetchModulesList({
          safeSDK: sdk,
          chainId: safe.chainId,
          safeAddress: safe.safeAddress,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AddModuleModal
      open={open}
      onClose={onClose}
      title="Transaction Delay"
      description="Adds a settable delay time to any transaction originating from this module."
      image={<DelayModuleImage />}
      tags={["Stackable", "Has SafeApp", "From Gnosis"]}
      onAdd={handleAddDelayModule}
      readMoreLink="https://help.gnosis-safe.io/en/articles/4934378-what-is-a-module"
    >
      <Typography variant="h6" gutterBottom>
        Parameters
      </Typography>

      <Grid container spacing={2} className={classes.fields}>
        <Grid item xs={6}>
          <TimeSelect
            color="secondary"
            label="Timeout"
            defaultValue={params.timeout}
            defaultUnit="hours"
            onChange={(value) => onParamChange("timeout", value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TimeSelect
            color="secondary"
            label="Cooldown"
            defaultValue={params.cooldown}
            defaultUnit="hours"
            onChange={(value) => onParamChange("cooldown", value)}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom>
        Deploy Options
      </Typography>
      <Typography gutterBottom>Attach existing modules</Typography>
      <Typography variant="body2" gutterBottom>
        This will add a delay to the selected modules.
      </Typography>

      <Row alignItems="center">
        <Checkbox checked={checked} onChange={() => setChecked(!checked)} />
        <Box marginLeft={1.5}>
          <Typography>DAO Module</Typography>
        </Box>
      </Row>
    </AddModuleModal>
  );
};
