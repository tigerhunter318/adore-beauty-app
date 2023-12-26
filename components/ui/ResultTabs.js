import React from 'react'
import { StyleSheet } from 'react-native'
import Type from './Type'
import theme from '../../constants/theme'
import Container from './Container'
import { isValidArray } from '../../utils/validation'
import Loading from './Loading'

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    backgroundColor: theme.white,
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  tab: {
    paddingHorizontal: 10,
    paddingVertical: 11,
    marginRight: 1,
    marginLeft: 5
  },
  tabName: {
    textAlign: 'center',
    fontSize: 11,
    textTransform: 'uppercase'
  },
  tabActive: {
    backgroundColor: theme.lightYellow,
    shadowColor: theme.black,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  }
})

const ResultTab = ({ active, onPress, name, disabled = false, loading = false }) => (
  <Container style={[styles.tab, active && styles.tabActive]} onPress={onPress} disabled={disabled}>
    {loading && (
      <Container pl={2} height={10}>
        <Loading animating />
      </Container>
    )}
    {!loading && (
      <Type semiBold={active} style={styles.tabName} color={disabled ? theme.black50 : theme.black}>
        {name}
      </Type>
    )}
  </Container>
)

const ResultTabs = ({ tabs }) => {
  if (!isValidArray(tabs)) return null

  return (
    <Container style={styles.tabs}>
      {tabs.map(tab => (
        <ResultTab key={`tab-${tab.name}`} {...tab} />
      ))}
    </Container>
  )
}

export { ResultTabs }
