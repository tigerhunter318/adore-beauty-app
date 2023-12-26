import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import cart, {
  useCart,
  useCartLineItems,
  useCartItemsProductDetail,
  useCheckoutErrorAlert
} from '../../store/modules/cart'
import CartPriceBar from '../../components/cart/CartPriceBar'
import Type from '../../components/ui/Type'
import Container from '../../components/ui/Container'
import RadioInput from '../../components/ui/RadioInput'
import FieldSet from '../../components/ui/FieldSet'
import { useActionState } from '../../store/utils/stateHook'
import SafeScreenView from '../../components/ui/SafeScreenView'
import PaymentIcon from '../../components/ui/PaymentIcon'
import { tealiumEvents } from '../../services/tealium'
import { getActivePaymentMethods } from '../../services/paymentMethods'
import { useScreenFocusEffect } from '../../hooks/useScreen'
import CartApplePayButton from '../../components/cart/CartApplePayButton'
import { parseApiErrorMessage } from '../../store/api'
import CartStoreCreditsPayment from '../../components/cart/CartStoreCreditsPayment'
import useCartTotals from '../../components/cart/utils/useCartTotals'
import theme from '../../constants/theme'
import { vh } from '../../utils/dimensions'
import { getRemoteConfigBoolean } from '../../services/useRemoteConfig'

const PaymentMethodBlock = ({ onPress, checked, data, disabled }) => (
  <FieldSet pv={1.4} ph={2}>
    <RadioInput onPress={onPress} disabled={disabled} checked={checked} id={data.id} name={data.name}>
      <Container pl={2} rows justify="flex-start" ml={1} flex={1} align>
        <Container style={{ width: 60 }} rows justify>
          {data.icons && data.icons.map(icon => <PaymentIcon name={icon} key={icon} />)}
        </Container>
        <Type heading semiBold={checked} pl={2.3} size={12} lineHeight={22} letterSpacing={1}>
          {data.name}
        </Type>
      </Container>
    </RadioInput>
  </FieldSet>
)

const CartPaymentMethod = ({ navigation }) => {
  const dispatch = useDispatch()
  const [activePaymentMethod, setActivePaymentMethod] = useState(null)
  const cartDetails = useCart()
  const lineItems = useCartLineItems()
  const cartItemsProductDetail = useCartItemsProductDetail()
  const paymentCardDetails = useActionState('cart.paymentCardDetails')
  const cartState = useActionState('cart')
  const selectedShippingOption = useActionState('cart.checkout.consignments.0.selected_shipping_option')
  const checkoutErrorAlert = useCheckoutErrorAlert()
  const paymentMethodData = getActivePaymentMethods()
  const appliedStoreCredits = useActionState('cart.storeCredits')
  const isStoreCreditEnabled = getRemoteConfigBoolean('store_credit_enabled') && !!appliedStoreCredits
  const orderId = useActionState('cart.checkoutOrder.id')
  const { totalCost } = useCartTotals({ storeCredits: appliedStoreCredits })
  const isStoreCreditPayment = appliedStoreCredits && totalCost === 0

  const onError = async error => {
    await dispatch(cart.actions.paymentMethod(null))

    let message = ''

    if (error) {
      message = parseApiErrorMessage(error)
    }
    if (error?.response?.data?.errors && !error?.response?.data?.errors?.big_commerce_error) {
      // avoid BC errors with no body
      message = error.message
    }
    checkoutErrorAlert(message)
  }

  const handleStoreCreditPress = async credit => dispatch(cart.actions.updateStoreCredits(credit))

  const handlePaymentMethodChange = data => {
    setActivePaymentMethod(prev => {
      if (prev === data.id) {
        return null
      }
      return data.id
    })
  }

  const handleNextPress = async () => {
    if (isStoreCreditPayment) {
      dispatch(cart.actions.paymentMethod({ type: 'store credit' }))
      navigation.push('CartPayment')
      return
    }

    const requestConfig = { onError }
    const response = await dispatch(cart.actions.selectPaymentMethod({ activePaymentMethod, requestConfig }))
    if (response.success) {
      navigation.navigate('CartPayment')
    }
  }

  const onMount = () => {
    if (paymentCardDetails && paymentCardDetails.cardNumber) {
      setActivePaymentMethod('credit-paypal')
    }
  }

  const onInitialLoading = () => {
    if (cartDetails && cartItemsProductDetail) {
      tealiumEvents.checkoutApp(cartDetails, lineItems, 3, cartItemsProductDetail)
    }
  }

  const handleStoreCreditAsPaymentMethod = () => {
    if (isStoreCreditPayment) {
      setActivePaymentMethod('store credit')
    } else if (!isStoreCreditEnabled && activePaymentMethod === 'store credit') {
      setActivePaymentMethod(null)
    }
  }

  const handleCartError = () => {
    const unsubscribe = navigation.addListener('beforeRemove', evt => {
      unsubscribe()
      if (orderId) {
        evt.preventDefault()
        dispatch(cart.actions.deleteOrderData())
        navigation.navigate('Cart')
      }
    })
  }

  useEffect(handleCartError, [navigation, orderId])
  useEffect(handleStoreCreditAsPaymentMethod, [isStoreCreditPayment, isStoreCreditEnabled, activePaymentMethod])
  useEffect(onMount, [paymentCardDetails])
  useScreenFocusEffect(onInitialLoading, [cartDetails, lineItems, cartItemsProductDetail])

  let paymentButton
  if (activePaymentMethod === 'applepay') {
    paymentButton = (
      <CartApplePayButton
        lineItems={lineItems}
        cartState={cartState}
        disabled={false}
        buttonType="pay"
        enableShipping={false}
        storeCredits={appliedStoreCredits}
        shippingPaymentItem={
          selectedShippingOption && {
            name: 'shipping',
            label: selectedShippingOption.description,
            amount: selectedShippingOption.cost
          }
        }
      />
    )
  }

  return (
    <SafeScreenView flex={1}>
      <Container flex={1}>
        <FieldSet pv={2} ph={2}>
          <Type heading bold size={13} letterSpacing={1} testID="CartPaymentMethod.title">
            Choose a payment method
          </Type>
        </FieldSet>
        <CartStoreCreditsPayment onStoreCreditPress={handleStoreCreditPress} isEnabled={isStoreCreditEnabled} />
        <Container
          style={{ backgroundColor: isStoreCreditPayment ? theme.backgroundLightGrey : theme.white, height: vh(100) }}
        >
          {paymentMethodData
            .filter(item => item.isEnabled)
            .map(paymentMethod => (
              <PaymentMethodBlock
                onPress={handlePaymentMethodChange}
                checked={paymentMethod.id === activePaymentMethod}
                data={paymentMethod}
                key={paymentMethod.id}
                disabled={isStoreCreditPayment}
              />
            ))}
        </Container>
      </Container>
      <CartPriceBar
        data={cartDetails}
        hasTotal
        buttonLabel="Add Payment Method"
        onButtonPress={handleNextPress}
        buttonDisabled={!activePaymentMethod}
        lineItems={lineItems}
        buttonComponent={paymentButton}
        storeCredits={appliedStoreCredits}
      />
    </SafeScreenView>
  )
}

export default CartPaymentMethod
