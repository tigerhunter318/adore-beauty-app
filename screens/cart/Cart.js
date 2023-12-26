import React, { useState, useRef } from 'react'
import { ScrollView, Alert } from 'react-native'
import { ForterActionType, forterSDK } from 'react-native-forter'
import { useIsFocused } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import theme from '../../constants/theme'
import cart, { useCart, useCartLineItems, useCartQuantity, useCartItemsProductDetail } from '../../store/modules/cart'
import customer from '../../store/modules/customer'
import { gaEvents } from '../../services/ga'
import { emarsysEvents } from '../../services/emarsys/emarsysEvents'
import CartHeaderMenu from '../../components/cart/CartHeaderMenu'
import CartPriceBar from '../../components/cart/CartPriceBar'
import { useActionState } from '../../store/utils/stateHook'
import envConfig from '../../config/envConfig'
import { useWishlistItems } from '../../store/modules/wishlists'
import SafeScreenView from '../../components/ui/SafeScreenView'
import ScreenInputView from '../../components/ui/ScreenInputView'
import SocietyJoinModal from '../../components/society/SocietyJoinModal'
import { isIos } from '../../utils/device'
import { getRemoteConfigBoolean, getRemoteConfigNumber } from '../../services/useRemoteConfig'
import remoteLog from '../../services/remoteLog'
import { useScreenFocusEffect } from '../../hooks/useScreen'
import CartTabs from './CartTabs'
import { isValidArray } from '../../utils/validation'
import branchEvents from '../../services/branch/branchEvents'
import { formatDate, utcToAestTime } from '../../utils/date'
import { isApplePayEnabled } from '../../services/paymentMethods'
import useCustomerAddresses from '../../store/modules/hooks/useCustomerAddresses'

const styleSheet = {
  cartRow: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.borderColor
  },
  scrollView: {
    height: '100%',
    backgroundColor: theme.backgroundLightGrey
  }
}

const Cart = ({ navigation, route }) => {
  const [isValidatingItems, setIsValidatingItems] = useState(false) // prevent multiple alerts
  const checkoutCartData = useActionState('cart.checkout.cart')
  const isPending = useActionState('cart.request.pending')
  const productPending = useActionState('cart.productPending')
  const lineItems = useCartLineItems()
  const cartItemsProductDetail = useCartItemsProductDetail()
  const wishlistItems = useWishlistItems()
  const cartQuantity = useCartQuantity()
  const cartItemsInventory = useActionState('cart.cartItemsInventory')
  const giftCertificates = useActionState('cart.giftCertificates')
  const customerAccount = useActionState('customer.account')
  const shouldShowSocietyJoinModal = useActionState('customer.shouldShowSocietyJoinModal')
  const dispatch = useDispatch()
  const hasItems = isValidArray(lineItems)
  const cartDetails = useCart()
  const isFocused = useIsFocused()
  const { defaultAddress, accountDefaults } = useCustomerAddresses()
  const scrollViewRef = useRef()
  const tabName = route?.params?.tabName || 'bag'
  const isSingleGiftCard = lineItems?.length === 1 && lineItems[0]?.name === 'Gift Certificate'
  const minSpend = isSingleGiftCard ? 0 : getRemoteConfigNumber('minimum_spend')
  const isBelowMinimum = parseFloat(cartDetails?.grand_total) < minSpend
  const expressPostInfo = {
    isEnabled: getRemoteConfigBoolean('express_post_enabled'),
    minAmount: getRemoteConfigNumber('express_post_min_amount')
  }

  const onStockErrorMessage = unavailableItems => {
    const title = 'Sorry, but some of the items in your order are no longer available'
    let message = '\n'
    message += unavailableItems?.map(item => item?.name?.split(' -')[1])?.join('\n\n')
    message +=
      '\n\nPlease adjust the quantity on items that may apply. We have automatically removed any sold out items.'

    return Alert.alert(
      title,
      message,
      [{ text: 'OK', onPress: async () => dispatch(cart.actions.removeInvalidCartItems()) }],
      { cancelable: false }
    )
  }

  const onInvalidGiftCertificatesErrorMessage = (validGiftCertificates, invalidGiftCertificates) => {
    const title = `The following gift ${invalidGiftCertificates.length === 1 ? 'card is' : 'cards are'} no longer valid`
    let message = '\n'
    message += invalidGiftCertificates.map(certificate => certificate.code).join('\n\n')
    return Alert.alert(
      title,
      message,
      [{ text: 'OK', onPress: async () => dispatch(cart.actions.updateValidGiftCertificates(validGiftCertificates)) }],
      { cancelable: false }
    )
  }

  const handleTabPress = name => navigation.setParams({ tabName: name })

  const forterTrackCartData = () => {
    if (envConfig.isForterEnabled && checkoutCartData) {
      const cartIDObj = {
        type: 'bccid',
        cartId: checkoutCartData && checkoutCartData.id
      }
      forterSDK.trackActionWithJSON(ForterActionType.OTHER, cartIDObj)
    }
  }

  const validateCartItems = async () => {
    if (!isPending && checkoutCartData?.id && !isValidatingItems) {
      setIsValidatingItems(true)

      if (cartDetails?.grand_total === 0) {
        await dispatch(cart.actions.deleteCheckout())
      }

      await dispatch(cart.actions.fetchCartItemsInventory())
      const unavailableItems = await dispatch(cart.actions.getUnavailableCartItems())
      const invalidGiftItems = await dispatch(cart.actions.getInvalidGiftItems())
      const { valid: validGiftCertificates, invalid: invalidGiftCertificates } = await dispatch(
        cart.actions.getInvalidGiftCertificates()
      )

      if (isValidArray(invalidGiftCertificates)) {
        onInvalidGiftCertificatesErrorMessage(validGiftCertificates, invalidGiftCertificates)
      }

      if (isValidArray(unavailableItems)) {
        onStockErrorMessage(unavailableItems)
      }
      if (isValidArray(invalidGiftItems)) {
        await dispatch(cart.actions.removeInvalidCartItems())
      }

      setIsValidatingItems(false)

      if (!isValidArray(unavailableItems) && !isValidArray(invalidGiftItems)) {
        return true
      }
    }
    return false
  }

  const handleCheckout = async () => {
    const isValidCart = await validateCartItems()

    if (isValidCart) {
      trackCheckout()
      remoteLog.addBreadcrumb({
        category: 'cart',
        message: 'checkoutCartData',
        data: {
          created_time_local: formatDate(utcToAestTime(checkoutCartData?.created_time), null),
          created_time_utc: checkoutCartData?.created_time,
          json: JSON.stringify(checkoutCartData)
        }
      })
      navigation.push('CartCheckoutDeliveryAddress')
    }
  }

  const handleCartQuantityChange = () => {
    validateCartItems()
  }

  const trackCheckout = async () => {
    gaEvents.beginCheckout(checkoutCartData, cartItemsProductDetail)
    branchEvents.trackCheckout({
      cart: checkoutCartData,
      products: cartItemsProductDetail,
      lineItems,
      customerAccount
    })
  }
  const trackViewCart = async () => {
    gaEvents.viewCart(checkoutCartData, cartItemsProductDetail)
    branchEvents.trackViewCart({
      cart: checkoutCartData,
      products: cartItemsProductDetail,
      lineItems,
      customerAccount
    })
  }

  const handleScreenFocus = () => {
    dispatch(cart.actions.deleteOrderData())

    if (!productPending) {
      emarsysEvents.trackCart(lineItems, cartItemsProductDetail)
      if (hasItems) {
        trackViewCart()
        forterTrackCartData()
      }
    }
  }

  const handleCloseSocietyModal = () => {
    dispatch(customer.actions.shouldShowSocietyJoinModal(false))
  }

  const handleCouponAddedToCart = () => {
    scrollViewRef?.current?.scrollTo({
      x: 0,
      y: 0,
      animated: true
    })
  }

  useScreenFocusEffect(handleCartQuantityChange, [cartQuantity, giftCertificates])
  useScreenFocusEffect(handleScreenFocus, [cartItemsProductDetail, productPending])

  if (!isFocused) return null

  return (
    <SafeScreenView flex={1} testID="CartScreen">
      <CartHeaderMenu
        lineItems={lineItems}
        wishlistItems={wishlistItems}
        onPressItem={handleTabPress}
        activeTab={tabName}
        cartQuantity={cartQuantity}
      />
      <ScreenInputView keyboardVerticalOffset={84} style={{ flex: 1 }} enabled={isIos()}>
        <ScrollView
          style={styleSheet.scrollView}
          keyboardShouldPersistTaps="handled"
          ref={scrollViewRef}
          testID="CartScreen.ScrollView"
        >
          <CartTabs
            tabName={tabName}
            bagItems={cartItemsInventory || lineItems}
            hasItems={hasItems}
            isBelowMinimum={isBelowMinimum}
            minSpend={minSpend}
            navigation={navigation}
            isPending={isPending}
            cartQuantity={cartQuantity}
            cartDetails={cartDetails}
            expressPostInfo={expressPostInfo}
            onCouponAddedToCart={handleCouponAddedToCart}
          />
        </ScrollView>
      </ScreenInputView>
      {!!cartDetails && tabName === 'bag' && (
        <CartPriceBar
          hasLogos
          hasApplePay={isApplePayEnabled()}
          data={cartDetails}
          lineItems={cartItemsInventory || lineItems}
          onButtonPress={handleCheckout}
          buttonDisabled={isBelowMinimum}
          buttonTestID="Cart.ButtonCheckoutSecurely"
          icon="lock"
          defaultShippingContact={accountDefaults}
          defaultShippingAddress={defaultAddress}
        />
      )}
      <SocietyJoinModal
        navigation={navigation}
        isVisible={isFocused && shouldShowSocietyJoinModal}
        onClose={handleCloseSocietyModal}
      />
    </SafeScreenView>
  )
}

export default Cart
