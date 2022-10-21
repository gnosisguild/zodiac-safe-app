export const DEFAULT_TIMEOUT = 172800 // 2 Days
export const MIN_TIMEOUT = 86400 // 1 Day
export const WARNING_TIMEOUT = 172800 // 2 Days
export const DEFAULT_COOLDOWN = 172800 // 2 Days
export const WARNING_COOLDOWN = 172800 // 2 Days
export const MIN_COOLDOWN = 0
export const DEFAULT_EXPIRATION = 604800 // 7 Days
export const WARNING_EXPIRATION = 432000 // 5 Day
export const MIN_EXPIRATION = 86400 // 1 Day

export const TIMEOUT_WARNING_MSG =
  "We highly recommend that your timeout delay exceeds 48 hours."
export const TIMEOUT_ERROR_MSG = "Your timeout delay must exceed 24 hours."
export const COOLDOWN_WARNING_MSG =
  "We highly recommend that your cooldown delay exceeds 48 hours."
export const COOLDOWN_ERROR_MSG = "Your cooldown delay must exceed 0"
export const EXPIRATION_WARNING_MSG =
  "We highly recommend that your expiration delay exceeds cooldown + 5 days."
export const EXPIRATION_ERROR_MSG =
  "Your  expiration delay must exceeds cooldown + 1 days."

export const isValidOracleDelay = (
  type: "timeout" | "cooldown" | "expiration",
  delayValue: string | number,
  dependsDelayValue?: string | number,
): boolean => {
  const value = parseInt(delayValue as string)
  const depends = parseInt(dependsDelayValue as string)
  switch (type) {
    case "timeout":
      if (value < MIN_TIMEOUT) {
        return false
      }
      break
    case "cooldown":
      if (value <= MIN_COOLDOWN) {
        return false
      }
      break
    case "expiration":
      if (value === 0) {
        return true
      }
      if (dependsDelayValue && value < depends + MIN_EXPIRATION) {
        return false
      }
      break
  }
  return true
}

export const warningOracleDelay = (
  type: "timeout" | "cooldown" | "expiration",
  delayValue: string | number,
): boolean => {
  const value = parseInt(delayValue as string)
  switch (type) {
    case "timeout":
      if (value >= MIN_TIMEOUT && value < WARNING_TIMEOUT) {
        return false
      }
      break
    case "cooldown":
      if (value >= MIN_COOLDOWN && value < WARNING_COOLDOWN) {
        return false
      }
      break
    case "expiration":
      if (value === 0) {
        return false
      }
      if (value >= MIN_EXPIRATION && value < WARNING_EXPIRATION) {
        return false
      }
      break
  }
  return true
}
