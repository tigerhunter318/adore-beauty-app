import envConfig from '../config/envConfig'

export const guestEmail = () => {
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `detox-guest-${rand}@test.com`
}
export const guestAddress = () => ({
  addressMeta: {
    id: -1,
    addressable_id: -1,
    big_commerce_id: -1,
    company: null,
    street_1: '20 Wright Road',
    street_2: null,
    city: 'KEILOR PARK',
    country: 'Australia',
    state: 'VIC',
    post_code: '3042',
    phone: null,
    is_default_shipping: false,
    is_default_billing: false,
    created_at: '2021-07-14T02:51:27.000000Z',
    updated_at: '2021-10-11T04:06:51.000000Z',
    type: 'shipping',
    addressable_type: 'App\\Models\\Customer',
    external_id: null,
    first_name: null,
    last_name: null,
    address_line_1: '20 Wright Road',
    address_line_2: null,
    locality_name: 'KEILOR PARK',
    state_territory: 'VIC',
    postcode: '3042'
  },

  address: '20 Wright Road, KEILOR PARK, VIC, 3042',
  firstName: null,
  lastName: null,
  phone: null,
  newAddress: '',
  isSaveAddressChecked: false
})
export const testAccountEmail = () => envConfig.e2e.email
export const testAccountPassword = () => envConfig.e2e.password
