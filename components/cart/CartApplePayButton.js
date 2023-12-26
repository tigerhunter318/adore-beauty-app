import React, { useState } from 'react'
import { BraintreeApplePayButton } from 'react-native-braintree-payments'
import { useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import cart, { useCartItemsProductDetail, useCheckoutErrorAlert } from '../../store/modules/cart'
import { parseApiErrorMessage } from '../../store/api'
import { useScreenFocusEffect } from '../../hooks/useScreen'
import { getIn } from '../../utils/getIn'
import { filterDeliveryName } from './utils/deliveryOptions'
import { isValidName } from '../../utils/validation'
import { gaEvents } from '../../services/ga'
import { useActionState } from '../../store/utils/stateHook'
import remoteLog from '../../services/remoteLog'
import addressUtil from '../../utils/addressUtil'

import { getCartTotals } from './utils/useCartTotals'

const CartApplePayButton = ({
  disabled,
  lineItems,
  cartState,
  buttonType = 'checkout',
  enableShipping = true,
  shippingPaymentItem,
  shippingAddress,
  shippingAccount,
  storeCredits
}) => {
  const [loading, setLoading] = useState(null)
  const [clientToken, setClientToken] = useState(null)
  const [shippingMethods, setShippingMethods] = useState(null)
  const [consignment, setConsignment] = useState(null)
  const [transaction, setTransaction] = useState(null)
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(null)
  const dispatch = useDispatch()
  const checkoutErrorAlert = useCheckoutErrorAlert()
  const navigation = useNavigation()
  const cartItemsProductDetail = useCartItemsProductDetail()
  const checkoutCartData = useActionState('cart.checkout.cart')

  const isAvailable = !disabled && clientToken

  const onError = error => {
    checkoutErrorAlert(parseApiErrorMessage(error))
  }

  const fetchClientToken = async () => {
    setLoading(true)
    const clientConfig = await dispatch(cart.actions.fetchBraintreeClientConfig())
    if (clientConfig.clientToken) {
      setClientToken(clientConfig.clientToken)
    }
    setLoading(false)
  }
  const formatShippingContact = () => {
    let contact = {}
    if (shippingAccount?.email) {
      contact = {
        ...contact,
        emailAddress: shippingAccount.email
      }
    }
    if (shippingAccount?.phone) {
      contact = {
        ...contact,
        phone: shippingAccount.phone
      }
    }
    if (isValidName(shippingAccount?.first_name) && isValidName(shippingAccount?.last_name)) {
      contact = {
        ...contact,
        name: {
          givenName: shippingAccount.first_name,
          familyName: shippingAccount.last_name
        }
      }
    }
    if (shippingAddress?.phone) {
      contact = {
        ...contact,
        phone: shippingAddress.phone
      }
    }
    if (isValidName(shippingAddress?.first_name) && isValidName(shippingAddress?.last_name)) {
      contact = {
        ...contact,
        name: {
          givenName: shippingAddress.first_name,
          familyName: shippingAddress.last_name
        }
      }
    }
    if (contact.name && shippingAddress?.street_1 && shippingAddress?.state) {
      contact = {
        ...contact,
        postalAddress: {
          street: shippingAddress.street_2
            ? `${shippingAddress.street_1}\n${shippingAddress.street_2}`
            : shippingAddress.street_1,
          subLocality: '',
          city: shippingAddress.city,
          subAdministrativeArea: '',
          state: shippingAddress.state,
          postalCode: shippingAddress.post_code,
          country: shippingAddress.country,
          ISOCountryCode: 'AU'
        }
      }
    }

    return contact
  }

  const summarisePaymentItems = () => {
    const shippingItem =
      selectedShippingMethod && shippingMethods?.find(item => item.identifier === selectedShippingMethod.identifier)
    let paymentItems = lineItems.map(item => ({ label: item.name, amount: item.extended_list_price || 0 }))

    const { discountTotal, totalCost, giftCertificatesDiscount } = getCartTotals(
      cartState,
      enableShipping ? shippingItem?.amount : undefined,
      storeCredits
    )

    if (discountTotal > 0) {
      paymentItems = [...paymentItems, { name: 'discounts', label: 'Discounts', amount: -discountTotal }]
    }
    if (shippingItem) {
      paymentItems = [...paymentItems, { name: 'shipping', label: shippingItem.summary, amount: shippingItem.amount }]
    } else if (shippingPaymentItem) {
      paymentItems = [...paymentItems, shippingPaymentItem]
    }

    if (giftCertificatesDiscount) {
      paymentItems = [...paymentItems, { label: 'Gift Card', amount: `-${giftCertificatesDiscount}` }]
    }

    // https://developer.apple.com/documentation/passkit/pkpaymentrequest/1619231-paymentsummaryitems
    return [...paymentItems, { label: 'Adore Beauty', amount: totalCost }]
  }

  const handleSelectShippingContact = ({ nativeEvent: data }) => {
    const { postalAddress } = data || {}
    updateShippingMethods(postalAddress)
  }
  const updateShippingMethods = async postalAddress => {
    if (!postalAddress) return
    const payload = {
      shippingAddress: addressUtil.normaliseAddress({
        first_name: '',
        last_name: '',
        email: '',
        address1: '',
        address2: '',
        city: postalAddress.city,
        state_or_province_code: postalAddress.state,
        state_or_province: '',
        postal_code: postalAddress.postalCode,
        phone: '',
        country: postalAddress.country,
        country_code: postalAddress.ISOCountryCode
      }),
      requestConfig: {
        onError
      }
    }

    const responseData = await dispatch(cart.actions.fetchAvailableShippingOptions(payload))
    const consignmentItem = getIn(responseData, 'consignments.0')
    const shippingOptions = consignmentItem?.available_shipping_options || []
    remoteLog.addCheckoutResponseBreadcrumb('updateShippingMethods: response', 'applepay', {
      checkoutResponse: responseData
    })
    setConsignment(consignmentItem)
    setShippingMethods(
      shippingOptions.map(item => ({
        summary: filterDeliveryName(item.description),
        detail: '',
        identifier: item.id,
        amount: item.cost
      }))
    )
  }
  const handleSelectShippingMethod = ({ nativeEvent: shippingMethod }) => {
    setSelectedShippingMethod(shippingMethod)
  }
  const handleDismiss = () => {
    setSelectedShippingMethod(null)
    setShippingMethods(null)
  }
  const addAddress = async shippingContact => {
    const { name, postalAddress, emailAddress, phoneNumber } = shippingContact

    const payload = {
      address: {
        firstName: name.givenName,
        lastName: name.familyName,
        phone: phoneNumber,
        addressMeta: {
          address_line_1: postalAddress.street,
          address_line_2: postalAddress.subLocality,
          locality_name: postalAddress.city,
          state_territory: postalAddress.state,
          postcode: postalAddress.postalCode
        }
      },
      requestConfig: { onError }
    }

    const data = await dispatch(cart.actions.addAddress(payload))
    remoteLog.addCheckoutResponseBreadcrumb('addAddress', 'applepay', { checkoutResponse: data })

    if (data?.id && data?.billing_address?.id) {
      return true
    }
    return false
  }
  const handleAuthorizePayment = async ({ nativeEvent: data }) => {
    const { billingContact, shippingContact, shippingMethod, nonce, success } = data || {}
    if (success && !!nonce) {
      let shippingSuccess
      remoteLog.addCheckoutResponseBreadcrumb('handleAuthorizePayment', 'applepay', { enableShipping })
      if (enableShipping) {
        shippingSuccess = await addShippingToOrder(shippingContact, shippingMethod)
      } else {
        shippingSuccess = true
      }

      if (shippingSuccess) {
        await processPaymentTransaction(nonce)
      }
    }
  }
  const addShippingToOrder = async (shippingContact, shippingMethod) => {
    const addShippingSuccess = await addAddress(shippingContact)
    remoteLog.addCheckoutResponseBreadcrumb('addShippingToOrder', 'applepay', { addShippingSuccess })
    if (addShippingSuccess) {
      if (consignment?.id) {
        const response = await dispatch(
          cart.actions.addShippingOption({
            requestConfig: { onError },
            shippingOption: { consignmentId: consignment.id, shippingId: shippingMethod.identifier }
          })
        )
        remoteLog.addCheckoutResponseBreadcrumb('addShippingToOrder.consignment', 'applepay', {
          consignment,
          shippingMethod
        })
        remoteLog.addCheckoutResponseBreadcrumb('addShippingToOrder.response', 'applepay', {
          checkoutResponse: response
        })

        return response
      }

      // no shipping options available. may be gift card
      return true
    }
  }
  const processPaymentTransaction = async nonce => {
    const transactionData = await dispatch(
      cart.actions.processPayment({ nonce, fetchOrderOnSuccess: false, requestConfig: { onError } })
    )
    if (transactionData?.id) {
      setTransaction(transactionData)
    } else {
      setTransaction({ success: false })
    }
  }

  const handleTransactionComplete = async () => {
    if (transaction?.success && transaction?.orderId) {
      await dispatch(
        cart.actions.paymentMethod({
          type: enableShipping ? 'Apple Pay quick checkout' : 'Apple Pay'
        })
      )
      await dispatch(cart.actions.fetchOrder(transaction.orderId, transaction, true))
      gaEvents.addPaymentInfo(
        checkoutCartData,
        enableShipping ? 'Apple Pay quick checkout' : 'Apple Pay',
        cartItemsProductDetail
      )
      navigation.navigate('OrderConfirm')
    }
  }

  const handleBraintreeApiInit = ({ nativeEvent: data }) => {}

  const handleMount = () => {
    fetchClientToken()
  }

  useScreenFocusEffect(handleMount)

  return (
    <BraintreeApplePayButton
      borderRadius={0}
      width="100%"
      buttonType={buttonType}
      clientToken={clientToken}
      paymentItems={summarisePaymentItems()}
      shippingMethods={shippingMethods}
      onSelectShippingContact={handleSelectShippingContact}
      onSelectShippingMethod={handleSelectShippingMethod}
      onAuthorizePayment={handleAuthorizePayment}
      onTransactionComplete={handleTransactionComplete}
      transaction={transaction}
      onDismiss={handleDismiss}
      onApiInit={handleBraintreeApiInit}
      disabled={!isAvailable}
      opacity={isAvailable ? 1 : 0.7}
      enableShipping={enableShipping}
      shippingContact={formatShippingContact()}
      onPaymentPress={async ref => {
        setLoading(true)
        const contact = formatShippingContact()
        if (contact?.postalAddress) {
          await updateShippingMethods(contact.postalAddress)
        }
        ref.createPaymentRequest()
        setLoading(false)
      }}
    />
  )
}

export default CartApplePayButton
