import {
  Button,
  Divider,
  FormControlLabel,
  Grid,
  makeStyles,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import { DangerAlert } from "components/Alert/DangerAlert";
import { Link } from "components/text/Link";

import React, { useState } from "react";
import { SectionProps } from "views/RealityModule/RealityModule";
import { colors, ZodiacPaper, ZodiacTextField } from "zodiac-ui-components";

interface ProposalSectionProps extends SectionProps {}

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

export const ProposalSection: React.FC<ProposalSectionProps> = ({
  handleNext,
  handleBack,
}) => {
  const classes = useStyles();
  const [proposalType, setProposalType] = useState<"snapshot" | "custom">(
    "snapshot"
  );
  const [ensDomain, setEnsDomain] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProposalType(
      (event.target as HTMLInputElement).value as "snapshot" | "custom"
    );
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
                Enter your snapshot space ENS domain below to get started. If
                you&apos;d prefer to provide a custom proposal integration,
                select Custom and provide the appropriate URL where the
                proposals can be viewed publicly.
              </Typography>
            </Grid>
            <Grid item>
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
            </Grid>
            <Grid item>
              <ZodiacTextField
                value={ensDomain}
                onChange={({ target }) => setEnsDomain(target.value)} // TODO: validation
                label="Enter your snapshot ENS domain."
                placeholder="ex: gnosis.eth"
                borderStyle="double"
                className={`${classes.textFieldSmall} ${classes.input}`}
              />
            </Grid>
            <Grid item>
              <DangerAlert address="0x4589fCbf4ec91a6EE0f760287cbFEBBEd5431D0a" />
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
                onClick={() => handleNext({ ensDomain, proposalType })}
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
