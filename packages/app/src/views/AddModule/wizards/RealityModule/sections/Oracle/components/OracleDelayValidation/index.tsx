import { Grid } from "@material-ui/core"
import React, { Fragment, useEffect, useState } from "react"
import {
  COOLDOWN_ERROR_MSG,
  COOLDOWN_WARNING_MSG,
  EXPIRATION_ERROR_MSG,
  EXPIRATION_WARNING_MSG,
  isValidOracleDelay,
  TIMEOUT_ERROR_MSG,
  TIMEOUT_WARNING_MSG,
  warningOracleDelay,
} from "views/AddModule/wizards/RealityModule/utils/oracleValidations"
import { OracleAlert } from "../OracleAlert"

export interface OracleDelayValidationProps {
  type: "timeout" | "cooldown" | "expiration"
  delayValue: string | number
  dependsDelayValue?: string | number
}
interface OracleAlertType {
  type: "error" | "warning"
  message: string
}

export const OracleDelayValidation: React.FC<OracleDelayValidationProps> = ({
  type,
  delayValue,
  dependsDelayValue,
}) => {
  const timeoutError = isValidOracleDelay("timeout", parseInt(delayValue as string))
  const cooldownError = isValidOracleDelay("cooldown", parseInt(delayValue as string))
  const expirationError = isValidOracleDelay(
    "expiration",
    parseInt(delayValue as string),
    dependsDelayValue,
  )
  const timeoutWarning = warningOracleDelay("timeout", parseInt(delayValue as string))
  const cooldownWarning = warningOracleDelay("cooldown", parseInt(delayValue as string))
  const expirationWarning = warningOracleDelay(
    "expiration",
    parseInt(delayValue as string),
  )

  const [timeoutAlert, setTimeoutAlert] = useState<OracleAlertType | undefined>(undefined)
  const [cooldownAlert, setCooldownAlert] = useState<OracleAlertType | undefined>(
    undefined,
  )
  const [expirationAlert, setExpirationAlert] = useState<OracleAlertType | undefined>(
    undefined,
  )

  useEffect(() => {
    if (!timeoutError) {
      return setTimeoutAlert({ type: "error", message: TIMEOUT_ERROR_MSG })
    }
    if (!timeoutWarning) {
      return setTimeoutAlert({ type: "warning", message: TIMEOUT_WARNING_MSG })
    }
    setTimeoutAlert(undefined)
  }, [timeoutError, timeoutWarning])

  useEffect(() => {
    if (!cooldownError) {
      return setCooldownAlert({ type: "error", message: COOLDOWN_ERROR_MSG })
    }
    if (!cooldownWarning) {
      return setCooldownAlert({ type: "warning", message: COOLDOWN_WARNING_MSG })
    }
    setCooldownAlert(undefined)
  }, [cooldownError, cooldownWarning])

  useEffect(() => {
    if (!expirationError) {
      return setExpirationAlert({ type: "error", message: EXPIRATION_ERROR_MSG })
    }
    if (!expirationWarning) {
      return setExpirationAlert({ type: "warning", message: EXPIRATION_WARNING_MSG })
    }
    setExpirationAlert(undefined)
  }, [expirationError, expirationWarning])

  return (
    <Fragment>
      {type === "timeout" && timeoutAlert && (
        <Grid item>
          <OracleAlert type={timeoutAlert.type} message={timeoutAlert.message} />
        </Grid>
      )}
      {type === "cooldown" && cooldownAlert && (
        <Grid item>
          <OracleAlert type={cooldownAlert.type} message={cooldownAlert.message} />
        </Grid>
      )}
      {type === "expiration" && expirationAlert && (
        <Grid item>
          <OracleAlert type={expirationAlert.type} message={expirationAlert.message} />
        </Grid>
      )}
    </Fragment>
  )
}
