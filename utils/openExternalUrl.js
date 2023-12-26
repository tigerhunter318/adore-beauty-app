import { Linking } from 'react-native'
import { alertError } from '../store/api'

export const openExternalUrl = async url => {
  try {
    const supported = await Linking.canOpenURL(url)
    if (supported) {
      await Linking.openURL(url)
    }
  } catch (error) {
    alertError(error)
  }
}
