import React, { useState } from 'react'
import { ScrollView } from 'react-native'
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
import { getIn } from '../../utils/getIn'
import RadioInput from '../../components/ui/RadioInput'
import FieldSet from '../../components/ui/FieldSet'
import { useActionState } from '../../store/utils/stateHook'
import CartBraintreePayment from '../../components/cart/CartBraintreePayment'
import CartAfterpayPayment from '../../components/cart/CartAfterpayPayment'
import CustomButton from '../../components/ui/CustomButton'
import CartList from '../../components/cart/CartList'
import { gaEvents } from '../../services/ga'
import SafeScreenView from '../../components/ui/SafeScreenView'
import { formatDate } from '../../utils/date'
import { parseApiErrorMessage } from '../../store/api'
import { tealiumEvents } from '../../services/tealium'
import { useScreenFocusEffect } from '../../hooks/useScreen'
import useProductQuery from '../../gql/useProductQuery'
import { emarsysService } from '../../services/emarsys/emarsys'
import { smartlook } from '../../services/smartlook'
import { isValidArray } from '../../utils/validation'
import customer from '../../store/modules/customer'
import Loading from '../../components/ui/Loading'
import useCartTotals from '../../components/cart/utils/useCartTotals'

const PaymentType = ({ name, title, checked, onPress }) => (
  <FieldSet>
    <RadioInput checked={checked} onPress={onPress}>
      <Type heading size={12} pl={2}>
        {name}
      </Type>
      <Type heading size={12} pl={2}>
        {title}
      </Type>
    </RadioInput>
  </FieldSet>
)

const CartPayment = ({ navigation }) => {
  const [paymentReady, setPaymentReady] = useState(false)
  const [afterpayModalVisibility, setAfterpayModalVisibility] = useState(true)
  const [paymentResult, setPaymentResult] = useState(false)
  const dispatch = useDispatch()
  const cartDetails = useCart()
  const lineItems = useCartLineItems()
  const cartItemsProductDetail = useCartItemsProductDetail()
  const cartItemsInventory = useActionState('cart.cartItemsInventory')
  const bagItems = cartItemsInventory || lineItems
  const sku = bagItems?.map(item => item.sku)
  const { data } = useProductQuery({ sku }, 'shipping_group, shipping_group_s')
  const products = data?.products || []
  const checkoutCartData = useActionState('cart.checkout.cart')
  const paymentMethod = useActionState('cart.paymentMethod')
  const checkoutErrorAlert = useCheckoutErrorAlert()
  const account = useActionState('customer.account')
  const isPending = useActionState('cart.request.pending')
  const storeCredits = useActionState('cart.storeCredits')
  const { totalCost } = useCartTotals({ storeCredits })
  const isCreditPayment = paymentMethod?.type === 'gift certificate' || paymentMethod?.type === 'store credit'

  const handlePaymentComplete = async result => {
    const paymentType = (result || paymentResult)?.type

    if (paymentType) {
      gaEvents.addPaymentInfo(checkoutCartData, paymentType.replace('payment', '').trim(), cartItemsProductDetail)
    }

    if (account.isGuest) {
      await dispatch(customer.actions.account({ ...account, hasGuestOrder: true, isGuest: undefined }))
    }

    if (storeCredits) {
      await dispatch(cart.actions.updateStoreCredits(0))
    }

    emarsysService.resumeInAppMessages()
    navigation.navigate('OrderConfirm')
  }

  const handlePaymentChange = async evt => {
    await emarsysService.pauseInAppMessages()
    const paymentType = paymentMethod?.type
    const eventType = evt?.type

    if (paymentType === 'credit-paypal' && eventType === 'ready') {
      setPaymentResult(evt.result)
      setPaymentReady(true)
    } else if (paymentType === 'klarna' && eventType === 'ready') {
      const result = {
        ...evt.result,
        description: ''
      }
      setPaymentResult(result)
      setPaymentReady(true)
      const payload = {
        authToken: evt.result.authToken,
        requestConfig: { onError }
      }
      const response = await dispatch(cart.actions.processKlarnaPayment(payload))

      if (response) {
        handlePaymentComplete(result)
      }
    } else if (paymentType === 'afterpay' && eventType === 'ready') {
      const result = {
        ...evt.result,
        description: `expires in ${formatDate(paymentMethod.expires)}`
      }
      setPaymentResult(result)
      setPaymentReady(true)
      const payload = {
        orderToken: evt.result.orderToken,
        requestConfig: { onError }
      }
      const response = await dispatch(cart.actions.processAfterpayPayment(payload))

      if (getIn(response, 'id')) {
        handlePaymentComplete(result)
      }
    }
    smartlook.setHideScreenOff()
  }

  const handleClearPayment = () => setPaymentReady(false)

  const handleCloseModal = () => {
    setAfterpayModalVisibility(false)
    navigation.goBack()
  }

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

  const handlePayPress = async () => {
    const payload = {
      fetchOrderOnSuccess: true,
      requestConfig: { onError }
    }
    const isCardPayment = paymentMethod?.type === 'credit-paypal'
    if (isCardPayment) {
      payload.nonce = paymentResult.nonce
    }

    if (isCreditPayment || isCardPayment) {
      const transaction = await dispatch(cart.actions.processPayment(payload))

      if (transaction?.id) {
        handlePaymentComplete()
      }
    }
  }

  const handleCancel = () => navigation.goBack()

  const onInitialLoading = () => {
    if (isCreditPayment) {
      setPaymentResult(paymentMethod)
      setPaymentReady(true)
    }

    if (cartDetails && cartItemsProductDetail) {
      tealiumEvents.checkoutApp(cartDetails, lineItems, 4, cartItemsProductDetail)
    }
  }

  useScreenFocusEffect(onInitialLoading, [cartDetails, lineItems, cartItemsProductDetail])

  if (isPending) return <Loading lipstick />

  if (!isValidArray(bagItems)) return null

  return (
    <SafeScreenView flex={1}>
      <Container flex={1}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <Container>
            <CartList isQuantityChangeEnabled={false} lineItems={bagItems} products={products} />
          </Container>
        </ScrollView>
        <Container>
          {paymentReady && !isCreditPayment && (
            <Container ph={2}>
              <PaymentType title={paymentResult.description} name={paymentResult.type} checked />
              <Container rows justify>
                <CustomButton background="white" borderRadius mt={1} mb={1} onPress={handleClearPayment}>
                  Change
                </CustomButton>
              </Container>
            </Container>
          )}
          {!paymentReady &&
            paymentMethod?.type === 'credit-paypal' &&
            cartDetails?.grand_total &&
            paymentMethod?.clientConfig && (
              <CartBraintreePayment
                orderTotal={totalCost}
                clientConfig={paymentMethod.clientConfig}
                onChange={handlePaymentChange}
                onCancel={handleCancel}
              />
            )}
          {!paymentReady && paymentMethod?.type === 'afterpay' && (
            <CartAfterpayPayment
              isVisible={afterpayModalVisibility}
              onAfterpayComplete={handlePaymentChange}
              onClose={handleCloseModal}
              data={paymentMethod}
            />
          )}
          {/* {!paymentReady && paymentMethod?.type === 'klarna' && (
            <CartKlarnaPayment
              isVisible={afterpayModalVisibility}
              onKlarnaPaymentComplete={handlePaymentChange}
              onClose={handleCloseModal}
              data={paymentMethod}
            />
          )} */}
        </Container>
      </Container>
      <CartPriceBar
        data={cartDetails}
        hasTotal
        buttonLabel="Pay & Place Order"
        onButtonPress={handlePayPress}
        buttonDisabled={!paymentReady}
        storeCredits={storeCredits}
      />
    </SafeScreenView>
  )
}

export default CartPayment
