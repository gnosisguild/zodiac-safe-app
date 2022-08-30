/* eslint-disable react-hooks/exhaustive-deps */
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import {
  Button,
  Divider,
  Grid,
  makeStyles,
  // FormControlLabel,
  // Radio,
  // RadioGroup,
  Typography,
} from "@material-ui/core";
import { DangerAlert } from "components/Alert/DangerAlert";
import { Link } from "components/text/Link";
import React, { useEffect, useState } from "react";
import { getProvider } from "services";
import { checkIfIsController, checkIfIsOwner } from "utils/ens";
import { SectionProps } from "views/RealityModule/RealityModule";
import { colors, ZodiacPaper, ZodiacTextField } from "zodiac-ui-components";
import { ProposalStatus } from "./components/proposalStatus/ProposalStatus";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
  },
  paperContainer: {
    padding: theme.spacing(2),
  },
  loading: {
    width: "15px !important",
    height: "15px !important",
    marginRight: 8,
  },
  radio: {
    marginLeft: -2,
    padding: 2,
    "& ~ .MuiFormControlLabel-label": {
      fontSize: 12,
      marginLeft: 4,
    },
    "&$checked": {
      color: colors.tan[1000],
    },
  },
  checked: {},
  textSubdued: {
    color: "rgba(255 255 255 / 70%)",
  },
  textFieldSmall: {
    "& .MuiFormLabel-root": {
      fontSize: 12,
    },
  },
  input: {
    "& .MuiInputBase-root": {
      borderColor: colors.tan[300],
      "&::before": {
        borderColor: colors.tan[300],
      },
    },
  },
  errorContainer: { margin: 8, display: "flex", alignItems: "center" },
}));

export type ProposalSectionData = {
  // proposalType: "snapshot" | "custom";
  ensName: string;
};

export const ProposalSection: React.FC<SectionProps> = ({
  handleNext,
  handleBack,
  setupData,
}) => {
  const { safe } = useSafeAppsSDK();
  const provider = getProvider(safe.chainId);
  const classes = useStyles();
  // const [proposalType, setProposalType] = useState<"snapshot" | "custom">(
  //   "snapshot"
  // );
  const [ensName, setEnsName] = useState<string>("");
  const [ensAddress, setEnsAddress] = useState<string>("");
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isController, setIsController] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [ensIsValid, setEnsIsValid] = useState<boolean>(false);

  useEffect(() => {
    if (provider && setupData && setupData.proposal) {
      setEnsName(setupData.proposal.ensName);
    }
  }, []);

  useEffect(() => {
    if (ensName) {
      if (ensName.includes(".eth")) {
        setEnsIsValid(true);
        setLoading(true);
        const validateInfo = async () => {
          await validEns();
        };
        validateInfo();
      } else {
        setEnsIsValid(false);
        setIsController(false);
        setIsOwner(false);
      }
    }
  }, [ensName]);

  const validEns = async () => {
    const address = await provider.resolveName(ensName);
    if (address) {
      const isOwner = await checkIfIsOwner(provider, ensName, safe.safeAddress);
      const isController = await checkIfIsController(
        provider,
        ensName,
        safe.safeAddress
      );
      setIsOwner(isOwner);
      setIsController(isController);
      setEnsAddress(address);
      setLoading(false);
      return;
    } else {
      setEnsAddress("");
      setLoading(false);
      setIsOwner(false);
      setIsController(false);
      return;
    }
  };

  const collectSectionData = (): ProposalSectionData => ({
    // proposalType,
    ensName,
  });

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setProposalType(
  //     (event.target as HTMLInputElement).value as "snapshot" | "custom"
  //   );
  // };

  const handleStatus = (
    type: "controller" | "owner"
  ): "loading" | "success" | "error" => {
    if (loading) {
      return "loading";
    }
    if (type === "controller" && isController) {
      return "success";
    }
    if (type === "controller" && !isController) {
      return "error";
    }
    if (type === "owner" && isOwner) {
      return "success";
    }
    if (type === "owner" && !isOwner) {
      return "error";
    }
    return "loading";
  };

  const handleStatusMessage = (type: "controller" | "owner"): string => {
    if (type === "controller") {
      if (loading) {
        return "Confirming the safe is the controller of the ENS name. Please wait...";
      }
      if (isController) {
        return "The safe is the controller of the ENS name.";
      }
      if (!isController) {
        return "The safe must be the controller of the ENS name.";
      }
    }
    if (type === "owner") {
      if (loading) {
        return "Confirming that the safe is the owner of the ENS name. Please wait...";
      }
      if (isOwner) {
        return "The safe is the owner of the ENS name.";
      }
      if (!isOwner) {
        return "The safe is not the owner of the ENS name. Please transfer the ENS name to this safe or enter a different ENS name before continuing.";
      }
    }

    return "";
  };

  const handleEns = (ens: string) => {
    if (ens === "") {
      setIsController(false);
      setIsOwner(false);
      setEnsName("");
    } else {
      setEnsName(ens);
    }
  };

  return (
    <ZodiacPaper borderStyle="single" className={classes.paperContainer}>
      <Grid container spacing={4} className={classes.container}>
        <Grid item>
          <Grid container spacing={2} className={classes.container}>
            <Grid item>
              <Typography variant="h3">Configure Proposal Space</Typography>
            </Grid>
            <Grid item>
              <Typography>
                Add your preferred proposal type below to get started. If
                you&apos;re unsure, we recommend starting with Snapshot.
              </Typography>
            </Grid>
            <Grid item>
              <Typography>
                Don&apos;t have a snapshot space setup yet?{` `}
                <Link
                  underline="always"
                  href="https://snapshot.com"
                  target={"_blank"}
                  color="inherit"
                >
                  Get started here.
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Divider />
        </Grid>
        <Grid item>
          <Grid container spacing={2} className={classes.container}>
            <Grid item>
              <Typography variant="h4" color="textSecondary">
                Proposal Configuration
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2" className={classes.textSubdued}>
                {/* Enter your snapshot space ENS domain below to get started. If
                you&apos;d prefer to provide a custom proposal integration,
                select Custom and provide the appropriate URL where the
                proposals can be viewed publicly. */}
                Enter your snapshot space ENS domain below to get started. The
                Safe must be the controller of this ENS domain.
              </Typography>
            </Grid>
            {/* For now we're only use snapshot space */}
            {/* <Grid item>
              <Typography variant="body2">
                Select your proposal type:
              </Typography>
              <RadioGroup
                aria-label="proposal type"
                name="proposalType"
                value={proposalType}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="snapshot"
                  control={
                    <Radio
                      classes={{
                        root: classes.radio,
                        checked: classes.checked,
                      }}
                    />
                  }
                  label="Snapshot"
                />
                <FormControlLabel
                  disabled={true}
                  value="custom"
                  control={
                    <Radio
                      classes={{
                        root: classes.radio,
                        checked: classes.checked,
                      }}
                    />
                  }
                  label="Custom"
                />
              </RadioGroup>
            </Grid> */}
            <Grid item>
              <ZodiacTextField
                value={ensName}
                onChange={({ target }) => handleEns(target.value)}
                label="Enter the Snapshot ENS name."
                placeholder="ex: gnosis.eth"
                borderStyle="double"
                className={`${classes.textFieldSmall} ${classes.input}`}
              />
              <br />
              <br />

              {ensIsValid && (
                <>
                  <ProposalStatus
                    status={handleStatus("controller")}
                    message={handleStatusMessage("controller")}
                  />
                  <ProposalStatus
                    status={handleStatus("owner")}
                    message={handleStatusMessage("owner")}
                  />
                  {ensAddress && !isOwner && handleStatus("owner") === "error" && (
                    <Grid item>
                      <DangerAlert
                        msg={
                          "The connected safe does not own the ENS name that you've entered. The owner of the ENS name has unilateral control of the ENS name (for instance, the owner can change the controller and the ENS records at any time)."
                        }
                        address={ensAddress}
                      />
                    </Grid>
                  )}
                </>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item style={{ paddingBottom: 0 }}>
          <Divider />
        </Grid>
        <Grid item>
          <Grid
            container
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item>
              <Button size="medium" variant="text" onClick={handleBack}>
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                color="secondary"
                size="medium"
                variant="contained"
                disabled={!isController}
                onClick={() => handleNext(collectSectionData())}
              >
                Next
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ZodiacPaper>
  );
};
