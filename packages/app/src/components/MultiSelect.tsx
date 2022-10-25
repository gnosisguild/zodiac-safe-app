import { Grid, makeStyles, Typography } from "@material-ui/core"
import React from "react"
import { colors, ZodiacPaper } from "zodiac-ui-components"
import Creatable from "react-select/creatable"
import { Props as MultiSelectProps } from "react-select"

export interface MultiSelectValues {
  label: string
  value: string
}

const useStyles = makeStyles((theme) => ({
  paperContainer: {
    background: "rgba(0, 0, 0, 0.2)",
  },
  message: {
    fontSize: 12,
    color: "rgba(244, 67, 54, 1)",
  },
}))

const customStyles = {
  control: (base: any, state: { isFocused: any }) => ({
    ...base,
    background: "none",
    border: "none",
    fontFamily: "Roboto Mono !important",
    color: "yellow !important",
    boxShadow: state.isFocused ? null : null,
    "&:hover": {
      border: "none",
    },
  }),
  option: (base: any) => ({
    ...base,
    color: "white",
    backgroundColor: "#101010",
    cursor: "pointer",
  }),
  menu: (base: any) => ({
    ...base,
    // override border radius to match the box
    borderRadius: 0,
    backgroundColor: "#101010",
    // kill the gap
    marginTop: 0,
  }),
  menuList: (base: any) => ({
    ...base,
    // kill the white space on first and last option
    padding: 0,
  }),
  multiValue: (base: any) => ({
    ...base,
    color: "white !important",
    background: colors.tan[300],
    maxWidth: "calc(28% - 4px)",
    "&:hover": {
      background: colors.tan[300],
    },
    "& > div": {
      color: `white !important`,
    },
    "& > div[role=button]:hover": {
      cursor: "pointer",
      color: "blue",
      background: colors.tan[500],
    },
  }),
}

interface MultiSelectCustomProps extends MultiSelectProps {
  invalidText?: string
}

export const MultiSelect: React.FC<MultiSelectCustomProps> = (props) => {
  const classes = useStyles()
  return (
    <Grid container spacing={1} direction="column">
      <Grid item>
        <ZodiacPaper className={classes.paperContainer} borderStyle="double">
          <Creatable
            {...props}
            isMulti
            styles={customStyles}
            options={props.options}
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                font: "#101010",
                primary25: "#101010",
                primary: "#101010",
                neutral80: "white",
              },
            })}
          />
        </ZodiacPaper>
      </Grid>
      {props.invalidText && (
        <Grid item>
          <Typography className={classes.message}>{props.invalidText}</Typography>
        </Grid>
      )}
    </Grid>
  )
}
