import React, { useState } from "react";
import { Grid, makeStyles, Typography } from "@material-ui/core";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { AddModuleModal } from "./AddModuleModal";
import { ReactComponent as DelayModuleImage } from "../../../assets/images/delay-module.svg";
import { TimeSelect } from "../../../components/input/TimeSelect";
import { createAndAddModule } from "services";
import { useRootSelector } from "store";
import { getDaoModules } from "store/modules/selectors";
import { AttachModuleForm } from "../AttachModuleForm";
import { useFetchTransaction } from "hooks/useFetchTransaction";

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
  loadMessage: {
    textAlign: "center",
  },
}));

export const DelayModuleModal = ({ open, onClose }: DaoModuleModalProps) => {
  const classes = useStyles();
  const [daoModule, setDaoModule] = useState<string>();
  const daoModules = useRootSelector(getDaoModules);

  const { sdk, safe } = useSafeAppsSDK();

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

  const { setLoading, setSafeTxSuccessful, setSafeHash, loading, loadMessage } =
    useFetchTransaction(onClose);

  const handleAddDelayModule = async () => {
    try {
      const txs = await createAndAddModule(
        "delay",
        {
          executor: safe.safeAddress,
          txCooldown: params.cooldown,
          txExpiration: params.timeout,
        },
        safe.safeAddress,
        daoModule
      );
      setLoading(true);
      const { safeTxHash } = await sdk.txs.send({
        txs,
      });

      setSafeTxSuccessful(false);
      setSafeHash(safeTxHash);
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
      loading={loading}
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

      {loading ? (
        <Typography variant="h5" className={classes.loadMessage}>
          {loadMessage}
        </Typography>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            Deploy Options
          </Typography>
          <AttachModuleForm
            modules={daoModules}
            value={daoModule}
            onChange={(value: string) => setDaoModule(value)}
            type="dao"
          />
        </>
      )}
    </AddModuleModal>
  );
};
