import React from 'react'
import { makeStyles, Typography } from '@material-ui/core'
import { ZodiacPaper } from 'zodiac-ui-components'

interface DisplayFieldProps {
  label: string
  value?: string
}

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    borderRadius: 8,
  },
  label: {
    marginBottom: theme.spacing(0.5),
  },
  field: {
    padding: theme.spacing(1, 0, 1, 1),
  },
}))

export const DisplayField: React.FC<DisplayFieldProps> = ({ label, value }) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Typography noWrap className={classes.label}>
        {label}
      </Typography>
      <ZodiacPaper
        borderStyle='double'
        className={classes.field}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <Typography noWrap>{value}</Typography>
      </ZodiacPaper>
    </div>
  )
}
