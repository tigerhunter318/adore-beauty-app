import envConfig from '../config/envConfig'

export const setCustomerCountryStoreValue = (payload = {}) => {
  if (payload.au_store === undefined) {
    return {
      ...payload,
      au_store: envConfig.countryCode === 'AU' ? 1 : 0,
      nz_store: envConfig.countryCode === 'NZ' ? 1 : 0
    }
  }
}
