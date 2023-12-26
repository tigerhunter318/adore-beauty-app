import React from 'react'
import Container from './Container'
import Type from './Type'
import theme from '../../constants/theme'

const styleSheet = {
  tabItemText: {
    textTransform: 'uppercase',
    fontSize: 13,
    opacity: 0.5,
    letterSpacing: 1,
    marginTop: 1
  }
}

const TabBarLabel = ({ title, heading }) => (
  <Container pv={0.3}>
    <Type heading bold size={10} letterSpacing={0.77} color={theme.black}>
      {heading}
    </Type>
    <Type style={[styleSheet.tabItemText]}>{title}</Type>
  </Container>
)

const getTabBar = (title, heading = 'Shop By') => {
  const tabBarContainer = () => <TabBarLabel title={title} heading={heading} />

  return tabBarContainer
}

export default getTabBar
