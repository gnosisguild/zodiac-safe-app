import React from 'react'
import { makeStyles, PaperProps } from '@material-ui/core'
import { ZodiacPaper } from 'zodiac-ui-components'
import classNames from 'classnames'

interface CustomPaperProps extends Omit<PaperProps, 'content'> {
  content?: React.ReactElement
}
interface CollapsableProps extends CustomPaperProps {
  open?: boolean
  containerClassName?: string
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    transition: '0.2s ease all',
    '& + &': {
      marginTop: theme.spacing(2),
    },
    '&:hover': {
      background: 'rgba(217, 212, 173, 0.15)',
    },
  },
  content: {
    marginTop: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
}))

export const Collapsable: React.FC<CollapsableProps> = ({
  open = false,
  content,
  children,
  className,
  containerClassName,
  ...props
}) => {
  const classes = useStyles()
  return (
    <ZodiacPaper
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
      {...props}
      borderStyle='double'
      className={classNames(classes.root, className)}
    >
      {children}
      {content ? (
        <div
          className={classNames(classes.content, containerClassName, {
            [classes.hide]: !open,
          })}
        >
          {content}
        </div>
      ) : null}
    </ZodiacPaper>
  )
}
