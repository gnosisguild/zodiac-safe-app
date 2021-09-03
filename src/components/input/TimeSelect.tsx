import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  InputBase,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
} from "@material-ui/core";
import { BigNumber } from "ethers";
import { ReactComponent as CheckmarkIcon } from "../../assets/icons/checkmark.svg";

const unitConversion = {
  seconds: 1,
  minutes: 60,
  hours: 3600,
  days: 86400,
  months: 2592000, // 30 Days
};
type Unit = keyof typeof unitConversion;

interface TimeSelectProps {
  defaultValue?: number;
  defaultUnit?: Unit;
  label: string;

  onChange(time: number): void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    backgroundColor: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    flexWrap: "nowrap",
    justifyContent: "flex-end",
    "&::after": {
      content: "''",
      position: "absolute",
      left: 0,
      bottom: 0,
      width: "100%",
      borderBottomWidth: 2,
      borderBottomStyle: "solid",
      borderBottomColor: theme.palette.secondary.main,
    },
  },
  label: {
    color: theme.palette.text.primary,
    fontSize: 14,
    marginBottom: theme.spacing(0.5),
  },
  inputContainer: {
    padding: theme.spacing(1, 0, 1, 1),
  },
  input: {
    "& input": {
      borderRightWidth: 1,
      borderRightStyle: "solid",
      borderRightColor: theme.palette.secondary.main,
      paddingRight: theme.spacing(1),
      textAlign: "right",
    },
  },
  select: {
    textIndent: theme.spacing(1),
    "& .MuiSelect-select": {
      paddingTop: theme.spacing(1.75),
      paddingBottom: theme.spacing(1.75),
    },
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
    maxWidth: "120px"
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

function calculateTime(amount: number, unit: Unit) {
  return amount * unitConversion[unit];
}

export const TimeSelect = ({
  onChange,
  defaultUnit = "hours",
  defaultValue = 0,
  label,
}: TimeSelectProps) => {
  const classes = useStyles();
  const [unit, setUnit] = useState<Unit>(defaultUnit);
  const [amount, setAmount] = useState(
    BigNumber.from(defaultValue).div(unitConversion[unit]).toString()
  );

  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const selectRef = React.useRef<HTMLDivElement>(null);

  const handleAmountChange = (_amount: string) => {
    const newAmount = parseInt(_amount || "0");
    if (isNaN(newAmount)) return;
    setAmount(_amount);
    onChange(calculateTime(newAmount, unit));
  };

  const handleUnitChange = (newUnit: Unit) => {
    handleClose();
    setUnit(newUnit);
    if (amount !== undefined)
      onChange(calculateTime(parseInt(amount || "0"), newUnit));
  };

  useEffect(() => {
    if (selectRef.current) {
      selectRef.current.addEventListener("keyup", (event) => {
        if (event.code === "Tab") handleOpen();
      });
    }
  }, [selectRef]);

  return (
    <div>
      <InputLabel className={classes.label}>{label}</InputLabel>
      <Grid container className={classes.root}>
        <Grid item className={classes.inputContainer}>
          <InputBase
            className={classes.input}
            value={amount}
            placeholder="24"
            onChange={(evt) => handleAmountChange(evt.target.value)}
          />
        </Grid>
        <Grid item xs={8} className={classes.dropdownContainer}>
          <Select
            disableUnderline
            open={open}
            value={unit}
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
        </Grid>
      </Grid>
    </div>
  );
};
