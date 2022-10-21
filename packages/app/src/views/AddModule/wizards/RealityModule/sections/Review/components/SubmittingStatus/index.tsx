import { Box, Grid, makeStyles, Typography } from "@material-ui/core"
import React from "react"
import { colors } from "zodiac-ui-components"
import DoneIcon from "@material-ui/icons/Done"
import ClearIcon from "@material-ui/icons/Clear"
import { Loader } from "@gnosis.pm/safe-react-components"

const useStyles = makeStyles((theme) => ({
  message: {
    fontSize: "0.9rem",
  },
  messageError: {
    fontSize: "0.9rem",
    color: "rgba(244, 67, 54, 1)",
  },
  circle: {
    padding: 6,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
    height: 20,
    width: 20,
    background: colors.tan[1000],
  },
  loadingContainer: {
    padding: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
    height: 20,
    width: 20,
    border: `1px solid ${colors.tan[300]}`,
  },
  errorContainer: {
    padding: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
    height: 20,
    width: 20,
    border: "1px solid rgba(244, 67, 54, 0.3)",
    background: "rgba(244, 67, 54, 0.3)",
  },
  errorIcon: {
    width: "12px",
    height: "12px",
    color: `#F44336`,
  },
  loading: {
    width: "12px !important",
    height: "12px !important",
    color: `${colors.tan[300]} !important`,
  },
  doneIcon: {
    fill: "black",
    width: "16px",
  },
}))

export interface StatusLog {
  error: boolean
  msg: string
}

export interface SubmittingStatusProps {
  statusLog: StatusLog[]
}

export const SubmittingStatus: React.FC<SubmittingStatusProps> = ({ statusLog }) => {
  const classes = useStyles()

  return (
    <Grid container spacing={1} alignItems="center">
      {statusLog.map((item, index) => (
        <Grid item xs={12} key={`status-${index}`}>
          <Grid container spacing={1} alignItems="center" key={index}>
            <Grid item>
              {statusLog.length > index + 1 && !item.error && (
                <Box className={classes.circle}>
                  <DoneIcon className={classes.doneIcon} />
                </Box>
              )}
              {statusLog.length === index + 1 && !item.error && (
                <Box className={classes.loadingContainer}>
                  <Loader size="sm" className={classes.loading} />
                </Box>
              )}
              {statusLog.length === index + 1 && item.error && (
                <Box className={classes.errorContainer}>
                  <ClearIcon className={classes.errorIcon} />
                </Box>
              )}
            </Grid>
            <Grid item>
              <Typography className={item.error ? classes.messageError : classes.message}>
                {item.msg}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      ))}
    </Grid>
  )
}
