import React from "react";
import { Row } from "../../components/layout/Row";
import { Grid, makeStyles, Paper, Typography } from "@material-ui/core";
import { ModuleButton } from "./ModuleButton";
import { ReactComponent as DaoModuleImage } from "../../assets/images/dao-module.svg";
import { ReactComponent as DelayModuleImage } from "../../assets/images/delay-module.svg";
import { AddCustomModule } from "./AddCustomModule";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(8, 1, 1, 1),
    padding: theme.spacing(2.5, 2, 2, 2),
    maxWidth: 500,
  },
  spacing: {
    marginBottom: theme.spacing(2),
  },
  divider: {
    margin: theme.spacing(4, 0),
    borderTopColor: theme.palette.divider,
    borderTopWidth: 2,
    borderTopStyle: "solid",
  },
}));

export const AppModule = () => {
  const classes = useStyles();

  return (
    <Row justifyContent="center">
      <Paper className={classes.root} elevation={2}>
        <Typography variant="h4" className={classes.spacing}>
          Start by adding a module
        </Typography>
        <Typography variant="body2" className={classes.spacing}>
          Gnosis Safe Modules enable additional access-control logic for your
          Gnosis Safe account. Read more about what they are and how they can be
          used in this article.
        </Typography>
        <Typography variant="h6" className={classes.spacing}>
          Gnosis Built Modules
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <ModuleButton
              title="Transaction Delay"
              description="Delay transactions so members can intervene"
              image={<DelayModuleImage />}
            />
          </Grid>
          <Grid item xs={6}>
            <ModuleButton
              title="DAO Module"
              description="Connect Reality.eth questions to your safe"
              image={<DaoModuleImage />}
            />
          </Grid>
        </Grid>

        <div className={classes.divider} />

        <AddCustomModule />
      </Paper>
    </Row>
  );
};
