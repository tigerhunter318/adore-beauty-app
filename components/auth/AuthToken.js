import React, { useEffect } from 'react'
import { View } from 'react-native'
import useAsyncEffect from 'use-async-effect'
import { useDispatch } from 'react-redux'
import dayjs from 'dayjs'
import cart from '../../store/modules/cart'
import customer from '../../store/modules/customer'
import { useActionState } from '../../store/utils/stateHook'

const AuthToken = ({ launchArguments }) => {
  const tokenExpireTime = useActionState('customer.account.token_valid_until')
  const tokenRefreshAt = useActionState('customer.account.token_refresh_at')

  const dispatch = useDispatch()
  const onLoad = async () => {
    dispatch(cart.actions.fetchStoredCheckout())
    dispatch(customer.actions.fetchStoredCustomer())
    dispatch(customer.actions.fetchStoredConsent())
    try {
      launchArguments.onAppReady({ dispatch })
    } catch (error) {
      //
    }
  }
  const logExpiryTime = () => {
    const now = dayjs().unix()
    const toDateString = ms => ms && dayjs(ms * 1000).format()
    console.info(
      'logExpiryTime',
      'time now-',
      toDateString(now),
      'refresh at-',
      tokenRefreshAt,
      toDateString(tokenRefreshAt),
      'expires at-',
      toDateString(tokenExpireTime)
    )
  }
  /**
   * refresh only if the token has a token_refresh_at value
   */
  const checkTokenRefreshTime = () => {
    // logExpiryTime()
    if (tokenRefreshAt) {
      const now = dayjs().unix()
      if (now > tokenRefreshAt) {
        handleRefreshToken()
      }
    }
  }
  const handleRefreshToken = () => {
    dispatch(customer.actions.authRefresh())
  }
  const initInterval = () => {
    const interval = setInterval(checkTokenRefreshTime, 120 * 1000)
    return () => clearInterval(interval)
  }
  useEffect(initInterval, [tokenRefreshAt])
  useAsyncEffect(onLoad, [])
  return <View />
}

export default AuthToken
