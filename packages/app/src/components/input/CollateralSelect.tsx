import React, { useEffect, useState } from "react"
import { Box, Grid, InputLabel, makeStyles, MenuItem, Select } from "@material-ui/core"
import { ReactComponent as CheckmarkIcon } from "../../assets/icons/checkmark.svg"
import { getCollateral, COLLATERAL_OPTIONS } from "../../services"
import { NETWORK } from "../../utils/networks"

export const collateralOptions = {
  USDC: "USDC",
  WETH: "WETH",
}

export function scaleBondDecimals(bond: string, isWeth: boolean): number {
  if (isWeth) {
    return Number(bond) * Math.pow(10, 18)
  } else {
    return Number(bond) * Math.pow(10, 6)
  }
}

// List of chain IDs where OG is available.
const optimisticGovernorAvailability: number[] = [
  NETWORK.MAINNET,
  NETWORK.POLYGON,
  NETWORK.GOERLI,
  NETWORK.GNOSIS_CHAIN,
  NETWORK.OPTIMISM,
  NETWORK.ARBITRUM,
  NETWORK.AVALANCHE,
]

type Option = keyof typeof collateralOptions

interface CollateralSelectProps {
  defaultAddress?: string
  defaultOption?: string
  label: string
  chainId: number

  onChange(collateral: string): void
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

export const CollateralSelect = ({
  onChange,
  defaultOption = collateralOptions.USDC,
  label,
  chainId,
}: CollateralSelectProps) => {
  const classes = useStyles()
  const [option, setOption] = useState<string>(defaultOption)

  const [open, setOpen] = useState(false)

  const handleClose = () => setOpen(false)
  const handleOpen = () => setOpen(true)

  const selectRef = React.useRef<HTMLDivElement>(null)

  const handleCollateralOptionChange = (newOption: string) => {
    handleClose()
    const newOptionKey = Object.keys(collateralOptions).find(
      (k) => collateralOptions[`${k}` as Option] === newOption,
    ) as Option
    setOption(newOption)
    const isWeth = newOptionKey === "WETH" ? true : false
    const newCollateral = getCollateral(chainId, isWeth)
    onChange(newCollateral)
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
            onChange={(evt) => handleCollateralOptionChange(evt.target.value as string)}
          >
            {Object.keys(collateralOptions).map((optionKey) => {
              if (
                !optimisticGovernorAvailability.includes(chainId) &&
                optionKey === "WETH"
              ) {
                return null
              }
              return (
                <MenuItem
                  key={optionKey}
                  value={collateralOptions[`${optionKey}` as Option]}
                  className={classes.item}
                >
                  {collateralOptions[`${optionKey}` as Option]}
                  <Box className="show-if-selected" flexGrow={1} />
                  <CheckmarkIcon className="show-if-selected" />
                </MenuItem>
              )
            })}
          </Select>
        </Grid>
      </Grid>
    </div>
  )
}
