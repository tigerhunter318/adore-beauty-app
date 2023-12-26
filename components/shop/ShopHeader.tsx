import React from 'react'
import { StyleSheet } from 'react-native'
import { useSidebarContext } from '../sidebar/SidebarContext'
import { gaEvents } from '../../services/ga'
import { getFocusedRouteStateFromNavigation } from '../../navigation/utils/navigationUtils'
import Header from '../ui/Header'
import Container from '../ui/Container'
import Type from '../ui/Type'
import theme from '../../constants/theme'

const styles = StyleSheet.create({
  tabItem: {
    borderBottomColor: theme.borderColor,
    borderBottomWidth: 1,
    height: 55
  },
  tabItemText: {
    textTransform: 'uppercase',
    fontSize: 13,
    opacity: 0.5,
    letterSpacing: 1,
    color: theme.black
  }
})

type ShopTabItemProps = { name: string; onPress: () => void }

const ShopTabItem = ({ name, onPress }: ShopTabItemProps) => (
  <Container
    flex={1}
    pv={1}
    style={styles.tabItem}
    onPress={onPress}
    testID={`ShopTabItem.${name.toUpperCase()}`}
    align
  >
    <Container>
      <Type size={10} bold heading letterSpacing={0.77} color={theme.black} pb={0.1} pt={0.3}>
        Shop By
      </Type>
      <Type style={styles.tabItemText}>{name}</Type>
    </Container>
  </Container>
)

const ShopTabs = ({ navigation }: any) => {
  const tabs = [
    { name: 'CATEGORY', screen: 'category', active: false },
    { name: 'BRAND', screen: 'brand', active: true },
    { name: 'CONCERN', screen: 'concern', active: false }
  ]

  const handleTabChange = ({ screen }: { screen: string }) => {
    gaEvents.trackShopBy(screen)
    navigation.navigate('MainTab', {
      screen: 'Shop',
      params: {
        screen: 'ShopTabs',
        params: {
          screen
        }
      }
    })
  }

  return (
    <Container rows background="white" testID="ShopTabs">
      {tabs.map(obj => (
        <ShopTabItem name={obj.name} key={obj.name} onPress={() => handleTabChange(obj)} />
      ))}
    </Container>
  )
}

const getActiveRouteScreenTitle = ({ name, activeRouteTitle }: any) => name || activeRouteTitle

type ShopHeaderProps = {
  navigation: object
  hasBack?: boolean
  hasSearch?: boolean
  title?: any
  showTabNav?: boolean
  showLogo?: boolean
}

const ShopHeader = ({
  navigation,
  hasBack,
  hasSearch,
  title = 'Shop',
  showTabNav,
  showLogo = false
}: ShopHeaderProps) => {
  const { rightState } = useSidebarContext()
  const focusedRoute = getFocusedRouteStateFromNavigation(navigation)
  const activeRouteTitle = getActiveRouteScreenTitle(focusedRoute?.params || {})
  const headerTitle = !showLogo ? activeRouteTitle || title : null

  return (
    <Header
      title={headerTitle}
      hasBack={hasBack}
      hasSearch={hasSearch}
      right={rightState && rightState.component}
      onRightPress={rightState && rightState.onRightPress}
    >
      {showTabNav && <ShopTabs navigation={navigation} />}
    </Header>
  )
}

export default ShopHeader
