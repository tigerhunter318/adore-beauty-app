import remoteConfig from '@react-native-firebase/remote-config'
import { differenceInMinutes, set } from 'date-fns'
import { utcNow, utcToAestTime, aestToUtcTime, formatDispatchTime } from '../utils/date'

const getDispatchCutOffTime = () => {
  const dispatchCutOffTimeData = remoteConfig().getValue('dispatch_cut_off_time')

  if (dispatchCutOffTimeData?.asString()) {
    const deliveryTime = dispatchCutOffTimeData.asString().split(':')
    const utcTime = utcNow().format()
    const melbourneTime = utcToAestTime(utcTime)
    const timeRemaining = differenceInMinutes(
      set(new Date(melbourneTime), {
        hours: deliveryTime[0],
        minutes: deliveryTime[1],
        seconds: 0
      }),
      melbourneTime
    )
    const utcDispatchDate = formatDispatchTime(
      aestToUtcTime(
        set(new Date(), {
          hours: deliveryTime[0],
          minutes: deliveryTime[1],
          seconds: 0
        })
      )
    )

    return {
      isTimeShowable: timeRemaining > 0,
      utcDispatchDate
    }
  }

  return {
    isTimeShowable: '',
    utcDispatchDate: ''
  }
}

export default getDispatchCutOffTime
