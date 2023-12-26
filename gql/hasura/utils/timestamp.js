import { utcNow } from '../../../utils/date'

/**
 * get now time in utc timezone, round down the hour to optimise query caching
 * @returns {string}
 */
export const promoQueryTimeStamp = () => utcNow().format('YYYY-MM-DDTHH:00:00Z')
