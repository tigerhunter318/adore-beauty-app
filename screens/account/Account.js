import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import Type from '../../components/ui/Type'
import Container from '../../components/ui/Container'
import CustomButton from '../../components/ui/CustomButton'
import { useActionState, useIsLoggedIn, useIsSocietyMember } from '../../store/utils/stateHook'
import customer from '../../store/modules/customer'
import theme from '../../constants/theme'
import AdoreSvgIcon from '../../components/ui/AdoreSvgIcon'
import IconBadge from '../../components/ui/IconBadge'
import List from '../../components/ui/List'
import VersionInfo from '../../components/ui/VersionInfo'
import FooterHyperLinks from '../../components/ui/FooterHyperLinks'
import zendesk from '../../services/zendesk'
import { emarsysEvents } from '../../services/emarsys/emarsysEvents'
import openInAppBrowser from '../../utils/openInAppBrowser'
import { formatExternalUrl, formatCurrency } from '../../utils/format'
import SocietyJoinModal from '../../components/society/SocietyJoinModal'
import { useScreenFocusEffect } from '../../hooks/useScreen'
import { getRemoteConfigItem, getRemoteConfigJson } from '../../services/useRemoteConfig'
import LoadingOverlay from '../../components/ui/LoadingOverlay'
import useUrlNavigation from '../../navigation/utils/useUrlNavigation'
import { isValidArray } from '../../utils/validation'
import useCustomerCredits from '../../components/account/hooks/useCustomerCredits'
import Loading from '../../components/ui/Loading'

const AccountCredit = ({ onPress, size = 18, title, subTitle }) => (
  <Container onPress={onPress}>
    <Type semiBold heading letterSpacing={0.5} size={size} center>
      {title}
    </Type>
    <Type heading size={10} letterSpacing={1} lineHeight={16} center>
      {subTitle}
    </Type>
  </Container>
)

const AccountCredits = () => {
  const navigation = useNavigation()
  const { activeGiftCertificates, storeCredits, isFetchPending } = useCustomerCredits()
  const hasActiveGiftCertificate = isValidArray(activeGiftCertificates)

  const handleCertificateBalancePress = () => navigation.push('AccountGiftCards')

  if (isFetchPending) {
    return (
      <Container style={{ height: 60 }} justify>
        <Loading animating />
      </Container>
    )
  }

  if (!hasActiveGiftCertificate && !storeCredits) return null

  return (
    <Container
      rows
      style={{ height: 60 }}
      align
      background={theme.backgroundGrey}
      justify={hasActiveGiftCertificate && storeCredits ? 'space-around' : 'flex-start'}
      ph={2}
    >
      {!!storeCredits && <AccountCredit title={`+ ${formatCurrency(storeCredits)}`} subTitle="Store credit" />}
      {!!storeCredits && hasActiveGiftCertificate && (
        <Container style={{ height: '60%', width: 1, backgroundColor: theme.borderColor }} />
      )}
      {hasActiveGiftCertificate && (
        <AccountCredit
          onPress={handleCertificateBalancePress}
          title={
            activeGiftCertificates.length > 1
              ? `${activeGiftCertificates.length} Gift Cards`
              : `+ ${formatCurrency(activeGiftCertificates[0]?.balance || 0)}`
          }
          subTitle={activeGiftCertificates.length > 1 ? 'Check Balance' : 'Gift Card Balance'}
          size={activeGiftCertificates.length > 1 ? 16 : 18}
        />
      )}
    </Container>
  )
}

const AccountSettings = ({ logoutPending, onLogout }) => {
  const account = useActionState('customer.account')
  const hasAccount = !!(account && account.id)

  if (!hasAccount) return null

  return (
    <Container>
      <Container ph={2} pv={2}>
        <Type light size={16} letterSpacing={1} lineHeight={24}>
          Welcome back {account.first_name}
        </Type>
        <Type bold mb={1} size={13} testID="AccountSettings.email" letterSpacing={1} lineHeight={20}>
          {account.email}
        </Type>
        <Container rows>
          <CustomButton
            onPress={onLogout}
            background="white"
            fontSize={12}
            pv={0.6}
            borderRadius={2}
            textStyle={{ letterSpacing: 1 }}
            disabled={!hasAccount || logoutPending}
          >
            Sign out
          </CustomButton>
        </Container>
      </Container>
      <AccountCredits />
    </Container>
  )
}

const AccountNavItem = ({ item: { iconName, badgeText, name, buttonText, route, width = 20, height = 20 } }) => {
  const isSocietyMember = useIsSocietyMember()

  return (
    <Container rows align key={`AccountNavItem-${name}`}>
      <Container style={{ width: 40 }} center>
        <Container>
          <AdoreSvgIcon name={iconName} height={height} width={width} />
          {badgeText && <IconBadge text={badgeText} fontSize={10} width={16} />}
        </Container>
      </Container>
      <Container rows align ml={1}>
        <Type size={12} heading letterSpacing={1}>
          {name}{' '}
          {!isSocietyMember && route === 'AccountRewards' && (
            <Type bold color={theme.black}>
              - JOIN NOW
            </Type>
          )}
          {isSocietyMember && route === 'AccountRewards' && 'Rewards'}
        </Type>
        {buttonText && (
          <CustomButton
            label={buttonText}
            ml={1.75}
            fontSize={10}
            bold
            pv={0.5}
            borderRadius={2}
            background={theme.orange}
          />
        )}
      </Container>
    </Container>
  )
}

const Account = ({ navigation }) => {
  const [activeModalName, setActiveModalName] = useState('')
  const [logoutPending, setLogoutPending] = useState(false)
  const dispatch = useDispatch()
  const account = useActionState('customer.account')
  const isSocietyMember = useIsSocietyMember()
  const shouldShowSocietyJoinModal = useActionState('customer.shouldShowSocietyJoinModal')
  const wishlists = useActionState('wishlists.wishlists')
  const customerOrders = useActionState('cart.customerOrders')
  const isLoggedIn = useIsLoggedIn()
  const isFocused = useIsFocused()
  const urlNavigation = useUrlNavigation()
  const accountReturnsLink = getRemoteConfigItem('account_returns_link')
  const referFriendLink = getRemoteConfigItem('refer_friend_link')
  const accountMenuItems = getRemoteConfigJson('account_menu_items')
  const { activeGiftCertificates } = useCustomerCredits()

  let navItems = [
    { name: 'My Account', iconName: 'diamond', route: 'AccountProfile' },
    {
      name: 'Adore Society',
      iconName: 'Society',
      route: 'AccountRewards',
      modal: 'SocietyJoinModal',
      width: 50
    },
    {
      name: 'Refer a friend',
      iconName: 'ShareGift',
      route: 'ReferAFriend',
      modal: 'SocietyJoinModal',
      width: 40
    },
    { name: 'Wishlist', iconName: 'heart', route: 'AccountWishlist' },
    {
      name: 'Orders',
      route: 'AccountOrders',
      iconName: 'Bag',
      badgeText: '-'
    },
    { name: 'Gift Cards', iconName: 'GiftCard', route: 'AccountGiftCards', width: 32, height: 18 },
    { name: 'Addresses', iconName: 'address', route: 'AccountAddresses' },
    { name: 'Payments & Credits', iconName: 'lock', disabled: true },
    { name: 'Reviews', iconName: 'half-star', disabled: true },
    { name: 'Stock Alters', iconName: 'speech', disabled: true },
    { name: 'Returns', iconName: 'returns' }
  ]

  navItems.find(o => o.name === 'Wishlist').badgeText = wishlists?.length || null
  navItems.find(o => o.name === 'Orders').badgeText = customerOrders?.length || null

  if (!isValidArray(activeGiftCertificates)) {
    navItems = navItems.filter(item => item.route !== 'AccountGiftCards')
  }

  if (isValidArray(accountMenuItems)) {
    navItems = navItems.concat(accountMenuItems)
  }

  const handleItemPress = async item => {
    if (item.name === 'Returns' && accountReturnsLink) {
      await urlNavigation.push(accountReturnsLink)
      return
    }

    if (item.route) {
      if (item.route === 'AccountRewards' && !isSocietyMember) {
        setActiveModalName(item.modal)
        return
      }

      if (item.route === 'ReferAFriend') {
        if (isSocietyMember) {
          navigation.push('AccountRewards', { scrollOffset: 700 })
        } else {
          urlNavigation.push(referFriendLink)
        }
        return
      }
      navigation.push(item.route)
    } else if (item.webview) {
      await openInAppBrowser(formatExternalUrl(item.webview))
    } else if (item.link) {
      await urlNavigation.push(item.link)
    } else if (item.type === 'zendesk') {
      emarsysEvents.trackCustomEvent('customerSupport')
      zendesk.startChat({
        name: account?.full_name || '',
        email: account?.email || '',
        phone: account?.default_phone || ''
      })
    }
  }

  const handleCloseSocietyModal = async () => {
    dispatch(customer.actions.shouldShowSocietyJoinModal(false))
    setActiveModalName(null)
  }

  const handleLogout = async () => {
    setLogoutPending(true)
    await dispatch(customer.actions.logout())
    setLogoutPending(false)
    navigation.navigate('Shop')
  }

  useScreenFocusEffect(() => {
    if (!isLoggedIn) {
      navigation.navigate('Home')
    }
  }, [isLoggedIn])

  return (
    <Container flex={1} testID="AccountScreen">
      <LoadingOverlay active={logoutPending} lipstick />
      <List
        items={navItems.filter(item => !item.disabled)}
        renderItem={AccountNavItem}
        onItemPress={handleItemPress}
        flatList
        scrollEnabled
        ListHeaderComponent={<AccountSettings onLogout={handleLogout} logoutPending={logoutPending} />}
        contentContainerStyle={{ flexGrow: 1 }}
        ListFooterComponentStyle={{ flexGrow: 1 }}
        ListFooterComponent={
          <>
            <Container pt={2} ph={4} rows justify>
              <FooterHyperLinks />
            </Container>
            <Container pb={1} pt={1} flex={1} justify="flex-end">
              <VersionInfo style={{ bottom: 0, left: 15, position: 'relative' }} />
            </Container>
          </>
        }
      />
      <SocietyJoinModal
        navigation={navigation}
        isVisible={activeModalName === 'SocietyJoinModal' || (isFocused && shouldShowSocietyJoinModal)}
        onClose={handleCloseSocietyModal}
      />
    </Container>
  )
}

export default Account
