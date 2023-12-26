import { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { clearAsyncStorage } from '../utils/asyncStorage'
import cart from '../store/modules/cart'
import { isIos } from '../utils/device'
import { guestAddress } from '../e2e/mockdata'

const ReactNativeLaunchLaunchArguments = Platform.OS === 'ios' ? require('react-native-launch-arguments') : {} // eslint-disable-line global-require

const useLaunchArguments = () => {
  const [state, setState] = useState(null)

  const getArgs = () => {
    if (isIos()) {
      return ReactNativeLaunchLaunchArguments?.LaunchArguments?.value() || {}
    }
    return {}
  }

  const handleLaunchArguments = async () => {
    const args = getArgs()
    if (args.clearAsyncStorage) {
      await clearAsyncStorage()
    }
    setState(args)
  }

  const onAppReady = async ({ dispatch }) => {
    const args = getArgs()
    if (args.useTestDeliveryAddress) {
      await dispatch(cart.actions.billingAddress(guestAddress()))
    }
  }

  useEffect(() => {
    handleLaunchArguments()
  }, [])

  if (state) {
    return { state, onAppReady }
  }
}

export default useLaunchArguments
