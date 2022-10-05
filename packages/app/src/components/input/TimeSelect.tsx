import React, { useEffect, useState } from "react"
import { Box, makeStyles, MenuItem, Select } from "@material-ui/core"
import { BigNumber, BigNumberish } from "ethers"
import { ReactComponent as CheckmarkIcon } from "../../assets/icons/checkmark.svg"
import { TextField } from "./TextField"
import { colors } from "zodiac-ui-components"
import useKeyPress from "hooks/useKeyPress"
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline"
import ReportProblemOutlinedIcon from "@material-ui/icons/ReportProblemOutlined"

export const unitConversion = {
  seconds: 1,
  minutes: 60,
  hours: 3600,
  days: 86400,
  months: 2592000, // 30 Days
}
type Unit = keyof typeof unitConversion

interface TimeSelectProps {
  tooltipMsg?: string
  defaultValue?: BigNumberish
  defaultUnit?: Unit
  value?: string
  valueUnit?: Unit
  label: string
  variant?: "primary" | "secondary" | "error"
  alertType?: "error" | "warning"
  onChange(time: string, unit: Unit): void
}

const useStyles = makeStyles((theme) => ({
  select: {
    padding: 0,
    border: 0,
    textIndent: theme.spacing(1),
  },
  itemList: {
    padding: 0,
  },
  item: {
    display: "flex",
    flexDirection: "row",
    padding: theme.spacing(1.5, 1),
    "&:not(:last-child)": {
      borderBottomWidth: 1,
      borderBottomStyle: "solid",
      borderBottomColor: theme.palette.primary.light,
    },
    "& .show-if-selected": {
      display: "none",
    },
    "&.Mui-selected .show-if-selected": {
      display: "block",
    },
    "&.Mui-selected::after": {
      content: '""',
      right: 0,
      top: 0,
    },
  },
  dropdownContainer: {
    maxWidth: "120px",
  },
  dropdown: {
    borderRadius: 8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderTopWidth: 2,
    borderTopColor: theme.palette.primary.light,
    borderTopStyle: "solid",
    marginTop: -1,
  },
  primary: {
    borderColor: theme.palette.primary.light,
  },
  secondary: {
    borderColor: colors.tan[300],
  },
  error: {
    background: "rgba(244, 67, 54, 0.1)",
    borderColor: "rgba(244, 67, 54, 0.3)",
  },
  errorIcon: {
    fill: "rgba(244, 67, 54, 1)",
  },
}))

function calculateTime(amount: string, unit: Unit): BigNumber {
  return BigNumber.from(amount).mul(unitConversion[unit])
}

export const TimeSelect = ({
  onChange,
  defaultUnit = "hours",
  defaultValue = "0",
  value,
  valueUnit,
  label,
  variant = "primary",
  tooltipMsg,
  alertType,
}: TimeSelectProps) => {
  const classes = useStyles()
  const tabPress = useKeyPress("Tab")
  const [unit, setUnit] = useState<Unit>(defaultUnit)
  const [amount, setAmount] = useState(
    BigNumber.from(defaultValue).div(unitConversion[unit]).toString(),
  )

  const [open, setOpen] = useState(false)

  const handleClose = () => setOpen(false)
  const handleOpen = () => setOpen(true)

  const selectRef = React.useRef<HTMLDivElement>(null)

  const handleAmountChange = (_amount: string) => {
    try {
      const newAmount = calculateTime(_amount || "0", unit)
      setAmount(_amount)
      onChange(newAmount.toString(), unit)
    } catch (err) {
      console.warn("invalid time")
    }
  }

  const handleAdornment = () => {
    if (alertType) {
      switch (alertType) {
        case "error":
          return <ErrorOutlineIcon className={classes.errorIcon} />

        case "warning":
          return <ReportProblemOutlinedIcon className={classes.errorIcon} />
      }
    }
    return null
  }

  const handleRoot = () => {
    switch (variant) {
      case "primary":
        return classes.primary

      case "secondary":
        return classes.secondary

      case "error":
        return classes.error
    }
  }

  const handleUnitChange = (newUnit: Unit) => {
    handleClose()
    setUnit(newUnit)
    if (amount) onChange(calculateTime(amount, newUnit).toString(), newUnit)
  }

  useEffect(() => {
    if (tabPress && open) {
      handleClose()
    }
  }, [tabPress, open])

  useEffect(() => {
    if (selectRef.current) {
      selectRef.current.addEventListener("keyup", (event) => {
        if (event.code === "Tab") handleOpen()
      })
    }
  }, [selectRef])

  useEffect(() => {
    if (value && valueUnit) {
      if (amount === "0" && value !== amount) {
        setAmount(BigNumber.from(value).div(unitConversion[valueUnit]).toString())
      }
      if (unit === "hours" && valueUnit !== unit) {
        setUnit(valueUnit)
      }
    }
  }, [value, valueUnit, amount, unit])

  return (
    <TextField
      label={label}
      variantAppend={variant}
      tooltipMsg={tooltipMsg}
      InputProps={{
        value: amount,
        placeholder: "24",
        classes: {
          root: handleRoot(),
        },
        onChange: (evt) => handleAmountChange(evt.target.value),
        startAdornment: handleAdornment(),
      }}
      AppendProps={{
        className: classes.dropdownContainer,
      }}
      append={
        <Select
          disableUnderline
          open={open}
          value={unit}
          ref={selectRef}
          onOpen={handleOpen}
          onClose={handleClose}
          className={`${classes.select} ${
            variant === "primary" ? classes.primary : classes.secondary
          }`}
          MenuProps={{
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            },
            anchorPosition: {
              top: 0,
              left: 0,
            },
            getContentAnchorEl: null,
            elevation: 0,
            classes: {
              paper: classes.dropdown,
              list: classes.itemList,
            },
          }}
          renderValue={(value) => value as string}
          onChange={(evt) => handleUnitChange(evt.target.value as Unit)}
        >
          {Object.keys(unitConversion).map((unit) => (
            <MenuItem key={unit} value={unit} className={classes.item}>
              {unit}
              <Box className="show-if-selected" flexGrow={1} />
              <CheckmarkIcon className="show-if-selected" />
            </MenuItem>
          ))}
        </Select>
      }
    />
  )
}
