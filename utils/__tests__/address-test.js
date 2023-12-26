import addressUtil from '../addressUtil'

describe('address tests', () => {
  // isAddressEqual

  it('check if two addresses are equal', () => {
    expect(
      addressUtil.isAddressEqual(
        { street_1: 'Test', street_2: 'Address', city: 'Melbourne', state: 'VIC', post_code: 3213 },
        { street_1: 'Test', street_2: 'Address', city: 'Melbourne', state: 'VIC', post_code: 3213 }
      )
    ).toBe(true)
    expect(
      addressUtil.isAddressEqual(
        {
          street_1: 'Test2',
          street_2: 'Address',
          city: 'Melbourne',
          state: 'VIC',
          post_code: 3213
        },
        { street_1: 'Test1', street_2: 'Address', city: 'Melbourne', state: 'VIC', post_code: 3213 }
      )
    ).toBe(false)
    expect(
      addressUtil.isAddressEqual(
        { street_1: 'Test', street_2: 'Address', city: 'Melbourne', state: 'VIC', post_code: 3213 },
        null
      )
    ).toBe(false)
  })

  // formatSavedAddress

  it('format saved customer address', () => {
    expect(
      addressUtil.formatSavedAddress(
        { street_1: 'Test', street_2: 'Address', city: 'Melbourne', state: 'VIC', post_code: 3213 },
        { phone: '0467890123', firstName: 'Test', lastName: 'Tset' }
      )
    ).toEqual({
      address: 'Test, Address, Melbourne, VIC, 3213',
      addressMeta: {
        address_line_1: 'Test',
        address_line_2: 'Address',
        city: 'Melbourne',
        first_name: 'Test',
        last_name: 'Tset',
        locality_name: 'Melbourne',
        phone: '0467890123',
        post_code: 3213,
        postcode: 3213,
        state: 'VIC',
        state_territory: 'VIC',
        street_1: 'Test',
        street_2: 'Address'
      },
      phone: '0467890123'
    })
    expect(
      addressUtil.formatSavedAddress({
        street_1: 'Test',
        street_2: 'Address',
        city: 'Melbourne',
        state: 'VIC',
        post_code: 3213,
        phone: '0467890123',
        first_name: 'Test',
        last_name: 'Tset'
      })
    ).toEqual({
      address: 'Test, Address, Melbourne, VIC, 3213',
      addressMeta: {
        address_line_1: 'Test',
        address_line_2: 'Address',
        city: 'Melbourne',
        first_name: 'Test',
        last_name: 'Tset',
        locality_name: 'Melbourne',
        phone: '0467890123',
        post_code: 3213,
        postcode: 3213,
        state: 'VIC',
        state_territory: 'VIC',
        street_1: 'Test',
        street_2: 'Address'
      },
      phone: '0467890123'
    })
  })

  // formatNewAddress

  it('format new customer address', () => {
    expect(
      addressUtil.formatNewAddress(
        {
          address_line_1: 'Test',
          address_line_2: 'Address',
          locality_name: 'Melbourne',
          state_territory: 'VIC',
          postcode: 3213
        },
        { phone: '0467890123', firstName: 'Test', lastName: 'Tset' }
      )
    ).toEqual({
      city: 'Melbourne',
      first_name: 'Test',
      last_name: 'Tset',
      phone: '0467890123',
      post_code: 3213,
      state: 'VIC',
      street_1: 'Test',
      street_2: 'Address'
    })
    expect(
      addressUtil.formatNewAddress({
        address_line_1: 'Test',
        address_line_2: 'Address',
        locality_name: 'Melbourne',
        state_territory: 'VIC',
        postcode: 3213
      })
    ).toEqual({
      city: 'Melbourne',
      first_name: undefined,
      last_name: undefined,
      phone: undefined,
      post_code: 3213,
      state: 'VIC',
      street_1: 'Test',
      street_2: 'Address'
    })
  })
})
