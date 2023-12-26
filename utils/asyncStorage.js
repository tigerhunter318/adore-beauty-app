import AsyncStorage from '@react-native-async-storage/async-storage'

export const getAsyncStorageItem = async key => {
  const string = await AsyncStorage.getItem(key)

  if (string) {
    try {
      const json = JSON.parse(string)
      return json
    } catch (error) {
      // Error retrieving data
      console.warn('getItem', 'error', error)
    }
  } else {
    return null
  }
}

export const setAsyncStorageItem = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.warn('setAsyncStorageItem', 'error', error)
  }
}

export const deleteAsyncStorageItem = async key => {
  try {
    await AsyncStorage.removeItem(key)
  } catch (error) {
    console.warn('deleteAsyncStorageItem', 'error', error)
  }
}

export const clearAsyncStorage = async () => {
  // await SecureStore.clear()
  // ENV_CONFIG
  // in_app_review_info
  // cart.cart
  // customer
  // cart.billingAddress
  // algolia.userToken
  await deleteAsyncStorageItem('cart.cart', true)
  await deleteAsyncStorageItem('customer', true)
}
