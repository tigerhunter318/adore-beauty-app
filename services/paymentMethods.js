import { ReactNativeBraintreePayments } from 'react-native-braintree-payments'
import envConfig from '../config/envConfig'
import { getRemoteConfigItem } from './useRemoteConfig'
import { isIos } from '../utils/device'

export const getActivePaymentMethods = () => {
  const items = [
    {
      id: 'credit-paypal',
      name: 'Credit Card / Paypal',
      icons: ['ccard', 'ccpaypal'],
      isEnabled: true
    },
    {
      id: 'applepay',
      name: 'Applepay',
      icons: ['applepay'],
      isEnabled: isApplePayEnabled()
    },
    {
      id: 'afterpay',
      name: 'Afterpay',
      icons: ['afterpay'],
      isEnabled: envConfig.isAfterpayEnabled
    },
    {
      id: 'klarna',
      name: 'Klarna',
      icons: ['klarna'],
      isEnabled: envConfig.isKlarnaEnabled
    }
  ]
  const disabledMethods = getRemoteConfigItem('disabled_payment_methods')
  if (disabledMethods) {
    items.forEach((item, i) => {
      if (disabledMethods.includes(item.id)) {
        items[i].isEnabled = false
      }
    })
  }
  return items
}

export const isPaymentMethodEnabled = activePaymentMethod =>
  getActivePaymentMethods()?.find(paymentMethod => paymentMethod.id === activePaymentMethod)?.isEnabled

export const isApplePayEnabled = () => isIos() && envConfig.isAppleEnabled

export const canMakeApplePayments = async () => {
  if (isApplePayEnabled()) {
    const available = await ReactNativeBraintreePayments.canMakeApplePayments()
    return available
  }
  return false
}
