import { Share } from 'react-native'
import { gaEvents } from '../services/ga'

export const share = async (contentType, id, message) => {
  try {
    const result = await Share.share({
      message
    })
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
        gaEvents.shareEvent(contentType, result.activityType, id)
      } else {
        // shared
        gaEvents.shareEvent(contentType, result.action, id)
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    alert(error.message)
  }
}
