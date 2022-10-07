import React from "react"
import { Grid, Typography, makeStyles } from "@material-ui/core"
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline"
import ReportProblemOutlinedIcon from "@material-ui/icons/ReportProblemOutlined"

const useStyles = makeStyles(() => ({
  errorIcon: {
    fill: "rgba(244, 67, 54, 1)",
  },
  message: {
    fontSize: 12,
    color: "rgba(244, 67, 54, 1)",
  },
}))

export const OracleAlert: React.FC<{
  type: "error" | "warning"
  message: string
}> = ({ type, message }) => {
  const classes = useStyles()
  return (
    <Grid container spacing={1} alignItems="center">
      {type === "error" && (
        <Grid item>
          <ErrorOutlineIcon className={classes.errorIcon} />{" "}
        </Grid>
      )}

      {type === "warning" && (
        <Grid item>
          <ReportProblemOutlinedIcon className={classes.errorIcon} />
        </Grid>
      )}

      <Grid item>
        <Typography className={classes.message}>{message}</Typography>
      </Grid>
    </Grid>
  )
}
