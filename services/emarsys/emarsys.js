import Emarsys from 'react-native-emarsys-wrapper'
import { useEffect, useState } from 'react'
import messaging from '@react-native-firebase/messaging'
import { emarsysEvents } from './emarsysEvents'
import useAppVisibilityState from '../../hooks/useAppVisibilityState'
import envConfig from '../../config/envConfig'
import { remoteLogError } from '../../store/modules/utils/remoteLogError'

const changeApplicationCode = applicationCode => Emarsys.changeApplicationCode(applicationCode)

const getApplicationCode = () => Emarsys.getApplicationCode()

const changeMerchantId = merchantId => Emarsys.changeMerchantId(merchantId)

const pauseInAppMessages = () => Emarsys.inApp.pause()

const resumeInAppMessages = () => Emarsys.inApp.resume()

const setContact = (fieldId, fieldValue) => Emarsys.setContact(Number(fieldId), `${fieldValue}`)

const clearContact = async () => Emarsys.clearContact()

const fetchRecommendProductsQueryLimit = (logic, query, limit) =>
  Emarsys.predict.recommendProductsQueryLimit(logic, query, limit)

const fetchRecommendProductsLimitFilters = (logic, limit, filters) =>
  Emarsys.predict.recommendProductsLimitFilters(logic, limit, filters)

const fetchRecommendProductsQueryLimitFilters = (logic, query, limit, filters) =>
  Emarsys.predict.recommendProductsQueryLimitFilters(logic, query, limit, filters)

const isRecommendedProductsEnabled = () => envConfig.emarsys?.recommendedProductsEnabled

const setEventHandler = eventHandler => Emarsys.setEventHandler(eventHandler)

export const useEmarsysService = isReady => {
  const [isTokenSet, setIsTokenSet] = useState(false)

  const initPushToken = async () => {
    try {
      let token = await Emarsys.push.pushToken()

      if (!token) {
        if (!messaging().isDeviceRegisteredForRemoteMessages) {
          await messaging().registerDeviceForRemoteMessages()
        }
        const fcmToken = await messaging().getToken()
        await Emarsys.push.setPushToken(fcmToken)
        token = await Emarsys.push.pushToken()
      }

      if (token) {
        setIsTokenSet(true)
      }
    } catch (error) {
      remoteLogError('Emarsys: initPushToken', error)
    }
  }

  useEffect(() => {
    initPushToken()
  }, [])

  useEffect(() => {
    if (isReady && isTokenSet) {
      emarsysEvents.trackAppOpen()
    }
  }, [isReady, isTokenSet])

  const { isForeground } = useAppVisibilityState()

  useEffect(() => {
    if (isReady && isForeground && isTokenSet) {
      emarsysEvents.trackAppInForeground()
    }
  }, [isReady, isForeground, isTokenSet])

  return null
}

export const emarsysService = {
  changeApplicationCode,
  getApplicationCode,
  changeMerchantId,
  pauseInAppMessages,
  resumeInAppMessages,
  setContact,
  clearContact,
  fetchRecommendProductsQueryLimit,
  fetchRecommendProductsLimitFilters,
  fetchRecommendProductsQueryLimitFilters,
  setEventHandler,
  isRecommendedProductsEnabled
}
