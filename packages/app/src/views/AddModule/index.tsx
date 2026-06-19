import React, { useState } from 'react'
import { makeStyles, Typography } from '@material-ui/core'
import { ZodiacPaper } from 'zodiac-ui-components'
import { ModuleButton } from './ModuleButton'
import { useRootDispatch, useRootSelector } from '../../store'
import { getModulesList } from '../../store/modules/selectors'
import { ModuleModals } from './wizards/ModalWizards'
import { ModuleType } from '../../store/modules/models'
import {
  fetchPendingModules,
  setModuleAdded,
  setOzGovernorModuleScreen,
  setRealityModuleScreen,
} from '../../store/modules'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { NETWORK } from 'utils/networks'
import { klerosAvailability } from 'components/input/ArbitratorSelect'
import { getMastercopyAddress } from 'utils/zodiac'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1.5),
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2.5, 2),
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  introBox: {
    gridColumn: '1/3',
    '@media (max-width:930px)': {
      gridColumn: '1/2',
    },
  },
  firstModule: {
    gridColumn: 1,
  },
  link: {
    color: theme.palette.text.primary,
  },
}))

export const AddModulesView = () => {
  const classes = useStyles()
  const dispatch = useRootDispatch()
  const { safe } = useSafeAppsSDK()
  const hasModules = useRootSelector((state) => getModulesList(state).length > 0)
  const [module, setModule] = useState<ModuleType>()

  const handleSubmit = () => {
    dispatch(fetchPendingModules(safe))
    dispatch(setModuleAdded(true))
  }

  const selectModule = (module: ModuleType) => {
    setModule(module)
  }

  const closeModule = () => {
    setModule(undefined)
  }

  const title = hasModules ? 'Add another mod' : 'Start by adding a mod'

  return (
    <div className={classes.root}>
      <div className={classes.gridContainer}>
        <div className={classes.introBox}>
          <ZodiacPaper
            variant='outlined'
            className={classes.paper}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <Typography variant='h5' className={classes.title}>
              {title}
            </Typography>
            <Typography variant='body2'>
              Built according to an open standard, the Zodiac collection of tools are mods that
              support, expand, and transform how organizations operate. Learn more about Zodiac in{' '}
              <a
                href='https://gnosisguild.mirror.xyz/OuhG5s2X5uSVBx1EK4tKPhnUc91Wh9YM0fwSnC8UNcg'
                target='_blank'
                rel='noopener noreferrer'
                className={classes.link}
              >
                this article
              </a>{' '}
              and about Gnosis Safe modules more generally in{' '}
              <a
                href='https://help.gnosis-safe.io/en/articles/4934378-what-is-a-module'
                target='_blank'
                rel='noopener noreferrer'
                className={classes.link}
              >
                this article
              </a>
              .
            </Typography>
          </ZodiacPaper>
        </div>

        <ModuleButton
          title='Bridge Module'
          description='Enables an address on one chain to control an avatar on another chain using an Arbitrary Message Bridge (AMB)'
          icon='bridge'
          onClick={() => selectModule(ModuleType.BRIDGE)}
          className={classes.firstModule}
          available={!!getMastercopyAddress(ModuleType.BRIDGE)}
        />

        <ModuleButton
          title='Delay Modifier'
          description='Enables a time delay between when a module initiates a transaction and when it can be executed'
          icon='delay'
          onClick={() => selectModule(ModuleType.DELAY)}
          available={!!getMastercopyAddress(ModuleType.DELAY)}
        />

        <ModuleButton
          title='Exit Module'
          description='Enables participants to redeem a designated token for a proportional share of this account’digital assets'
          icon='exit'
          onClick={() => selectModule(ModuleType.EXIT)}
          available={!!getMastercopyAddress(ModuleType.EXIT)}
        />

        <ModuleButton
          title='Roles Modifier'
          description='Allows avatars to enforce granular, role-based, permissions for attached modules'
          icon='roles'
          onClick={() => selectModule(ModuleType.ROLES_V2)}
          available={!!getMastercopyAddress(ModuleType.ROLES_V2)}
        />

        <ModuleButton
          title='Reality Module Wizard'
          description='Use a wizard to enable on-chain execution based on the outcome of events reported by the Reality.eth oracle'
          icon='reality'
          onClick={() => dispatch(setRealityModuleScreen(true))}
          available={[NETWORK.MAINNET, NETWORK.SEPOLIA, NETWORK.BASE].includes(safe.chainId)}
        />

        <ModuleButton
          title='Reality Module'
          description='Enables on-chain execution based on the outcome of events reported by the Reality.eth oracle'
          icon='reality'
          onClick={() => selectModule(ModuleType.REALITY_ETH)}
          available={[NETWORK.MAINNET, NETWORK.SEPOLIA, NETWORK.BASE].includes(safe.chainId)}
        />

        <ModuleButton
          title='Kleros Snapshot Module'
          description='Execute transactions for successful Snapshot proposals using Reality.eth, secured by Kleros.'
          icon='reality'
          onClick={() => selectModule(ModuleType.KLEROS_REALITY)}
          available={klerosAvailability.includes(safe.chainId)}
        />

        <ModuleButton
          title='Tellor Module'
          description='Enables on-chain execution of successful Snapshot proposals reported by the Tellor oracle'
          icon='tellor'
          onClick={() => selectModule(ModuleType.TELLOR)}
          available={!!getMastercopyAddress(ModuleType.TELLOR)}
        />

        <ModuleButton
          title='UMA oSnap Module'
          description="Enables on-chain execution of successful Snapshot proposals utilizing UMA's optimistic oracle."
          icon='optimisticGov'
          onClick={() => selectModule(ModuleType.OPTIMISTIC_GOVERNOR)}
          available // TODO
        />

        <ModuleButton
          title='Governor Module'
          description='Enables an Open Zeppelin Governor contract as a module.'
          icon='ozGov'
          onClick={() => dispatch(setOzGovernorModuleScreen(true))}
          available={!!getMastercopyAddress(ModuleType.OZ_GOVERNOR)}
        />

        <ModuleButton
          title='Connext Module'
          description='Enables an address on one chain to control an avatar on another chain using Connext as the messaging layer.'
          icon='connext'
          onClick={() => selectModule(ModuleType.CONNEXT)}
          available={!!getMastercopyAddress(ModuleType.CONNEXT)}
        />

        <ModuleButton
          title='Roles Modifier v1'
          description='Legacy version of the Roles Modifier'
          icon='roles'
          deprecated
          onClick={() => selectModule(ModuleType.ROLES_V1)}
          available={!!getMastercopyAddress(ModuleType.ROLES_V1)}
        />

        <ModuleButton
          title='Custom Module'
          description='Enable a custom contract as a module'
          icon='custom'
          onClick={() => selectModule(ModuleType.UNKNOWN)}
          available
        />
      </div>

      <ModuleModals selected={module} onClose={closeModule} onSubmit={handleSubmit} />
    </div>
  )
}

export default AddModulesView
