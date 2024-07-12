import { Grid, makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import { colors, ZodiacPaper } from 'zodiac-ui-components'
import Creatable from 'react-select/creatable'
import { CreatableProps } from 'react-select/creatable'
import { GroupBase } from 'react-select'

const components = {
  DropdownIndicator: null,
}

export interface MultiSelectValues {
  label: string
  value: string
}

const useStyles = makeStyles(() => ({
  paperContainer: {
    background: 'rgba(0, 0, 0, 0.2)',
  },
  message: {
    fontSize: 12,
    color: 'rgba(244, 67, 54, 1)',
  },
}))

const customStyles = {
  control: (base: any, state: { isFocused: any }) => ({
    ...base,
    background: 'none',
    width: '100%',
    border: 'none',
    fontFamily: 'Roboto Mono !important',
    color: 'yellow !important',
    boxShadow: state.isFocused ? null : null,
    '&:hover': {
      border: 'none',
    },
  }),
  option: (base: any) => ({
    ...base,
    color: 'white',
    backgroundColor: '#101010',
    cursor: 'pointer',
  }),
  menu: (base: any) => ({
    ...base,
    // override border radius to match the box
    borderRadius: 0,
    backgroundColor: '#101010',
    // kill the gap
    marginTop: 0,
  }),
  menuList: (base: any) => ({
    ...base,
    // kill the white space on first and last option
    padding: 0,
  }),
  ValueContainer: (base: any) => ({
    ...base,
    display: 'block',
  }),
  multiValue: (base: any) => ({
    ...base,
    color: 'white !important',
    background: colors.tan[300],
    '&:hover': {
      background: colors.tan[300],
    },
    '& > div': {
      color: `white !important`,
    },
    '& > div[role=button]:hover': {
      cursor: 'pointer',
      color: 'blue',
      background: colors.tan[500],
    },
  }),
}

interface MultiSelectBlockCustomProps
  extends CreatableProps<MultiSelectValues, true, GroupBase<MultiSelectValues>> {
  invalidText?: string
}

export const MultiSelectBlock: React.FC<MultiSelectBlockCustomProps> = (props) => {
  const classes = useStyles()

  return (
    <Grid container spacing={1} direction='column'>
      <Grid item>
        <ZodiacPaper
          className={classes.paperContainer}
          borderStyle='double'
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <Creatable
            {...props}
            components={components}
            placeholder='Paste an address and press enter...'
            isMulti
            isClearable={false}
            styles={customStyles}
            options={props.options}
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                font: '#101010',
                primary25: '#101010',
                primary: '#101010',
                neutral80: 'white',
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
