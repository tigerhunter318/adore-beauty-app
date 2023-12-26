import dayjs from 'dayjs'
import envConfig from '../../config/envConfig'
import {
  aestToUtcTime,
  formatDate,
  formatDuration,
  formatTimestamp,
  getLocalTimezone,
  isBeforeTimestamp,
  now,
  unixTimeStamp,
  utcNow,
  utcToAestTime
} from '../date'

describe('date tests', () => {
  it('format seconds durations to valid format', () => {
    // expect(formatTimeMMSS(60 * 61)).toEqual('61:00')

    expect(formatDuration(3)).toEqual('00:03')
    expect(formatDuration(60)).toEqual('01:00')
    expect(formatDuration(60, 'm:ss')).toEqual('1:00')
    expect(formatDuration(60 * 3 + 30)).toEqual('03:30')
    expect(formatDuration(60 * 61)).toEqual('61:00')
    expect(formatDuration(60 * 61 + 3)).toEqual('61:03')
    expect(formatDuration(60 * 103)).toEqual('103:00')
    expect(formatDuration(60 * 1000)).toEqual('1000:00')

    expect(formatDuration(3, 'ss')).toEqual('03')
    expect(formatDuration(3, 's')).toEqual('3')
    expect(formatDuration(60 * 45, 'm')).toEqual('45')
    expect(formatDuration(60 * 61, 'm')).toEqual('61')
    expect(formatDuration(45, 'm')).toEqual('0')
    expect(formatDuration(61, 'm')).toEqual('1')
    expect(`${formatDuration(60 * 45, 'm')} min`).toEqual('45 min')
  })

  it('can format local time to utc', () => {
    const utcTime = '2022-03-16T00:34:05.000Z'
    const localTime = '2022-03-16T11:34:05+11:00'
    expect(aestToUtcTime(localTime).toISOString()).toEqual(utcTime)
  })
  it('can format utc time to local time', () => {
    const utcTime = '2022-03-16T00:34:05.000Z'
    const localTime = '2022-03-16 11:34:05'
    expect(formatDate(utcToAestTime(utcTime), 'YYYY-MM-DD HH:m:ss')).toEqual(localTime)
  })

  it('can get local timezone', () => {
    expect(getLocalTimezone()).toEqual(envConfig.timezone)
  })

  it('can format a string to date', () => {
    const inputTime = '2022-03-16 11:34'
    const outputTime = '2022-03-16 11:34:00'
    expect(formatDate(inputTime, 'YYYY-MM-DD HH:mm:ss')).toEqual(outputTime)
  })

  it('can format a timestamp to date', () => {
    const time = 1658808285
    const format = 'YYYY-MM-DD HH:mm:ss'
    const output = '2022-07-26 14:04:45'

    expect(formatTimestamp(time, format, getLocalTimezone())).toEqual(output)

    const format1 = 'YYYY-MM-DD HH:mm:ss'
    const output1 = '2022-07-26 14:04:45'
    const tz1 = envConfig.timezone

    expect(formatTimestamp(time, format1, tz1, tz1)).toEqual(output1)

    const tz2 = 'utc'
    const format2 = 'YYYY-MM-DD HH:mm:ss'
    const output2 = '2022-07-26 04:04:45'
    expect(formatTimestamp(time, format1, tz2, tz1)).toEqual(output1)
    expect(formatTimestamp(time, format2, tz2, tz2)).toEqual(output2)
  })

  it('checks if timestamp is before current time', () => {
    const time = 1639181455
    const output = true

    expect(isBeforeTimestamp(time)).toEqual(output)

    const time2 = 4131306571 // year 2100
    const output2 = false

    expect(isBeforeTimestamp(time2)).toEqual(output2)
  })
})
