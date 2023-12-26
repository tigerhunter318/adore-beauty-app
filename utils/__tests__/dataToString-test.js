import { dataToString } from '../format'

describe('dataToString tests', () => {
  it('can format order data to string object for facebook tracking', () => {
    const orderData = {
      id: 1200251865,
      payment_method: 'Braintree',
      estimated_delivery: '2021-08-06T04:10:30.000000Z',
      is_returning_customer: true,
      total_ex_tax: '91.8200',
      total_inc_tax: '101.0000',
      total_tax: '9.1800',
      items_total: 4,
      productsDetail: [
        {
          product_id: 101,
          brand_name: 'brand1',
          category_name: 'cat1'
        },
        {
          product_id: 102,
          brand_name: 'brand2',
          category_name: 'cat2'
        }
      ],
      products: [
        {
          id: 300867,
          name: '769915194982 - The Ordinary Supersize Hyaluronic Acid 2% + B5 - 60ml',
          price_inc_tax: '27.0000',
          sku: '769915194982'
        },
        {
          id: 300868,
          name: '769915194951 - The Ordinary Supersize Niacinamide 10% + Zinc 1% - 60ml',
          price_inc_tax: '20.0000',
          sku: '769915194951'
        }
      ],
      coupons: [
        {
          id: 130,
          coupon_id: 2397935,
          order_id: 1200253150,
          code: '10dollars',
          amount: '0',
          type: 5,
          discount: '10.0000'
        }
      ],
      couponIds: [5]
    }
    const params = {
      orderId: dataToString(orderData, 'id'),
      totalSpend: dataToString(orderData, 'total_inc_tax'),
      totalItems: dataToString(orderData, 'items_total'),
      productBrands: dataToString(orderData, 'productsDetail', 'brand_name'),
      productCategories: dataToString(orderData, 'productsDetail', 'category_name'),
      productSkus: dataToString(orderData, 'products', 'sku'),
      productNames: dataToString(orderData, 'products', 'name'),
      productIds: dataToString(orderData, 'productsDetail', 'product_id'),
      productPrices: dataToString(orderData, 'products', 'price_inc_tax'),
      paymentMethod: dataToString(orderData, 'payment_method'),
      isReturningCustomer: dataToString(orderData, 'is_returning_customer'),
      coupons: dataToString(orderData, 'coupons', 'code')
    }

    const expectedOutput = {
      orderId: 1200251865,
      totalSpend: '101.0000',
      totalItems: 4,
      productBrands: 'brand1,brand2',
      productCategories: 'cat1,cat2',
      productSkus: '769915194982,769915194951',
      productNames:
        '769915194982 - The Ordinary Supersize Hyaluronic Acid 2% + B5 - 60ml,769915194951 - The Ordinary Supersize Niacinamide 10% + Zinc 1% - 60ml',
      productIds: '101,102',
      productPrices: '27.0000,20.0000',
      paymentMethod: 'Braintree',
      isReturningCustomer: 1,
      coupons: '10dollars'
    }

    expect(params).toStrictEqual(expectedOutput)
  })
})
