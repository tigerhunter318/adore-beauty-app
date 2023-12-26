import React, { useState, useEffect } from 'react'
import { ScrollView } from 'react-native'
import * as Animatable from 'react-native-animatable'
import { useDispatch } from 'react-redux'
import theme from '../../constants/theme'
import cart, {
  useCart,
  useCartLineItems,
  useCartItemsProductDetail,
  useCheckoutErrorAlert
} from '../../store/modules/cart'
import CartPriceBar from '../../components/cart/CartPriceBar'
import Type from '../../components/ui/Type'
import Container from '../../components/ui/Container'
import { formatDate } from '../../utils/date'
import { formatCurrency } from '../../utils/format'
import FieldSet from '../../components/ui/FieldSet'
import { useActionState } from '../../store/utils/stateHook'
import RadioInput from '../../components/ui/RadioInput'
import { gaEvents } from '../../services/ga'
import { tealiumEvents } from '../../services/tealium'
import { useScreenFocusEffect } from '../../hooks/useScreen'
import SafeScreenView from '../../components/ui/SafeScreenView'
import envConfig from '../../config/envConfig'
import { isValidArray } from '../../utils/validation'
import { filterAvailableDeliveryOptions, filterDeliveryName } from '../../components/cart/utils/deliveryOptions'
import Loading from '../../components/ui/Loading'
import useCartTotals from '../../components/cart/utils/useCartTotals'

const styleSheet = {
  screen: {
    flex: 1
  },
  container: {},
  cartRow: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.borderColor
  },
  scrollView: {
    backgroundColor: 'rgba(221,221,221,0.26)'
  }
}

const fadeIn = {
  from: {
    opacity: 0
  },
  to: {
    opacity: 1
  }
}

const DeliveryInfoBlock = ({ checked, onPress, data }) => {
  const dateFormat = 'DD MMM YYYY'
  const { cost, description, dateFrom, dateTo } = data
  return (
    <Animatable.View animation={fadeIn} duration={500}>
      <Container ph={2} pv={1.5}>
        <RadioInput onPress={onPress} checked={checked} id={data.id} name={description}>
          <Container rows justify="space-between" ph={1}>
            <Container flex={1}>
              <Type heading semiBold={checked} letterSpacing={1} size={12}>
                {filterDeliveryName(description)}
              </Type>
            </Container>
            <Type heading semiBold={checked}>
              {cost ? formatCurrency(cost) : 'FREE'}
            </Type>
          </Container>
        </RadioInput>
        {dateFrom && dateTo && (
          <Container background={theme.lightYellow} mt={1}>
            <Type heading size={12} ph={1} pv={1} center>
              Estimated Arrival {formatDate(dateFrom, dateFormat)} - {formatDate(dateTo, dateFormat)}
            </Type>
          </Container>
        )}
      </Container>
    </Animatable.View>
  )
}

const DeliveryBlocks = ({ type, availableOptions, onItemPress, selectedOption }) =>
  availableOptions &&
  filterAvailableDeliveryOptions(availableOptions, type).map(o => (
    <DeliveryInfoBlock
      key={o.id}
      data={o}
      onPress={onItemPress}
      checked={selectedOption && selectedOption.id === o.id}
    />
  ))

const CartCheckoutDeliveryOptions = ({ navigation }) => {
  const dispatch = useDispatch()
  const [deliveryOption, setDeliveryOption] = useState(null)
  const cartDetails = useCart()
  const lineItems = useCartLineItems()
  const cartItemsProductDetail = useCartItemsProductDetail()
  const consignmentId = useActionState('cart.checkout.consignments.0.id')
  const availableOptions = useActionState('cart.checkout.consignments.0.available_shipping_options')
  const checkoutCartData = useActionState('cart.checkout.cart')
  const checkoutErrorAlert = useCheckoutErrorAlert()
  const giftCertificates = useActionState('cart.checkout.cart.line_items.gift_certificates')
  const giftCertificatesApplied = useActionState('cart.giftCertificates')
  const isPending = useActionState('cart.request.pending')
  const selectedShippingOption = useActionState('cart.checkout.consignments.0.selected_shipping_option')

  const isFormValid = () => isValidArray(availableOptions) && !!deliveryOption?.id

  let shippingCost = 0

  if (isFormValid()) {
    const obj = availableOptions.find(o => o.id === deliveryOption.id)
    if (obj) {
      shippingCost = obj.cost
    }
  }

  const { totalCost } = useCartTotals({ shippingCost })

  const navigateToNextScreen = async () => {
    if (giftCertificatesApplied && totalCost === 0) {
      dispatch(cart.actions.paymentMethod({ type: 'gift certificate' }))
      navigation.push('CartPayment')
      return
    }

    if (!envConfig.isAfterpayEnabled && !envConfig.isKlarnaEnabled) {
      dispatch(cart.actions.paymentMethod({ type: 'credit-paypal' }))
      navigation.push('CartPayment')
    } else {
      navigation.push('CartPaymentMethod')
    }
  }

  const handleNextPress = async () => {
    const onError = () => checkoutErrorAlert()

    const payload = {
      shippingOption: { consignmentId, shippingId: deliveryOption.id },
      requestConfig: { onError }
    }

    const checkoutData = await dispatch(cart.actions.addShippingOption(payload))

    if (checkoutData) {
      gaEvents.addShippingInfo(checkoutCartData, deliveryOption, shippingCost, cartItemsProductDetail)
    }

    navigateToNextScreen()
  }

  const handleOptionSelect = data => setDeliveryOption(data)

  const onInitialLoading = () => {
    if (cartDetails && cartItemsProductDetail) {
      tealiumEvents.checkoutApp(cartDetails, lineItems, 2, cartItemsProductDetail)
    }
  }

  const handleDeliveryOptions = () => {
    if (!isValidArray(availableOptions) && isValidArray(giftCertificates)) {
      navigateToNextScreen()
    } else if (!isValidArray(availableOptions)) {
      navigation.goBack()
    } else if (!deliveryOption && selectedShippingOption) {
      setDeliveryOption(selectedShippingOption)
    } else if (!deliveryOption && isValidArray(availableOptions)) {
      setDeliveryOption(availableOptions[0])
    }
  }

  useEffect(handleDeliveryOptions, [deliveryOption, availableOptions, navigation, selectedShippingOption])
  useScreenFocusEffect(onInitialLoading, [cartDetails, lineItems, cartItemsProductDetail])

  if (isPending) return <Loading lipstick />

  return (
    <SafeScreenView flex={1}>
      <ScrollView style={styleSheet.scrollView} keyboardShouldPersistTaps="handled">
        <FieldSet ph={2} pv={2}>
          <Type heading bold size={13} letterSpacing={1} testID="CartCheckoutDeliveryOptions.title">
            Choose a Delivery Option
          </Type>
        </FieldSet>
        <Container pt={1}>
          <DeliveryBlocks
            type="free"
            availableOptions={availableOptions}
            selectedOption={deliveryOption}
            onItemPress={handleOptionSelect}
          />
          <DeliveryBlocks
            type="flat"
            availableOptions={availableOptions}
            selectedOption={deliveryOption}
            onItemPress={handleOptionSelect}
          />
        </Container>
      </ScrollView>
      <CartPriceBar
        data={cartDetails}
        shippingCost={shippingCost}
        buttonLabel="Add delivery option"
        buttonTestID="CartCheckoutDeliveryOptions.ButtonProceedToPayment"
        onButtonPress={handleNextPress}
        buttonDisabled={!isFormValid()}
      />
    </SafeScreenView>
  )
}

export default CartCheckoutDeliveryOptions
