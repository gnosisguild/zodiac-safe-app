import React from 'react'
import {
  ButtonProps as MuiButtonProps,
  Fade,
  makeStyles,
  Modal,
  Typography,
} from '@material-ui/core'
import { BadgeIcon, ZodiacPaper } from 'zodiac-ui-components'
import { BadgeIconProps } from 'zodiac-ui-components/lib/components/Icons/BadgeIcon/BadgeIcon'
import { ActionButton } from '../../../../components/ActionButton'
import { Icon } from '@gnosis.pm/safe-react-components'
import classNames from 'classnames'
import { Link } from '../../../../components/text/Link'
import { TagList } from '../../../../components/list/TagList'
import { Row } from '../../../../components/layout/Row'
import { ReactComponent as ArrowUpIcon } from '../../../../assets/icons/arrow-up-icon.svg'

interface AddModuleModalProps extends BadgeIconProps {
  open: boolean
  title: string
  description?: string
  tags?: string[]
  readMoreLink?: string
  ButtonProps?: MuiButtonProps
  warning?: React.ReactNode
  hideButton?: boolean
  children: React.ReactNode
  onAdd?(): void

  onClose?(): void
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    outline: 'none',
    maxWidth: 525,
    margin: theme.spacing(14, 1, 1, 1),
    padding: theme.spacing(2),
    backgroundColor: 'rgba(78, 72, 87, 0.8)',
  },
  modal: {
    position: 'absolute !important' as 'absolute',
    paddingBottom: theme.spacing(2),
    overflow: 'auto',
    alignItems: 'flex-start',
  },
  backdrop: {
    backdropFilter: 'blur(4px)',
  },
  description: {
    marginTop: theme.spacing(1),
  },
  gutterBottom: {
    marginBottom: theme.spacing(3),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  center: {
    justifyContent: 'center',
  },
  imageContainer: {
    marginRight: theme.spacing(2),
    minWidth: 68,
  },
  infoContainer: {
    flexGrow: 1,
  },
  readMore: {
    display: 'block',
    marginTop: theme.spacing(1.5),
    fontSize: 16,
  },
  loader: {
    display: 'block',
    margin: '0 auto',
  },
  warningIcon: {
    marginRight: theme.spacing(1),
    '& .icon-color': {
      fill: '#E0B325 !important',
    },
  },
  warningText: {
    color: '#E0B325',
  },
}))

export const AddModuleModal: React.FC<AddModuleModalProps> = ({
  open,
  title,
  description,
  onAdd,
  tags = [],
  icon,
  readMoreLink,
  onClose,
  children,
  ButtonProps,
  warning,
  hideButton = false,
}) => {
  const classes = useStyles()
  return (
    <Modal
      keepMounted
      open={open}
      onClose={onClose}
      className={classNames(classes.modal, classes.row, classes.center)}
      BackdropProps={{
        className: classes.backdrop,
      }}
    >
      <Fade in={open}>
        <ZodiacPaper
          borderStyle='double'
          className={classes.root}
          elevation={3}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <div className={classNames(classes.row, classes.gutterBottom)}>
            <BadgeIcon icon={icon} size={68} className={classes.imageContainer} />
            <div className={classes.infoContainer}>
              <Typography variant='h5' gutterBottom>
                {title}
              </Typography>

              <TagList tags={tags} />

              {description ? (
                <Typography gutterBottom className={classes.description}>
                  {description}
                </Typography>
              ) : null}

              {warning ? (
                <Row>
                  <Icon type='error' size='md' className={classes.warningIcon} />
                  <Typography variant='body1' className={classes.warningText}>
                    {warning}
                  </Typography>
                </Row>
              ) : null}

              {readMoreLink ? (
                <Link href={readMoreLink} target='_blank' className={classes.readMore}>
                  Read more here
                </Link>
              ) : null}
            </div>
          </div>

          {children ? (
            <div className={classNames({ [classes.gutterBottom]: !hideButton })}>{children}</div>
          ) : null}

          {hideButton ? null : (
            <ActionButton fullWidth startIcon={<ArrowUpIcon />} onClick={onAdd} {...ButtonProps}>
              Add Module
            </ActionButton>
          )}
        </ZodiacPaper>
      </Fade>
    </Modal>
  )
}
