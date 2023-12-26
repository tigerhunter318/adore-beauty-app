import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { isValidArray } from '../../utils/validation'
import Container from './Container'
import Type from './Type'
import theme from '../../constants/theme'

const styles = StyleSheet.create({
  tabText: {
    fontSize: 13,
    letterSpacing: 1,
    lineHeight: 18,
    textTransform: 'uppercase'
  },
  borderStyle: {
    borderBottomWidth: 1.5,
    borderColor: theme.black
  },
  hiddenStyle: {
    height: 0,
    opacity: 0
  }
})

const TabTile = ({ name, isActiveTab, onPress }) => (
  <Container flex={1} pb={1.2} ph={1} onPress={onPress} style={isActiveTab && styles.borderStyle}>
    <Type style={styles.tabText} center color={isActiveTab ? theme.black : theme.tabTextColor} semiBold={isActiveTab}>
      {name}
    </Type>
  </Container>
)

export const TabsTiles = ({ tabsTiles, activeTab, onPress, containerStyle }) => (
  <Container rows style={[{ marginBottom: 10 }, containerStyle]}>
    {tabsTiles.map((title, index) => (
      <TabTile name={title} key={index} isActiveTab={activeTab === title} onPress={() => onPress(title)} />
    ))}
  </Container>
)

const MultiTabs = ({ tabsTiles, renderTabContent, containerStyle = {} }) => {
  const [activeTab, setActiveTab] = useState('')

  const onMount = () => {
    if (isValidArray(tabsTiles) && !activeTab) {
      setActiveTab(tabsTiles[0])
    }
  }

  useEffect(onMount, [tabsTiles])

  if (!isValidArray(tabsTiles)) return null

  return (
    <Container>
      <TabsTiles tabsTiles={tabsTiles} activeTab={activeTab} onPress={setActiveTab} containerStyle={containerStyle} />
      {renderTabContent(activeTab)}
    </Container>
  )
}

export default MultiTabs
