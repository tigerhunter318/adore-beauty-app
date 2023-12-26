import React from 'react'
import { StyleSheet } from 'react-native'
import dayjs from 'dayjs'
import AccountRewardsRedeemContent from './AccountRewardsRedeemContent'
import AccountRewardsMyActivityContent from './AccountRewardsMyActivityContent'
import AccountRewardsLevelsContent from './AccountRewardsLevelsContent'
import Container from '../ui/Container'
import Type, { DEFAULT_FONT } from '../ui/Type'
import theme from '../../constants/theme'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderBottomWidth: 2,
    borderBottomColor: theme.darkGrayWithOpacity
  },
  tabItem: {
    shadowOpacity: 0
  },
  tabItemActive: {
    borderColor: theme.lighterBlack,
    borderBottomWidth: 0
  },
  tabItemText: {
    color: theme.tabTextColor,
    fontSize: 12,
    letterSpacing: 0.9,
    lineHeight: 18,
    textTransform: 'uppercase',
    fontFamily: `${DEFAULT_FONT}-Regular`
  },
  tabItemTextActive: {
    color: theme.lighterBlack,
    fontSize: 12,
    letterSpacing: 0.9,
    lineHeight: 18,
    textTransform: 'uppercase',
    fontFamily: `${DEFAULT_FONT}-Bold`
  },
  innerStyle: {
    paddingVertical: 12,
    position: 'relative'
  },
  maskBorder: {
    position: 'absolute',
    height: 3,
    width: '100%',
    backgroundColor: theme.black,
    bottom: -3
  }
})

const TabItem = ({ name, active, onPress }) => {
  const containerStyle = [styles.tabItem]
  const textStyle = [styles.tabItemText]
  const innerStyle = [styles.innerStyle]

  if (active) {
    containerStyle.push(styles.tabItemActive)
    textStyle.push(styles.tabItemTextActive)
  }

  return (
    <Container flex={1} style={containerStyle} onPress={onPress}>
      <Container style={innerStyle}>
        <Type style={textStyle} numberOfLines={1} center>
          {name}
        </Type>
        {active && <Container style={styles.maskBorder} />}
      </Container>
    </Container>
  )
}

const Tabs = ({ tabTiles, activeIndex, onPress }) => (
  <Container rows background="white" style={styles.container}>
    {tabTiles &&
      tabTiles.map((title, index) => (
        <TabItem name={title} key={index} active={activeIndex === index} onPress={() => onPress(index)} />
      ))}
  </Container>
)

const AccountRewardsRewardTabs = ({ data, onTabChange, selectedTabIndex }) => {
  const renderTabContent = index => {
    switch (index) {
      case 0:
        return (
          <AccountRewardsRedeemContent
            data={data?.vouchers?.filter(voucher => dayjs().isBefore(dayjs(voucher.valid_until)))}
          />
        )
      case 1:
        return <AccountRewardsMyActivityContent data={data?.activities} />
      default:
        return <AccountRewardsLevelsContent />
    }
  }

  return (
    <Container mt={3} pb={4.4}>
      <Tabs tabTiles={['Rewards', 'My Activity', 'Levels']} activeIndex={selectedTabIndex} onPress={onTabChange} />
      {renderTabContent(selectedTabIndex)}
    </Container>
  )
}

export default AccountRewardsRewardTabs
