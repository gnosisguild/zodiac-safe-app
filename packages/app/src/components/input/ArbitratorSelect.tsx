import React, { useEffect, useState } from "react"
import { Box, Grid, InputLabel, makeStyles, MenuItem, Select } from "@material-ui/core"
import { ParamInput } from "../../components/ethereum/ParamInput"
import { ReactComponent as CheckmarkIcon } from "../../assets/icons/checkmark.svg"
import { getArbitrator, ARBITRATOR_OPTIONS } from "../../services"
import { NETWORK } from "../../utils/networks"
import { ParamType } from "ethers"

export const arbitratorOptions = {
  NO_ARBITRATOR: "No arbitration (highest bond wins)",
  KLEROS: "Kleros",
  OTHER: "Other (custom address)",
}

// List of chain IDs where Kleros is available.
export const klerosAvailability: number[] = [
  NETWORK.MAINNET,
  NETWORK.GNOSIS_CHAIN,
  NETWORK.POLYGON,
  NETWORK.BASE,
  NETWORK.SEPOLIA,
]

type Option = keyof typeof arbitratorOptions

interface ArbitratorSelectProps {
  defaultAddress?: string
  defaultOption?: string
  label: string
  chainId: number

  onChange(arbitrator: string): void
}

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    flexWrap: "nowrap",
    justifyContent: "flex-end",
  },
  label: {
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(1),
  },
  inputContainer: {
    flexGrow: 1,
  },
  input: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    "& input": {
      textAlign: "right",
    },
  },
  select: {
    marginBottom: -1,
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
    maxWidth: "100%",
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
}))

export const ArbitratorSelect = ({
  onChange,
  defaultOption = arbitratorOptions.NO_ARBITRATOR,
  defaultAddress = "",
  label,
  chainId,
}: ArbitratorSelectProps) => {
  const classes = useStyles()
  const [option, setOption] = useState<string>(defaultOption)
  const [arbitrator, setArbitrator] = useState(defaultAddress)

  const [open, setOpen] = useState(false)

  const handleClose = () => setOpen(false)
  const handleOpen = () => setOpen(true)

  const selectRef = React.useRef<HTMLDivElement>(null)

  const handleArbitratorChange = (_arbitrator: string, valid?: boolean) => {
    try {
      if (valid === true) {
        setArbitrator(_arbitrator)
        onChange(_arbitrator)
      }
    } catch (err) {
      console.warn("invalid arbitrator option")
    }
  }

  const handleArbitratorOptionChange = (newOption: string) => {
    handleClose()
    const newOptionKey = Object.keys(arbitratorOptions).find(
      (k) => arbitratorOptions[`${k}` as Option] === newOption,
    ) as Option
    setOption(newOption)
    if (newOptionKey === "OTHER") {
      setArbitrator("")
      onChange("")
    } else {
      const newArbitrator = getArbitrator(chainId, ARBITRATOR_OPTIONS[newOptionKey])
      setArbitrator(newArbitrator)
      onChange(newArbitrator)
    }
  }

  useEffect(() => {
    if (selectRef.current) {
      selectRef.current.addEventListener("keyup", (event) => {
        if (event.code === "Tab") handleOpen()
      })
    }
  }, [selectRef])

  return (
    <div>
      <InputLabel className={classes.label}>{label}</InputLabel>
      <Grid container className={classes.root}>
        <Grid item xs={12} className={classes.dropdownContainer}>
          <Select
            disableUnderline
            open={open}
            value={option}
            ref={selectRef}
            onOpen={handleOpen}
            onClose={handleClose}
            className={classes.select}
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
            onChange={(evt) => handleArbitratorOptionChange(evt.target.value as string)}
          >
            {Object.keys(arbitratorOptions).map((optionKey) => {
              if (!klerosAvailability.includes(chainId) && optionKey === "KLEROS") {
                return null
              }
              return (
                <MenuItem
                  key={optionKey}
                  value={arbitratorOptions[`${optionKey}` as Option]}
                  className={classes.item}
                >
                  {arbitratorOptions[`${optionKey}` as Option]}
                  <Box className="show-if-selected" flexGrow={1} />
                  <CheckmarkIcon className="show-if-selected" />
                </MenuItem>
              )
            })}
          </Select>
        </Grid>
      </Grid>
      {option === arbitratorOptions.OTHER && (
        <Grid container className={classes.root}>
          <Grid item xs={12}>
            <ParamInput
              param={ParamType.from("address")}
              color="secondary"
              value={arbitrator}
              label=""
              placeholder="address (0x...)"
              onChange={(value, valid) => handleArbitratorChange(value, valid)}
            />
          </Grid>
        </Grid>
      )}
    </div>
  )
}
