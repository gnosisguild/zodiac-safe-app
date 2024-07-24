import { Button, ButtonProps, makeStyles } from '@material-ui/core'
import React from 'react'
import classNames from 'classnames'

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.secondary.main,
  },
  queryButton: {
    textTransform: 'none',
    fontSize: 16,
    '&.MuiButton-contained.Mui-disabled': {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.common.white,
    },
    '&.MuiButton-outlinedSecondary.Mui-disabled': {
      color: theme.palette.common.white,
      borderColor: theme.palette.common.white,
    },
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  outlined: {
    color: theme.palette.common.white,
    padding: theme.spacing(0.75, 2),
    borderColor: 'rgba(217, 212, 173, 0.3)',
    transition: '0.2s ease all',
    '&::before': {
      borderColor: 'rgba(217, 212, 173, 0.3)',
    },
    '&:hover': {
      background: 'rgba(217, 212, 173, 0.15)',
      borderColor: 'rgba(217, 212, 173, 0.3)',
    },
  },
}))

export const ActionButton: React.FC<ButtonProps> = ({ classes, className, ...props }) => {
  const _classes = useStyles()
  return (
    <Button
      color='secondary'
      variant='contained'
      classes={{
        disabled: _classes.buttonDisabled,
        outlined: _classes.outlined,
        ...classes,
      }}
      disableRipple
      className={classNames(_classes.queryButton, className)}
      {...props}
    />
  )
}
