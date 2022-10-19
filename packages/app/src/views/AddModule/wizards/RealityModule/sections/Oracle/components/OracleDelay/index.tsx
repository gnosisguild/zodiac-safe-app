import { Grid, makeStyles, Typography } from "@material-ui/core"
import { TimeSelect, unitConversion } from "components/input/TimeSelect"
import React from "react"
import { isValidOracleDelay } from "utils/oracleValidations"
import { InputPartProps } from "../.."
import { OracleDelayValidation } from "../OracleDelayValidation"

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
  const isValidTimeout = isValidOracleDelay("timeout", timeout)
  const isValidCooldown = isValidOracleDelay("cooldown", cooldown)
  const isValidExpiration = isValidOracleDelay("expiration", expiration, cooldown)

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
              variant={!isValidTimeout ? "error" : "secondary"}
              alertType={!isValidTimeout ? "error" : undefined}
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
              variant={!isValidCooldown ? "error" : "secondary"}
              alertType={!isValidCooldown ? "error" : undefined}
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
              variant={!isValidExpiration ? "error" : "secondary"}
              alertType={!isValidExpiration ? "error" : undefined}
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
      <OracleDelayValidation type="timeout" delayValue={parseInt(timeout)} />
      <OracleDelayValidation type="cooldown" delayValue={parseInt(cooldown)} />
      <OracleDelayValidation
        type="expiration"
        delayValue={parseInt(expiration)}
        dependsDelayValue={parseInt(cooldown)}
      />
    </Grid>
  )
}
export default OracleDelay
