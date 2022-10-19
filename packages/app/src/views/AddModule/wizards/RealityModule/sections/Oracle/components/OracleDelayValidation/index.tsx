import { Grid } from "@material-ui/core"
import React, { Fragment } from "react"
import {
  COOLDOWN_ERROR_MSG,
  COOLDOWN_WARNING_MSG,
  EXPIRATION_ERROR_MSG,
  EXPIRATION_WARNING_MSG,
  MIN_COOLDOWN,
  MIN_EXPIRATION,
  MIN_TIMEOUT,
  TIMEOUT_ERROR_MSG,
  TIMEOUT_WARNING_MSG,
  WARNING_COOLDOWN,
  WARNING_EXPIRATION,
  WARNING_TIMEOUT,
} from "utils/oracleValidations"
import { OracleAlert } from "../OracleAlert"

export interface OracleDelayValidationProps {
  type: "timeout" | "cooldown" | "expiration"
  delayValue: string | number
  dependsDelayValue?: string | number
}

export const OracleDelayValidation: React.FC<OracleDelayValidationProps> = ({
  type,
  delayValue,
  dependsDelayValue,
}) => {
  const isValidOracleDelay = (
    type: "timeout" | "cooldown" | "expiration",
  ): {
    valid: boolean
    type?: "error" | "warning"
    msg?: string
  } => {
    const value = parseInt(delayValue as string)
    const depends = parseInt(dependsDelayValue as string)
    switch (type) {
      case "timeout": {
        if (value < MIN_TIMEOUT) {
          return { valid: false, type: "error", msg: TIMEOUT_ERROR_MSG }
        }
        if (value >= MIN_TIMEOUT && value < WARNING_TIMEOUT) {
          return { valid: false, type: "warning", msg: TIMEOUT_WARNING_MSG }
        }
        break
      }
      case "cooldown": {
        if (value <= MIN_COOLDOWN) {
          return { valid: false, type: "error", msg: COOLDOWN_ERROR_MSG }
        }
        if (value >= MIN_COOLDOWN && value < WARNING_COOLDOWN) {
          return { valid: false, type: "warning", msg: COOLDOWN_WARNING_MSG }
        }
        break
      }
      case "expiration": {
        if (dependsDelayValue && value < depends + MIN_EXPIRATION) {
          return { valid: false, type: "error", msg: EXPIRATION_ERROR_MSG }
        }
        if (value >= MIN_EXPIRATION && delayValue < WARNING_EXPIRATION) {
          return { valid: false, type: "warning", msg: EXPIRATION_WARNING_MSG }
        }
        break
      }
    }
    return { valid: true }
  }

  const timeout = isValidOracleDelay("timeout")
  const cooldown = isValidOracleDelay("cooldown")
  const expiration = isValidOracleDelay("expiration")

  return (
    <Fragment>
      {type === "timeout" && !timeout.valid && timeout.type && (
        <Grid item>
          <OracleAlert type={timeout.type} message={timeout.msg ?? ""} />
        </Grid>
      )}
      {type === "cooldown" && !cooldown.valid && cooldown.type && (
        <Grid item>
          <OracleAlert type={cooldown.type} message={cooldown.msg ?? ""} />
        </Grid>
      )}
      {type === "expiration" && !expiration.valid && expiration.type && (
        <Grid item>
          <OracleAlert type={expiration.type} message={expiration.msg ?? ""} />
        </Grid>
      )}
    </Fragment>
  )
}
