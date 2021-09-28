import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
} from "@material-ui/core";
import { ParamInput } from "../../components/ethereum/ParamInput";
import { ParamType } from "@ethersproject/abi";
import { ReactComponent as CheckmarkIcon } from "../../assets/icons/checkmark.svg";
import { getArbitrator, ARBITRATOR_OPTIONS } from "../../services";


const arbitratorOptions = {
  NO_ARBITRATOR: "No arbitration (highest bond wins)",
  KLEROS: "Kleros",
  OTHER: "Other (custom address)",
};

// List of chain IDs where Kleros is available.
const klerosAvailability:number[] = [];

type Option = keyof typeof arbitratorOptions;

interface ArbitratorSelectProps {
  defaultAddress?: string;
  defaultOption?: Option;
  label: string;
  chainId: number;

  onChange(arbitrator: string): void;
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
      borderRightWidth: 1,
      borderRightStyle: "solid",
      borderRightColor: theme.palette.secondary.main,
      paddingRight: theme.spacing(1),
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
}));

export const ArbitratorSelect = ({
  onChange,
  defaultOption = "NO_ARBITRATOR",
  defaultAddress = "",
  label,
  chainId,
}: ArbitratorSelectProps) => {
  const classes = useStyles();
  const [option, setOption] = useState<Option>(defaultOption);
  const [arbitratorAddress, setArbitratorAddress] = useState(
    defaultAddress
  );

  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const selectRef = React.useRef<HTMLDivElement>(null);

  const handleArbitratorAddressChange = (_arbitratorAddress: string, valid?: boolean) => {
    try {
      if (valid === true) {
        setArbitratorAddress(_arbitratorAddress);
        onChange(_arbitratorAddress);
      }
    } catch (err) {
      console.warn("invalid arbitrator option");
    }
  };

  const handleArbitratorOptionChange = (newOption: Option) => {
    handleClose();
    setOption(newOption);
    if (newOption === "OTHER") {
      setArbitratorAddress("");
      onChange("");
    } else {
      const newArbitrator = getArbitrator(chainId, ARBITRATOR_OPTIONS[newOption]);
      setArbitratorAddress(newArbitrator);
      onChange(newArbitrator);
    }
  };

  useEffect(() => {
    if (selectRef.current) {
      selectRef.current.addEventListener("keyup", (event) => {
        if (event.code === "Tab") handleOpen();
      });
    }
  }, [selectRef]);

  const optionText = arbitratorOptions[`${option}` as keyof typeof arbitratorOptions];

  return (
    <div>
      <InputLabel className={classes.label}>{label}</InputLabel>
      <Grid container className={classes.root}>
        <Grid item xs={12} className={classes.dropdownContainer}>
          <Select
            disableUnderline
            open={open}
            value={optionText}
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
            onChange={(evt) => handleArbitratorOptionChange(evt.target.value as Option)}
          >
            {Object.keys(arbitratorOptions).map((option: string) => {
              const optionText = arbitratorOptions[`${option}` as keyof typeof arbitratorOptions];
              if (!klerosAvailability.includes(chainId) && option === "KLEROS") {
                return null;
              }
              return (
                <MenuItem key={option} value={option} className={classes.item}>
                  {optionText}
                  <Box className="show-if-selected" flexGrow={1} />
                  <CheckmarkIcon className="show-if-selected" />
                </MenuItem>
              );
            })}
          </Select>
        </Grid>
      </Grid>
      {(option === "OTHER") && <Grid container className={classes.root}>
        <Grid item xs={12}>
          <ParamInput
            param={ParamType.from("address")}
            color="secondary"
            value={arbitratorAddress}
            label=""
            placeholder="address (0x...)"
            onChange={(value, valid) => handleArbitratorAddressChange(value, valid)}
          />
        </Grid>
      </Grid>}
    </div>
  );
};
