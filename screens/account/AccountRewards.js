import React, { useRef, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { ScrollView, StyleSheet } from 'react-native'
import { useRoute } from '@react-navigation/core'
import dayjs from 'dayjs'
import LinearGradient from 'react-native-linear-gradient'

import Container from '../../components/ui/Container'
import Type, { DEFAULT_FONT } from '../../components/ui/Type'
import AccountRewardsPieChart from '../../components/account-rewards/AccountRewardsPieChart'
import AccountRewardsProgressBar from '../../components/account-rewards/AccountRewardsProgressBar'
import AccountRewardsReferral from '../../components/account-rewards/AccountRewardsReferral'
import AccountRewardsTabs from '../../components/account-rewards/AccountRewardsTabs'
import theme from '../../constants/theme'
import Button from '../../components/ui/Button'
import Loading from '../../components/ui/Loading'
import Hr from '../../components/ui/Hr'
import customer from '../../store/modules/customer'
import { useActionState } from '../../store/utils/stateHook'
import { useScreenFocusEffect } from '../../hooks/useScreen'
import { isIos } from '../../utils/device'
import { emarsysEvents } from '../../services/emarsys/emarsysEvents'

// const LinearGradient = ({ children }) => <View>{children}</View>

const gradientColors = {
  1: ['#F9E5D8', '#E7B3A3'],
  2: ['#E9EBE3', '#9DA483'],
  3: ['#F1F1F1', '#888888']
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 10
  }
})

const tiers = {
  'Level 1': 1,
  'Level 2': 2,
  'Level 3': 3
}

const scrollOffsets = [1000, 1470, 1920]

const AccountRewards = () => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const [scrollOffset, setScrollOffset] = useState(null)
  const [renderKey, setRenderKey] = useState(0)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const loyalty = useActionState('customer.loyalty')
  const account = useActionState('customer.account')
  const scrollViewRef = useRef()
  const route = useRoute()
  const level = tiers[loyalty?.summary?.tier?.name]
  const moveToNextTierPoint = loyalty?.summary?.next_tier?.points - loyalty?.summary?.points?.status
  const pointsExpiry = loyalty?.summary?.tier?.entry_at ? dayjs(loyalty?.summary?.tier?.entry_at).add(1, 'years') : null
  const isReferralAvailable = loyalty?.referrals?.[0]
  const defautTabOffset = isReferralAvailable ? 1390 : 900
  const tabOffset = level === 3 ? defautTabOffset - 180 : defautTabOffset

  const getPointsToNextLevel = () => {
    const startPoint = loyalty?.summary?.tier?.points
    const nextPoint = loyalty?.summary?.next_tier?.points
    const currentPoint = loyalty?.summary?.points?.status

    return level === 3 ? 100 : ((currentPoint - startPoint) / (nextPoint - startPoint)) * 100
  }

  const handleMyActivityPress = () => {
    if (scrollViewRef?.current) {
      setSelectedTabIndex(1)
      setTimeout(() => {
        setRenderKey((renderKey + 1) % 2)
        setScrollOffset(tabOffset)
      })
    }
  }

  const handleRewardsPress = () => {
    if (scrollViewRef?.current) {
      setSelectedTabIndex(0)
      setTimeout(() => {
        setRenderKey((renderKey + 1) % 2)
        setScrollOffset(tabOffset)
      })
    }
  }

  const handleViewBenefit = () => {
    if (scrollViewRef?.current) {
      let offset = scrollOffsets[level === 3 ? level - 1 : level]

      if (isReferralAvailable) {
        offset += 400
      }
      setSelectedTabIndex(2)
      setTimeout(() => {
        setRenderKey((renderKey + 1) % 2)
        setScrollOffset(offset)
      })
    }
  }

  const handleTabChange = tabIndex => {
    setScrollOffset(null)
    setSelectedTabIndex(tabIndex)
  }

  const onMount = () => {
    const fetchData = async () => {
      emarsysEvents.trackScreen('Adore Society Rewards screen')
      setLoading(true)
      await dispatch(customer.actions.fetchCustomerLoyalty())
      setLoading(false)

      const initialScrollOffset = route?.params?.scrollOffset
      if (initialScrollOffset) {
        setTimeout(() => {
          setScrollOffset(initialScrollOffset)
        })
      }
    }
    fetchData()
  }

  const handleScrollOffset = () => {
    if (scrollOffset) {
      scrollViewRef.current.scrollTo({
        x: 0,
        y: scrollOffset,
        animated: true
      })
    }
  }

  useEffect(handleScrollOffset, [selectedTabIndex, scrollOffset, renderKey])
  useScreenFocusEffect(onMount)

  if (loading) return <Loading lipstick />
  if (!loading && !loyalty) return <Type>No loyalty data found.</Type>

  return (
    <ScrollView style={{ flex: 1 }} ref={scrollViewRef} testID="AccountRewardsScreen">
      <Container>
        <Container pt={3.9} ph={2.7} borderRadius={2} style={isIos() ? styles.shadow : ''}>
          <LinearGradient colors={gradientColors[level]}>
            <Container pt={2.7}>
              <Type bold center size={20} letterSpacing={0} lineHeight={24}>
                Welcome {account?.first_name}
              </Type>

              <Container center mt={1}>
                <AccountRewardsPieChart level={level} />
              </Container>
              <Container center mt={2}>
                <Type heading semiBold size={16} lineHeight={19} letterSpacing={1}>
                  Spend So Far
                </Type>

                <Container rows align="flex-start" mt={1}>
                  <Type size={24} lineHeight={24}>
                    $
                  </Type>
                  <Container ml={0.5}>
                    <Type size={50} lineHeight={50}>
                      {loyalty?.summary?.points?.status}
                    </Type>
                  </Container>
                </Container>
              </Container>
              <Container align mt={1} rows justify>
                <Container mr={1.7}>
                  <Button
                    isSecondary
                    onPress={handleRewardsPress}
                    styles={{ container: { borderRadius: 2 } }}
                    textStyle={{ fontSize: 12, fontFamily: `${DEFAULT_FONT}-Bold`, letterSpacing: 0.86 }}
                  >
                    Rewards
                  </Button>
                </Container>
                <Button
                  isSecondary
                  onPress={handleMyActivityPress}
                  styles={{ container: { borderRadius: 2 } }}
                  textStyle={{ fontSize: 12, fontFamily: `${DEFAULT_FONT}-Bold`, letterSpacing: 0.86 }}
                >
                  My Activity
                </Button>
              </Container>
              <Container ph={2} mt={1.5}>
                <Hr full backgroundColor={theme.white} mb={level === 3 ? 1 : 3} />
              </Container>
              <Container center mt={1.4} pb={level === 3 ? 5.8 : 0}>
                <Type semiBold size={16} lineHeight={19} letterSpacing={1}>
                  {level === 3 ? `You're in LEVEL 3` : `SPEND TO UNLOCK LEVEL ${level + 1}*`}
                </Type>
                {level === 3 ? (
                  !!pointsExpiry && (
                    <Container mt={1}>
                      <Type size={11} lineHeight={20} color={theme.black}>
                        Membership anniversary
                      </Type>
                      <Type size={11} lineHeight={20} color={theme.black}>
                        will expire on {pointsExpiry.format('D MMM YYYY')}
                      </Type>
                    </Container>
                  )
                ) : (
                  <Container rows align="flex-start" mt={2}>
                    <Type size={24} lineHeight={24}>
                      $
                    </Type>
                    <Container ml={0.5}>
                      <Type size={50} lineHeight={50}>
                        {moveToNextTierPoint}
                      </Type>
                    </Container>
                  </Container>
                )}

                <Container align mt={level === 3 ? 1.3 : 1}>
                  <Button
                    isSecondary
                    onPress={handleViewBenefit}
                    styles={{ container: { borderRadius: 2 } }}
                    textStyle={{ fontSize: 12, fontFamily: `${DEFAULT_FONT}-Bold`, letterSpacing: 0.86 }}
                  >
                    Level {level === 3 ? 3 : level + 1} Benefits
                  </Button>
                </Container>

                {!!pointsExpiry && level !== 3 && (
                  <Container mt={1.5}>
                    <Type size={11} lineHeight={20}>
                      *Spend ${moveToNextTierPoint} by {pointsExpiry.format('D MMM YYYY')}
                    </Type>
                  </Container>
                )}
              </Container>
              {level !== 3 && <AccountRewardsProgressBar value={`${getPointsToNextLevel()}%`} level={level} />}
            </Container>
          </LinearGradient>
        </Container>
        {isReferralAvailable && (
          <AccountRewardsReferral data={loyalty.referrals[0]} color={theme[`giftIconLevel${level}`]} />
        )}
        <AccountRewardsTabs data={loyalty} onTabChange={handleTabChange} selectedTabIndex={selectedTabIndex} />
      </Container>
    </ScrollView>
  )
}

export default AccountRewards
