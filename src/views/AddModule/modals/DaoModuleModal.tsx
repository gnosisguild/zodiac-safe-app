import React, { useEffect, useState } from "react";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { Grid, Link, makeStyles, Typography } from "@material-ui/core";
import { ethers } from "ethers";
import { isAddress, parseUnits } from "ethers/lib/utils";
import { AddModuleModal } from "./AddModuleModal";
import { ReactComponent as DaoModuleImage } from "../../../assets/images/dao-module.svg";
import { deployDAOModule } from "../../../services";
import { useRootSelector } from "../../../store";
import { AttachModuleForm } from "../AttachModuleForm";
import { getDelayModules } from "../../../store/modules/selectors";
import { TextField } from "../../../components/input/TextField";
import { Row } from "../../../components/layout/Row";
import { TimeSelect } from "../../../components/input/TimeSelect";
import { getArbitratorBondToken } from "../../../utils/reality-eth";
import { Grow } from "../../../components/layout/Grow";
import { ModuleType } from "../../../store/modules/models";

interface DaoModuleModalProps {
  open: boolean;

  onClose?(): void;

  onSubmit?(): void;
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

export const DaoModuleModal = ({
  open,
  onClose,
  onSubmit,
}: DaoModuleModalProps) => {
  const classes = useStyles();
  const { sdk, safe } = useSafeAppsSDK();

  const delayModules = useRootSelector(getDelayModules);
  const [hasError, setHasError] = useState(false);
  const [delayModule, setDelayModule] = useState<string>();
  const [bondToken, setBondToken] = useState("ETH");
  const [params, setParams] = useState<DaoModuleParams>({
    oracle: getDefaultOracle(safe.chainId),
    templateId: "",
    timeout: 86400,
    cooldown: 86400,
    expiration: 604800,
    bond: "0.1",
  });

  useEffect(() => {
    if (params.oracle && isAddress(params.oracle)) {
      getArbitratorBondToken(params.oracle, safe.chainId)
        .then((bondToken) => setBondToken(bondToken))
        .catch(() => setBondToken("ETH"));
    }
  }, [params.oracle, safe.chainId]);

  const onParamChange = <Field extends keyof DaoModuleParams>(
    field: Field,
    value: DaoModuleParams[Field]
  ) => {
    setParams({
      ...params,
      [field]: value,
    });
  };

  const handleAddDaoModule = async () => {
    try {
      const minimumBond = parseUnits(params.bond);
      const txs = deployDAOModule(safe.safeAddress, safe.chainId, {
        ...params,
        executor: delayModule || safe.safeAddress,
        bond: minimumBond.toString(),
      });

      await sdk.txs.send({ txs });
      if (onSubmit) onSubmit();
      if (onClose) onClose();
    } catch (error) {
      console.log("Error deploying module: ", error);
      setHasError(true);
    }
  };

  const handleBondChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Logic to ignore the TOKEN text at the end of the input
    const input = event.target.value;
    let bondText = input.replace(/[^(0-9|.)]/g, "");
    if (
      !input.includes(" " + bondToken) &&
      bondText.length === params.bond.length
    ) {
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
      tags={["Stackable", "From Gnosis"]}
      onAdd={handleAddDaoModule}
      readMoreLink="https://github.com/gnosis/dao-module"
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
          <Row style={{ alignItems: "center" }}>
            <Typography>TemplateId</Typography>
            <Grow />
            <Link
              color="secondary"
              href="https://reality.eth.link/app/template-generator/"
              target="_blank"
            >
              Get a template here
            </Link>
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
            label="Timeout"
            defaultValue={params.timeout}
            defaultUnit="hours"
            onChange={(value) => onParamChange("timeout", value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TimeSelect
            label="Cooldown"
            defaultValue={params.cooldown}
            defaultUnit="hours"
            onChange={(value) => onParamChange("cooldown", value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TimeSelect
            label="Expiration"
            defaultValue={params.expiration}
            defaultUnit="days"
            onChange={(value) => onParamChange("expiration", value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            color="secondary"
            value={params.bond + " " + bondToken}
            label="Bond"
            onChange={handleBondChange}
          />
        </Grid>
      </Grid>
      {delayModules.length ? (
        <>
          <Typography variant="h6" gutterBottom>
            Deploy Options
          </Typography>
          <AttachModuleForm
            description={description}
            modules={delayModules}
            value={delayModule}
            onChange={(value: string) => setDelayModule(value)}
            type={ModuleType.DELAY}
          />
        </>
      ) : null}
    </AddModuleModal>
  );
};
