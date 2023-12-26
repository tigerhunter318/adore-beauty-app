import { partnerizeService } from '../partnerize'
import prepareConversionInput from '../__mockdata__/prepareConversionInput.json'
import prepareConversionResult from '../__mockdata__/prepareConversionResult.json'

describe('partnerize service', () => {
  it('can prepareConversion with valid data', () => {
    const result = partnerizeService.prepareConversion(
      prepareConversionInput.orderConfirmationData,
      prepareConversionInput.customerAccount
    )
    expect(result).toMatchObject(prepareConversionResult.result)
  })

  it('can prepareConversion with missing data', () => {
    const result = partnerizeService.prepareConversion(
      prepareConversionInput.orderConfirmationData1,
      prepareConversionInput.customerAccount1
    )
    expect(result).toMatchObject(prepareConversionResult.result1)
  })

  it('can prepareConversion with missing data 2', () => {
    const orderData = {
      id: 101,
      payment_method: 'Fresh air',
      billing_address: {
        first_name: 'first',
        last_name: 'last'
      },
      products: [{ id: 2 }, { id: 1, sku: '2' }],
      productsDetail: [{ productSku: ['2'], name: 'first' }]
    }
    const account = {
      first_name: 'phil'
    }

    const expectedResult = {
      conversionRef: '101',
      country: '',
      currency: '',
      custRef: '0',
      isReturningCustomer: false,
      products: [
        {
          category: '',
          price: 0,
          quantity: 0,
          sku: ''
        },
        {
          category: '',
          metadata: {
            product_name: 'first'
          },
          price: 0,
          quantity: 0,
          sku: '2'
        }
      ],
      metadata: { order_payment_type: 'fresh_air' }
    }

    const result = partnerizeService.prepareConversion(orderData, account)
    expect(result).toMatchObject(expectedResult)
  })
})
