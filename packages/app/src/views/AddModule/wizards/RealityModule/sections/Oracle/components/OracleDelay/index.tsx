import { Divider, Grid, makeStyles, Typography } from "@material-ui/core"
import { TimeSelect, unitConversion } from "components/input/TimeSelect"
import React from "react"
import { InputPartProps } from "../.."
import { OracleAlert } from "../OracleAlert"

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    flexDirection: "column",
  },
  textSubdued: {
    color: "rgba(255 255 255 / 70%)",
  },
}))

type Unit = keyof typeof unitConversion

export const MIN_TIMEOUT = 86400
export const MIN_COOLDOWN = 172800

export type Data = {
  expiration: number
  expirationUnit: Unit
  cooldown: number
  cooldownUnit: Unit
  timeout: number
  timeoutUnit: Unit
}

export const OracleDelay: React.FC<InputPartProps> = ({ data, setData }) => {
  const classes = useStyles()
  const get = (key: keyof Data) => data[key]
  const timeout = get("timeout")
  const cooldown = get("cooldown")
  const expiration = get("expiration")

  return (
    <Grid container spacing={2} className={classes.container}>
      <Grid item>
        <Grid container spacing={1} className={classes.container}>
          <Grid item>
            <Typography variant="h4" color="textSecondary">
              Delay Configuration
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" className={classes.textSubdued}>
              These Parameters are very important for your DAO&apos;s security and should
              be considered carefully. Allowing enough time in these configurations will
              enable the safe to have a final chance to veto or circumvent any potential
              malicious proposals that have snuck through.
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container spacing={6} alignItems="center" justifyContent="space-between">
          <Grid item xs={4}>
            <TimeSelect
              variant={timeout < MIN_TIMEOUT ? "error" : "secondary"}
              alertType={timeout < MIN_TIMEOUT ? "error" : undefined}
              label="Timeout"
              tooltipMsg="Duration that answers can be submitted to the oracle (resets when a new answer is submitted)"
              valueUnit={get("timeoutUnit")}
              value={timeout}
              onChange={(value, unit) => {
                setData({ ...data, timeout: value, timeoutUnit: unit })
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TimeSelect
              variant={cooldown < MIN_COOLDOWN ? "error" : "secondary"}
              alertType={cooldown < MIN_COOLDOWN ? "warning" : undefined}
              label="Cooldown"
              tooltipMsg="Duration required before the transaction can be executed (after the timeout has expired)."
              valueUnit={get("cooldownUnit")}
              value={cooldown}
              onChange={(value, unit) => {
                setData({ ...data, cooldown: value, cooldownUnit: unit })
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TimeSelect
              variant="secondary"
              label="Expiration"
              tooltipMsg="Duration that a transaction is valid in seconds (or 0 if valid forever) after the cooldown (note this applies to all proposals on this module)."
              valueUnit={get("expirationUnit")}
              value={expiration}
              onChange={(value, unit) => {
                setData({ ...data, expiration: value, expirationUnit: unit })
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      {timeout < MIN_TIMEOUT && (
        <Grid item>
          <OracleAlert type="error" message="Your timeout delay must exceed 24 hours." />
        </Grid>
      )}
      {timeout < MIN_TIMEOUT && cooldown < MIN_COOLDOWN && (
        <Grid item>
          <Divider />
        </Grid>
      )}
      {cooldown < MIN_COOLDOWN && (
        <Grid item>
          <OracleAlert
            type="warning"
            message="We highly recommend that your cooldown delay exceeds 48 hours."
          />
        </Grid>
      )}
    </Grid>
  )
}
export default OracleDelay
