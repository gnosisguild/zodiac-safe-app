import React from 'react'
import { makeStyles, Typography } from '@material-ui/core'
import { ZodiacPaper } from 'zodiac-ui-components'
import { Skeleton } from '@material-ui/lab'
import { useRootSelector } from '../../store'
import { getCurrentPendingModule, getSafeThreshold } from '../../store/modules/selectors'
import { ContractInteractionsPreview } from './contract/ContractInteractionsPreview'
import { getModuleContractMetadata } from '../../utils/modulesValidation'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(2.5),
    maxWidth: 500,
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  header: {
    display: 'grid',
    gridTemplateColumns: '50px auto',
    gridGap: theme.spacing(2),
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
  addressText: {
    margin: theme.spacing(0, 2, 0, 3),
    fontWeight: 'bold',
  },
  icon: {
    marginLeft: '16px',
  },
  buttons: {
    marginTop: theme.spacing(3),
    opacity: 0.5,
  },
}))

function ModulePendingInstantTx() {
  const currentPendingTx = useRootSelector(getCurrentPendingModule)

  if (!currentPendingTx) return null

  const metadata = getModuleContractMetadata(currentPendingTx.module)

  if (!metadata || !metadata.abi) return null

  return (
    <ContractInteractionsPreview address={currentPendingTx.address} abi={metadata.abi as any} />
  )
}

export const ModulePendingTransaction: React.FC = () => {
  const classes = useStyles()
  const safeThreshold = useRootSelector(getSafeThreshold)
  const isInstantExecution = safeThreshold === 1

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Skeleton variant='circle' width={50} height={50} />
        <Skeleton variant='rect' width={380} height={20} />
      </div>

      {!isInstantExecution ? (
        <ZodiacPaper
          borderStyle='double'
          className={classes.paper}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <Typography variant='h5' className={classes.title}>
            Waiting on module approval
          </Typography>
          <Typography>
            Once this module transaction has been approved by the other signers, you will be able to
            read and write to it.
          </Typography>
        </ZodiacPaper>
      ) : (
        <ModulePendingInstantTx />
      )}
    </div>
  )
}
