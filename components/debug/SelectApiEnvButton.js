import React from 'react'
import { StyleSheet } from 'react-native'
import theme from '../../constants/theme'
import Container from '../ui/Container'
import Type from '../ui/Type'

const styles = StyleSheet.create({
  container: {
    marginBottom: 10
  },
  text: {
    color: theme.white,
    textAlign: 'center',
    paddingVertical: 10,
    fontSize: 13,
    letterSpacing: 1
  }
})

const envs = ['production', 'pre-prod', 'staging']

const SelectApiEnvButton = ({ envName, colors, onApiChange }) => {
  const unSelectedEnvs = envs.filter(env => env !== envName)

  return (
    <Container mb={0.5}>
      {unSelectedEnvs.map(env => (
        <Container
          key={`btn-${env}`}
          background={colors[env.replace('-', '')]}
          style={styles.container}
          onPress={() => onApiChange(env)}
        >
          <Type style={styles.text}>
            use{' '}
            <Type heading bold>
              {env}
            </Type>{' '}
            api
          </Type>
        </Container>
      ))}
    </Container>
  )
}

export default SelectApiEnvButton
