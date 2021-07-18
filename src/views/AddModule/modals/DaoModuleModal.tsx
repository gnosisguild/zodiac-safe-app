import React, { useState } from "react";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { Box, Grid, Link, makeStyles, Typography } from "@material-ui/core";
import { ethers } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { AddModuleModal } from "./AddModuleModal";
import { ReactComponent as DaoModuleImage } from "../../../assets/images/dao-module.svg";
import { createAndAddModule } from "../../../services";
import { useRootSelector } from "../../../store";
import { AttachModuleForm } from "../AttachModuleForm";
import { getDelayModules } from "../../../store/modules/selectors";
import { TextField } from "../../../components/input/TextField";
import { Row } from "../../../components/layout/Row";
import { TimeSelect } from "../../../components/input/TimeSelect";
import { useFetchTransaction } from "hooks/useFetchTransaction";

interface DaoModuleModalProps {
  open: boolean;
  onClose?(): void;
}

interface DaoModuleParams {
  oracle: string;
  templateId: string;
  timeout: number;
  cooldown: number;
  expiration: number;
  bond: string;
}

const useStyles = makeStyles((theme) => ({
  fields: {
    marginBottom: theme.spacing(1),
  },
  loadMessage: {
    textAlign: "center",
  },
}));

function getDefaultOracle(chainId: number): string {
  switch (chainId) {
    case 1:
      return "0x325a2e0f3cca2ddbaebb4dfc38df8d19ca165b47";
    case 4:
      return "0x3D00D77ee771405628a4bA4913175EcC095538da";
  }
  return "";
}

export const DaoModuleModal = ({ open, onClose }: DaoModuleModalProps) => {
  const classes = useStyles();
  const { sdk, safe } = useSafeAppsSDK();
  const [hasError, setHasError] = useState(false);
  const [delayModule, setDelayModule] = useState<string>();
  const delayModules = useRootSelector(getDelayModules);
  const [params, setParams] = useState<DaoModuleParams>({
    oracle: getDefaultOracle(safe.chainId),
    templateId: "",
    timeout: 86400,
    cooldown: 86400,
    expiration: 604800,
    bond: "0.1",
  });

  const onParamChange = <Field extends keyof DaoModuleParams>(
    field: Field,
    value: DaoModuleParams[Field]
  ) => {
    setParams({
      ...params,
      [field]: value,
    });
  };

  const {
    setLoading,
    setSafeTxSuccessful,
    setSafeHash,
    loading,
    loadMessage,
    error,
  } = useFetchTransaction(onClose);

  const handleAddDaoModule = async () => {
    try {
      const minimumBond = parseUnits(params.bond);
      const txs = await createAndAddModule(
        "dao",
        {
          executor: safe.safeAddress,
          ...params,
          bond: minimumBond.toString(),
        },
        safe.safeAddress,
        delayModule
      );

      setLoading(true);
      const { safeTxHash } = await sdk.txs.send({
        txs,
      });

      setSafeTxSuccessful(false);
      setSafeHash(safeTxHash);
    } catch (error) {
      console.log("Error deploying module: ");
      console.log(error);
      setHasError(true);
    }
  };

  const handleBondChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Logic to ignore the "ETH" text at the end of the input
    const input = event.target.value;
    let bondText = input.replace(/[^(0-9|.)]/g, "");
    if (!input.includes(" ETH") && bondText.length === params.bond.length) {
      bondText = bondText.substr(0, bondText.length - 1);
    }

    if (
      bondText.endsWith(".") &&
      bondText.indexOf(".") === bondText.length - 1
    ) {
      onParamChange("bond", bondText);
      return;
    }

    try {
      bondText = bondText || "0";
      const eths = ethers.utils.parseEther(bondText);
      let formattedBond = ethers.utils.formatEther(eths);
      formattedBond = formattedBond.endsWith(".0")
        ? formattedBond.substr(0, formattedBond.length - 2)
        : formattedBond;
      onParamChange("bond", formattedBond);
    } catch (error) {
      console.warn("invalid bond", bondText, error);
    }
  };

  const description = (
    <Typography variant="body2">
      This will add a timedelay to any transactions created by this module.{" "}
      <b>Note that this delay is cumulative with the cooldown set above</b>{" "}
      (e.g. if both are set to 24 hours, the cumulative delay before the
      transaction can be executed will be 48 hours).
    </Typography>
  );

  return (
    <AddModuleModal
      open={open}
      onClose={onClose}
      title="DAO Module"
      description="Allows Reality.eth questions to execute a transaction when resolved."
      image={<DaoModuleImage />}
      tags={["Stackable", "Has SafeApp", "From Gnosis"]}
      onAdd={handleAddDaoModule}
      readMoreLink="https://help.gnosis-safe.io/en/articles/4934378-what-is-a-module"
      loading={loading}
    >
      <Typography variant="h6" gutterBottom>
        Parameters
      </Typography>

      <Grid container spacing={2} className={classes.fields}>
        <Grid item xs={12}>
          <TextField
            color="secondary"
            value={params.oracle}
            label="Oracle (oracle)"
            onChange={(event) => onParamChange("oracle", event.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Row alignItems="center">
            <Typography>TemplateId</Typography>
            <Box flexGrow={1} />
            {/*  TODO: Add Link */}
            <Link color="secondary">Get a template here</Link>
          </Row>
          <TextField
            color="secondary"
            placeholder="10929783"
            value={params.templateId}
            error={hasError}
            onChange={(event) =>
              onParamChange("templateId", event.target.value)
            }
          />
        </Grid>
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
        <Grid item xs={6}>
          <TimeSelect
            color="secondary"
            label="Expiration"
            defaultValue={params.expiration}
            defaultUnit="days"
            onChange={(value) => onParamChange("expiration", value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            color="secondary"
            value={params.bond + " ETH"}
            label="Bond"
            onChange={handleBondChange}
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
            description={description}
            modules={delayModules}
            value={delayModule}
            onChange={(value: string) => setDelayModule(value)}
            type="delay"
          />
        </>
      )}
    </AddModuleModal>
  );
};
