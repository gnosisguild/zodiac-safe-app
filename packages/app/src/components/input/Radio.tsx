import { makeStyles } from '@material-ui/core/styles'
import { Radio as MUIRadio, RadioProps } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.text.secondary,
    '&:hover': {
      background: 'none',
    },
  },
}))

export const Radio = ({ ...props }: RadioProps) => {
  const classes = useStyles()

  return (
    <MUIRadio
      disableFocusRipple
      disableRipple
      disableTouchRipple
      color='default'
      {...props}
      classes={{ root: classes.root }}
    />
  )
}
