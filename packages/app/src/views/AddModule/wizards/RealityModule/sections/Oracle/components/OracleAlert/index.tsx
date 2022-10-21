import React from "react"
import { Grid, Typography, makeStyles } from "@material-ui/core"
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline"
import ReportProblemOutlinedIcon from "@material-ui/icons/ReportProblemOutlined"
import { colors } from "zodiac-ui-components"

const useStyles = makeStyles(() => ({
  errorIcon: {
    fill: "rgba(244, 67, 54, 1)",
  },
  warningIcon: {
    fill: colors.tan[800],
  },
  message: {
    fontSize: 12,
    color: "rgba(244, 67, 54, 1)",
  },
  warningMessage: {
    fontSize: 12,
    color: colors.tan[800],
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
          <ReportProblemOutlinedIcon className={classes.warningIcon} />
        </Grid>
      )}

      <Grid item>
        <Typography
          className={type === "error" ? classes.message : classes.warningMessage}
        >
          {message}
        </Typography>
      </Grid>
    </Grid>
  )
}
