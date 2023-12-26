import { isValidArray, isValidObject } from './validation'

/*
ACT	Australian Capital Territory	AUS
NSW	New South Wales	AUS
NT	Northern Territory	AUS
QLD	Queensland	AUS
SA	South Australia	AUS
TAS	Tasmania	AUS
VIC	Victoria	AUS
WA	Western Australia	AUS
 */
const STATE_NAMES = {
  AUS: [
    { code: 'ACT', name: 'Australian Capital Territory' },
    { code: 'NSW', name: 'New South Wales' },
    { code: 'NT', name: 'Northern Territory' },
    { code: 'QLD', name: 'Queensland' },
    { code: 'SA', name: 'South Australia' },
    { code: 'TAS', name: 'Tasmania' },
    { code: 'VIC', name: 'Victoria' },
    { code: 'WA', name: 'Western Australia' }
  ]
}

const isAddressEqual = (address1, address2) => {
  if (!isValidObject(address1) || !isValidObject(address2)) return false

  const lineEqual = line => address1[line] === address2[line]

  return (
    lineEqual('street_1') && lineEqual('street_2') && lineEqual('city') && lineEqual('post_code') && lineEqual('state')
  )
}

const findBillingAddressIndex = (addresses, billingAddress) =>
  addresses?.findIndex(address => {
    const addressMeta = address?.addressMeta
    const newBillingAddress = billingAddress?.newAddress
    const billingAddressMeta = billingAddress?.addressMeta
    return isAddressEqual(addressMeta, newBillingAddress) || isAddressEqual(addressMeta, billingAddressMeta)
  })

const mapAuState = val => {
  const name = (val || '').toLowerCase()
  const foundState = STATE_NAMES.AUS.find(item => item.code.toLowerCase() === name || item.name.toLowerCase() === name)
  if (foundState) {
    return foundState.code
  }
  return name
}

const normaliseAddress = (data = {}) => {
  const formattedAddress = {
    ...data,
    state_or_province_code: mapAuState(data.state_or_province_code)
  }
  return formattedAddress
}
const validateAddress = data => {
  const requiredFields = ['address1', 'city', 'phone', 'country_code', 'postal_code', 'state_or_province_code']
  let valid = true
  requiredFields.forEach(key => {
    if (!data[key]) {
      valid = false
    }
  })
  return valid
}

const filterInvalidAddresses = (items = []) => {
  if (isValidArray(items)) {
    return items.filter(item => !!item?.state)
  }
  return []
}

const formatSavedAddress = (address, defaults = {}) => {
  if (isValidObject(address)) {
    const { street_1, street_2, city, state, post_code, phone, first_name, last_name } = address

    return {
      address: [street_1, street_2, city, state, post_code].filter(name => !!name).join(', '),
      addressMeta: {
        ...address,
        address_line_1: street_1,
        address_line_2: street_2,
        locality_name: city,
        state_territory: state,
        postcode: post_code,
        phone: phone || defaults?.phone,
        first_name: first_name || defaults?.firstName,
        last_name: last_name || defaults?.lastName
      },
      phone: phone || defaults?.phone
    }
  }
  return {}
}

const formatNewAddress = (address, defaults = {}) => {
  if (isValidObject(address)) {
    const { address_line_1, address_line_2, locality_name, state_territory, postcode } = address

    return {
      street_1: address_line_1,
      street_2: address_line_2,
      city: locality_name,
      state: state_territory,
      post_code: postcode,
      phone: defaults?.phone,
      first_name: defaults?.firstName,
      last_name: defaults?.lastName
    }
  }
  return {}
}

const getShippingAddressIndex = (address, shippingAddresses) => {
  if (isValidObject(address) && isValidArray(shippingAddresses)) {
    const { address_line_1, address_line_2, locality_name, state_territory, postcode } = address

    return shippingAddresses.findIndex(
      ({ street_1, street_2, city, state, post_code }) =>
        street_1 === address_line_1 &&
        street_2 === address_line_2 &&
        city === locality_name &&
        state === state_territory &&
        post_code === postcode
    )
  }

  return -1
}

const sortAddresses = addresses => addresses?.sort((a, b) => b?.is_default_shipping - a?.is_default_shipping)

const addressUtil = {
  normaliseAddress,
  validateAddress,
  filterInvalidAddresses,
  formatSavedAddress,
  formatNewAddress,
  getShippingAddressIndex,
  sortAddresses,
  findBillingAddressIndex,
  isAddressEqual
}

export default addressUtil
