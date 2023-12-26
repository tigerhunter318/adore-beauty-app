import envConfig from '../../config/envConfig'

const testPassword = () => 'Passw0rd!'

const mockData = {
  account: {
    email: 'phil@test.com'
  },
  login: {
    email: envConfig.e2e.email,
    device_name: 'test',
    password: envConfig.e2e.password,
    first_name: 'App-Automated',
    last_name: 'Testing'
  },
  signup: {
    email: '@example.com',
    first_name: 'phil',
    last_name: 'test',
    password: testPassword(),
    password_confirmation: testPassword(),
    device_name: 'test',
    au_store: 1,
    nz_store: 0
  },
  addToCartMultiple: [
    { productSku: 'E9WK010000' },
    { productSku: 'abmbdbag' },
    { productSku: 'SC', cartProductId: '29347' }
  ],
  addToCart: {
    // productSku: 'SKSC20019',
    productSku: '4979006053241', // staging only
    quantity: 1,
    product_id: '',
    cartProductId: 42886
  },
  addAddress: {
    firstName: 'Phil',
    lastName: 'Test',
    phone: '0404 000 000',
    addressMeta: {
      address_line_1: '44A Broadway',
      address_line_2: null,
      locality_name: 'BONBEACH',
      state_territory: 'VIC',
      postcode: '3196'
    }
  },
  billingAddress: {
    first_name: 'Phil',
    last_name: 'Test',
    email: 'phil@example.com',
    address1: '44A Broadway',
    address2: null,
    city: 'BONBEACH',
    state_or_province: 'VIC',
    state_or_province_code: '',
    postal_code: '3196',
    phone: '0404539959',
    country: 'Australia',
    country_code: 'AU'
  },
  card: {
    type: 'card',
    number: '4111111111111111', // paymentDetails.cardNumber,
    cardholder_name: 'test card', // paymentDetails.cardName,
    expiry_month: 12,
    expiry_year: 2020,
    verification_value: '123' // paymentDetails.cardCsv
  }
}

export default mockData
