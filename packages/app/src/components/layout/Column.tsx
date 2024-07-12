import { HTMLProps } from 'react'
import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'

type ColumnProps = HTMLProps<HTMLDivElement>

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
}))

export const Column = ({ className, ...props }: ColumnProps) => {
  const classes = useStyles()
  return <div className={classNames(classes.root, className)} {...props} />
}
