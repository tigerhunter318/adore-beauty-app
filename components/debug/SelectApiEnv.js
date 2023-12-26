import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet, Switch } from 'react-native'
import RNRestart from 'react-native-restart'
import * as Sentry from '@sentry/react-native'
import Type from '../ui/Type'
import Container from '../ui/Container'
import theme from '../../constants/theme'
import {
  clearAsyncStorage,
  deleteAsyncStorageItem,
  getAsyncStorageItem,
  setAsyncStorageItem
} from '../../utils/asyncStorage'
import stagingJson from '../../config/config.staging.json'
import preProdJson from '../../config/config.preprod.json'
import { resetRemoteConfigCache } from '../../services/useRemoteConfig'
import SelectApiEnvButton from './SelectApiEnvButton'
import envConfig, { versionName } from '../../config/envConfig'
import UrlNavigationTest from './UrlNavigationTest'
// import CartDebugTests from './CartDebugTests'
import Icon from '../ui/Icon'
import { isHermesEnabled } from '../../utils/device'
import CustomButton from '../ui/CustomButton'
import { apolloClient } from '../../services/apollo/apollo'
import { now } from '../../utils/date'

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 3,
    borderBottomWidth: 3,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    backgroundColor: theme.white,
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 20
  },
  closeBtnContainer: {
    position: 'absolute',
    top: 12,
    right: 20
  },
  api: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
    letterSpacing: 1
  },
  versionName: {
    textAlign: 'center',
    paddingVertical: 10
  },
  uriContainer: {
    paddingTop: 10,
    paddingBottom: 15,
    paddingLeft: 10
  },
  uri: {
    fontSize: 12,
    color: theme.lightBlack,
    lineHeight: 24
  },
  testsContainer: {
    justifyContent: 'center',
    paddingTop: 15
  },
  testButton: {
    bold: true,
    background: theme.black,
    color: theme.white
  },
  title: {
    color: theme.lightBlack,
    textAlign: 'center',
    paddingTop: 15,
    letterSpacing: 1,
    textTransform: 'uppercase'
  }
})

const colors = {
  production: '#169b16',
  preprod: '#1a535c',
  staging: '#fa6521'
}

const DebugButton = ({ onPress = () => {}, background = 'white', children, ...rest }) => (
  <CustomButton
    width={150}
    mr={1}
    background={background}
    bold
    fontSize={12}
    borderWidth={1}
    onPress={onPress}
    {...rest}
  >
    {children}
  </CustomButton>
)

const SelectApiEnv = () => {
  const [envName, setEnvName] = useState(null)
  const [toggle, setToggle] = useState(true)
  const [partnerizeLogging, setPartnerizeLogging] = useState(false)

  const handleChangeApi = async newEnvName => {
    if (newEnvName === 'production') {
      // use default config
      await deleteAsyncStorageItem('ENV_CONFIG', true)
    } else if (newEnvName === 'pre-prod') {
      await setAsyncStorageItem('ENV_CONFIG', preProdJson)
    } else {
      await setAsyncStorageItem('ENV_CONFIG', stagingJson)
    }
    await resetRemoteConfigCache()
    Alert.alert('ENV changed', `App will restart with ${newEnvName} config`, [
      { text: 'OK', onPress: () => RNRestart.Restart() }
    ])
  }

  const handleToggle = () => setToggle(!toggle)

  const handleLoadConfig = () => {
    const loadConfig = async () => {
      if (envConfig.apiUri.includes('www')) {
        setEnvName('production')
      } else if (envConfig.apiUri.includes('preprod')) {
        setEnvName('pre-prod')
      } else {
        setEnvName('staging')
      }
      const partnerizeDebug = await getAsyncStorageItem('partnerizeDebug')
      if (partnerizeDebug?.enableLogging) {
        setPartnerizeLogging(true)
      } else {
        setPartnerizeLogging(false)
      }
    }
    loadConfig()
  }

  const togglePartnerizeLogging = async enable => {
    setPartnerizeLogging(enable)
    if (enable) {
      setAsyncStorageItem('partnerizeDebug', { enableLogging: true })
    } else {
      clearAsyncStorage('partnerizeDebug')
    }
  }
  const handlePartnerizeLoggingChange = val => {
    togglePartnerizeLogging(val)
  }

  const logApolloCache = () => {
    console.info('apolloClient cache', apolloClient().extract())
  }
  /**
   * https://www.apollographql.com/docs/react/networking/authentication/#reset-store-on-logout
   */
  const clearApolloCache = () => {
    apolloClient().clearStore()
    logApolloCache()
  }

  useEffect(handleLoadConfig, [])

  let borderColor = colors.production

  if (envName === 'pre-prod') {
    borderColor = colors.preprod
  } else if (envName === 'staging') {
    borderColor = colors.staging
  }

  if (toggle)
    return (
      <Container onPress={handleToggle} border={borderColor} style={styles.container}>
        <Type style={styles.api} color={borderColor}>
          using{' '}
          <Type bold heading>
            {envName}
          </Type>{' '}
          api
        </Type>
        <Container onPress={handleToggle} style={styles.closeBtnContainer}>
          <Icon name="ios-arrow-down" size={24} type="ion" color={theme.lightBlack} />
        </Container>
      </Container>
    )

  return (
    <Container>
      <Container onPress={handleToggle} border={borderColor} style={styles.container}>
        <Container onPress={handleToggle} style={styles.closeBtnContainer}>
          <Icon name="ios-arrow-up" size={24} type="ion" color={theme.lightBlack} />
        </Container>
        <Type style={styles.api} color={borderColor}>
          using{' '}
          <Type bold heading>
            {envName}
          </Type>{' '}
          api
        </Type>
        <Type style={styles.versionName} pv={2}>
          <Type semiBold>{!!envConfig.jiraId && envConfig.jiraId}</Type> - {versionName()}
        </Type>
        <SelectApiEnvButton envName={envName} colors={colors} onApiChange={handleChangeApi} />
        <Container>
          <Container border={theme.lighterBlack} />
          <Type bold style={styles.title} mb={1}>
            GraphQL
          </Type>
          <Container rows justify="center" align="center">
            <DebugButton onPress={clearApolloCache}>Clear cache</DebugButton>
            <DebugButton ml={1} background="black" onPress={logApolloCache}>
              Log cache
            </DebugButton>
          </Container>
        </Container>
        <Container border={theme.lighterBlack} mt={2} />
        <Container>
          <Container border={theme.lighterBlack} />
          <Type bold style={styles.title} mb={1}>
            Partnerize
          </Type>
          <Container rows justify="space-between" align="center">
            <Type bold={partnerizeLogging}>Enable purchase logging</Type>
            <Switch value={partnerizeLogging} onValueChange={handlePartnerizeLoggingChange} />
          </Container>
        </Container>
        <Container border={theme.lighterBlack} mt={2} />
        <Container>
          <Container border={theme.lighterBlack} />
          <Type bold style={styles.title} mb={1}>
            Sentry
          </Type>
          <Container rows justify="center" align="center">
            <DebugButton
              onPress={() => {
                throw new Error(`TestError ${now()}`)
              }}
            >
              Trigger error
            </DebugButton>
            <DebugButton
              ml={1}
              background="black"
              onPress={() => {
                Sentry.nativeCrash()
              }}
            >
              Trigger crash
            </DebugButton>
          </Container>
        </Container>
        <Container border={theme.lighterBlack} mt={2} />
        <Container>
          <Type bold style={styles.title}>
            TESTS
          </Type>
          <Container style={styles.testsContainer}>
            <UrlNavigationTest buttonStyle={styles.testButton} />
            {/* <CartDebugTests buttonStyle={styles.testButton} /> */}
          </Container>
        </Container>
        <Container border={theme.lighterBlack} mt={1} />
        <Type bold style={styles.title}>
          References
        </Type>
        <Container style={styles.uriContainer}>
          <Type style={styles.uri}>
            <Type semiBold>API (JSON) -</Type> {envConfig.apiUri}
          </Type>
          <Type style={styles.uri}>
            <Type semiBold>HASURA -</Type> {envConfig.hasuraUri}
          </Type>
          <Type style={styles.uri}>
            <Type semiBold>GRAPHQL -</Type> {envConfig.graphUri}
          </Type>
          <Type style={styles.uri}>
            <Type semiBold>SITE -</Type> {envConfig.siteUrl}
          </Type>
          <Type style={styles.uri}>
            <Type semiBold>HERMES -</Type> {isHermesEnabled() ? `true` : `false`}
          </Type>
        </Container>
      </Container>
    </Container>
  )
}

export default SelectApiEnv
