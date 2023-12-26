import { uid } from 'uid'
import { sha256 } from 'js-sha256'
import { getAsyncStorageItem, setAsyncStorageItem } from './asyncStorage'

const storeName = 'algolia.userToken'

export const generateUserToken = async () => {
  const data = await getAsyncStorageItem(storeName)

  if (!data?.token) {
    const obj = {
      token: uid(32)
    }
    await setAsyncStorageItem(storeName, obj)
  }
}

export const getUserToken = async () => {
  const data = await getAsyncStorageItem(storeName)

  if (!data?.token) {
    const token = uid(32)
    const obj = { token }
    await setAsyncStorageItem(storeName, obj)
    return token
  }

  return data?.token
}

export const setUserToken = async email => {
  const obj = { token: sha256(email) }
  await setAsyncStorageItem(storeName, obj)
}
