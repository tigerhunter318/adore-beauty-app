import useAsyncEffect from 'use-async-effect'
import BraintreeDropIn from 'react-native-braintree-dropin-ui'
import { Alert } from 'react-native'
import envConfig from '../../config/envConfig'
import remoteLog from '../../services/remoteLog'
import { smartlook } from '../../services/smartlook'

const CartBraintreePayment = ({ onChange, onCancel, orderTotal, clientConfig = {} }) => {
  const handleMount = async () => {
    smartlook.setHideScreenOn()
    try {
      const options = {
        ...envConfig.braintree,
        ...clientConfig, // overwrite app config with config from api
        orderTotal: `${orderTotal}`
      }
      const result = await BraintreeDropIn.show(options)

      if (result.nonce) {
        onChange({ type: 'ready', result })
      }
    } catch (error) {
      const title = 'Sorry, but there was an issue processing your payment'
      const isUserCancellation = error?.code === 'USER_CANCELLATION'
      if (isUserCancellation) {
        return onCancel()
      }

      remoteLog.logError('CartBraintreePayment', error)
      Alert.alert(title, (error?.message || '').toString())
    }
    smartlook.setHideScreenOff()
  }
  const handleUnMount = () => {}

  useAsyncEffect(handleMount, handleUnMount, [])
  return null
}

export default CartBraintreePayment
