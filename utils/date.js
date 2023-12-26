import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import duration from 'dayjs/plugin/duration'
import isSameOrAfterPlugin from 'dayjs/plugin/isSameOrAfter'
import isSameOrBeforePlugin from 'dayjs/plugin/isSameOrBefore'
import { format } from 'date-fns'
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz'
import * as RNLocalize from 'react-native-localize'
import envConfig from '../config/envConfig'

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(customParseFormat)
dayjs.extend(duration)
dayjs.extend(isSameOrAfterPlugin)
dayjs.extend(isSameOrBeforePlugin)

export const DATE_FORMAT = 'DD-MMM-YYYY'

export const formatDate = (input, dateFormat = DATE_FORMAT) => input && dayjs(input).format(dateFormat)

const getUtcToZonedTime = (timestamp, fromTimezone = envConfig.timezone, toTimezone) => {
  const utcTime = zonedTimeToUtc(Number(timestamp) * 1000, fromTimezone)
  return utcToZonedTime(utcTime, toTimezone || getLocalTimezone())
}

export const formatTimestamp = (timestamp, dateFormat, fromTimezone, toTimezone) => {
  if (fromTimezone) {
    return formatDate(getUtcToZonedTime(timestamp, fromTimezone, toTimezone), dateFormat)
  }
  return formatDate(Number(timestamp) * 1000, dateFormat)
}

export const isBeforeTimestamp = (timestamp, fromTimezone = envConfig.timezone) =>
  dayjs(getUtcToZonedTime(timestamp, fromTimezone)).isBefore(now())

export const getLocalTimezone = () => RNLocalize.getTimeZone()

export const fromNow = input => input && dayjs(input).fromNow()

export const secondsFromNow = input => {
  if (input) {
    const fromtime = dayjs(input)
    return utcNow().diff(fromtime) / 1000
  }
}

export const monthsFromNow = (input, withDecimal = false) => {
  if (input) {
    const fromtime = dayjs(input)
    return utcNow().diff(fromtime, 'month', withDecimal)
  }
}

export const utcNow = () => dayjs.utc() // .unix()

export const now = formatTemplate => dayjs().format(formatTemplate)

export const unixTimeStamp = () => utcNow().unix()

export const differenceWithNow = (dateString, unit = 'second') => dateString && dayjs().diff(dateString, unit)

/**
 * timezone function dont work on android.
 * suggested solutions dont work with hermes
 * // https://stackoverflow.com/questions/41736735/react-native-and-intl-polyfill-required-on-android-device/41935101#41935101
 * resolved in rn 65+
 *
 * @param input
 * @returns {string|Date}
 */
export const utcToAestTime = input => {
  try {
    return input && utcToZonedTime(input, 'Australia/Melbourne')
  } catch (error) {
    console.warn('utcToAestTime:error', error)
    return ''
  }
}

export const aestToUtcTime = input => {
  try {
    return input && zonedTimeToUtc(input, 'Australia/Melbourne')
  } catch (error) {
    console.warn('aestToUtcTime:error', error)
    return ''
  }
}

export const formatDispatchTime = input => input && format(input, 'h:mma')

/**
 * //mm:ss
 * expect(formatDuration(3)).toEqual('00:03')
 * // total minutes
 * expect(formatDuration(3660, 'm')).toEqual('61')
 *
 * @param secs
 * @param dateFormat
 * @returns {string}
 */
export const formatDuration = (secs, dateFormat = 'mm:ss') => {
  const input = dayjs.duration(secs * 1000)
  const mins = Math.floor(input.asMinutes()).toString()
  if (dateFormat === 's') {
    return Math.floor(input.asSeconds()).toString()
  }
  if (dateFormat === 'm') {
    return mins
  }
  if (mins >= 60 && (dateFormat === 'mm:ss' || dateFormat === 'm:ss')) {
    return `${mins}:${input.format('ss')}`
  }
  return input.format(dateFormat)
}

export const isSameOrBefore = input => input && dayjs(input).isSameOrBefore(now())

export const isSameOrAfter = input => input && dayjs(input).isSameOrAfter(now())
