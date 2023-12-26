// main index.js
import React from 'react'
import { findNodeHandle, NativeModules, requireNativeComponent, UIManager } from 'react-native'
import PropTypes from 'prop-types'

export const { ReactNativeBraintreePayments } = NativeModules

const NativeViewName = 'PKPaymentButtonView'
const PKPaymentButtonView = requireNativeComponent(NativeViewName, null)

export class BraintreeApplePayButton extends React.Component {
  handlePaymentPress = this.props.onPaymentPress ? () => this.props.onPaymentPress(this) : undefined

  callNativeMethod = (method, params = []) => {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this),
      UIManager.getViewManagerConfig(NativeViewName).Commands[method],
      params
    )
  }

  createPaymentRequest = () => this.callNativeMethod('createPaymentRequest')

  render() {
    return <PKPaymentButtonView {...this.props} onPaymentPress={this.handlePaymentPress} />
  }
}

BraintreeApplePayButton.propTypes = {
  buttonStyle: PropTypes.string,
  buttonType: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  borderRadius: PropTypes.number,
  clientToken: PropTypes.string,
  paymentItems: PropTypes.array,
  shippingMethods: PropTypes.array,
  onPress: PropTypes.func,
  onPaymentPress: PropTypes.func,
  onApiInit: PropTypes.func,
  onSelectShippingContact: PropTypes.func,
  onSelectShippingMethod: PropTypes.func,
  onAuthorizePayment: PropTypes.func,
  onTransactionComplete: PropTypes.func,
  onDismiss: PropTypes.func,
  disabled: PropTypes.bool,
  enableShipping: PropTypes.bool,
  transaction: PropTypes.object,
  shippingContact: PropTypes.object
}

BraintreeApplePayButton.defaultProps = {
  buttonStyle: 'black',
  buttonType: 'plain', // https://developer.apple.com/design/human-interface-guidelines/apple-pay/overview/buttons-and-marks/#button-types
  height: 44,
  width: 200,
  borderRadius: 4,
  onPress: undefined,
  onPaymentPress: undefined
}
