import { Button, Divider, FormControlLabel, Grid, makeStyles, Radio, RadioGroup, Typography } from "@material-ui/core";
import { DangerAlert } from "components/Alert/DangerAlert";
import React, { useState } from "react";
import { useRootDispatch } from "store";
import { setRealityModuleScreen } from "store/modules";
import { colors, ZodiacPaper, ZodiacTextField } from "zodiac-ui-components";

interface ProposalSectionProps {
  handleNext: () => void;
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
  },
  paperContainer: {
    padding: theme.spacing(2),
  },

  radio: {
    "&$checked": {
      color: colors.tan[1000],
    },
  },
  checked: {},
}));

export const ProposalSection: React.FC<ProposalSectionProps> = ({ handleNext }) => {
  const classes = useStyles();
  const [value, setValue] = useState<"snapshot" | "custom">("snapshot");
  const dispatch = useRootDispatch();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value as "snapshot" | "custom");
  };

  return (
    <ZodiacPaper borderStyle='single' className={classes.paperContainer}>
      <Grid container spacing={4} className={classes.container}>
        <Grid item>
          <Grid container spacing={2} className={classes.container}>
            <Grid item>
              <Typography variant='h4'>Configure Proposal Space</Typography>
            </Grid>
            <Grid item>
              <Typography>
                Add your preferred proposal type below to get started. If you’re unsure, we recommend starting with
                Snapshot.
              </Typography>
            </Grid>
            <Grid item>
              <Typography>Don’t have a snapshot space setup yet? Get started here.</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Divider />
        </Grid>
        <Grid item>
          <Grid container spacing={2} className={classes.container}>
            <Grid item>
              <Typography variant='h5' color='textSecondary'>
                Proposal Configuration
              </Typography>
            </Grid>
            <Grid item>
              <Typography>
                Suspendisse in enim nisl. Morbi quis mollis elit. Morbi eget sem tortor. Etiam ac laoreet eros, non
                molestie risus. Praesent vitae sodales lorem, quis placerat velit. Integer a congue metus.
              </Typography>
            </Grid>
            <Grid item>
              <Typography>Select your proposal type:</Typography>
              <RadioGroup aria-label='proposal type' name='proposalType' value={value} onChange={handleChange}>
                <FormControlLabel
                  value='snapshot'
                  control={<Radio classes={{ root: classes.radio, checked: classes.checked }} />}
                  label='Snapshot'
                />
                <FormControlLabel
                  value='custom'
                  control={<Radio classes={{ root: classes.radio, checked: classes.checked }} />}
                  label='Custom'
                />
              </RadioGroup>
            </Grid>
            <Grid item>
              <ZodiacTextField label='Enter your snapshot ENS domain.' placeholder='weenus.eth' borderStyle='double' />
            </Grid>
            <Grid item>
              <DangerAlert address='0x4589fCbf4ec91a6EE0f760287cbFEBBEd5431D0a' />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Divider />
        </Grid>
        <Grid item>
          <Grid container spacing={3} justifyContent='center' alignItems='center'>
            <Grid item>
              <Button size='medium' variant='text' onClick={() => dispatch(setRealityModuleScreen(false))}>
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button color='secondary' size='medium' variant='contained' onClick={handleNext}>
                Next
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ZodiacPaper>
  );
};
