/* eslint-disable react-hooks/exhaustive-deps */
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import {
  Button,
  Divider,
  FormHelperText,
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
import { SafeInfo } from "store/modules/models";
import { SectionProps } from "views/RealityModule/RealityModule";
import { colors, ZodiacPaper, ZodiacTextField } from "zodiac-ui-components";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
  },
  paperContainer: {
    padding: theme.spacing(2),
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
  const { owners } = safe as unknown as SafeInfo;
  const provider = getProvider(safe.chainId);
  const classes = useStyles();
  // const [proposalType, setProposalType] = useState<"snapshot" | "custom">(
  //   "snapshot"
  // );
  const [ensName, setEnsName] = useState<string>("");
  const [ensAddress, setEnsAddress] = useState<string>("");
  const [invalidEns, setInvalidEns] = useState<boolean>(false);

  useEffect(() => {
    if (provider && setupData && setupData.proposal) {
      setEnsName(setupData.proposal.ensName);
      validEns();
    }
  }, []);

  useEffect(() => {
    if (provider && ensName) {
      validEns();
    }
  }, [provider, ensName]);

  const validEns = async () => {
    const address = await provider.resolveName(ensName);
    if (address) {
      setEnsAddress(address);
      setInvalidEns(false);
      return;
    } else {
      setEnsAddress("");
      setInvalidEns(true);
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

  return (
    <ZodiacPaper borderStyle='single' className={classes.paperContainer}>
      <Grid container spacing={4} className={classes.container}>
        <Grid item>
          <Grid container spacing={2} className={classes.container}>
            <Grid item>
              <Typography variant='h3'>Configure Proposal Space</Typography>
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
                  underline='always'
                  href='https://snapshot.com'
                  target={"_blank"}
                  color='inherit'>
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
              <Typography variant='h4' color='textSecondary'>
                Proposal Configuration
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant='body2' className={classes.textSubdued}>
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
                onChange={({ target }) => setEnsName(target.value)} // TODO: validation
                label='Enter your snapshot ENS domain.'
                placeholder='ex: gnosis.eth'
                borderStyle='double'
                className={`${classes.textFieldSmall} ${classes.input}`}
              />
              {invalidEns && (
                <FormHelperText>Please enter a valid ENS domain</FormHelperText>
              )}
            </Grid>
            <Grid item>
              {ensAddress && owners.length && !owners.includes(ensAddress) && (
                <DangerAlert address={ensAddress} />
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
            justifyContent='center'
            alignItems='center'>
            <Grid item>
              <Button size='medium' variant='text' onClick={handleBack}>
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                color='secondary'
                size='medium'
                variant='contained'
                disabled={!ensAddress || invalidEns}
                onClick={() => handleNext(collectSectionData())}>
                Next
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ZodiacPaper>
  );
};
