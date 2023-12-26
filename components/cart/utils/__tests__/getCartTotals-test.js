import { getCartTotals } from '../useCartTotals'
import cart from '../../__mocks__/cart.json'
import cartWithShipping from '../../__mocks__/cartWithShipping.json'
import cartWithGiftCert from '../../__mocks__/cartWithGiftCert.json'
import cartWithShippingAndDiscounts from '../../__mocks__/cartWithShippingAndDiscounts.json'

describe('object tests', () => {
  it('can calculate cart totals', () => {
    const result = getCartTotals(cart)
    expect(result.subTotal).toEqual(316.15)
    expect(result.orderSummary).toEqual(316.15)
    expect(result.grandTotal).toEqual(316.15)
    expect(result.totalCost).toEqual(316.15)
    expect(result.shippingTotal).toEqual(0)
    expect(result.discountTotal).toEqual(0)
  })

  it('can calculate cart totals with gift cert', () => {
    const result = getCartTotals(cartWithGiftCert)
    expect(result.subTotal).toEqual(316.15)
    expect(result.orderSummary).toEqual(316.15)
    expect(result.grandTotal).toEqual(316.15)
    expect(result.totalCost).toEqual(296.15)
    expect(result.shippingTotal).toEqual(0)
    expect(result.discountTotal).toEqual(0)
    expect(result.giftCertificatesDiscount).toEqual(20)
    expect(result.storeCreditsDiscount).toEqual(0)
  })

  it('can calculate cart totals with store credit', () => {
    const result = getCartTotals(cart, undefined, 100)
    expect(result.subTotal).toEqual(316.15)
    expect(result.orderSummary).toEqual(316.15)
    expect(result.grandTotal).toEqual(316.15)
    expect(result.totalCost).toEqual(216.15)
    expect(result.shippingTotal).toEqual(0)
    expect(result.discountTotal).toEqual(0)
    expect(result.giftCertificatesDiscount).toEqual(0)
    expect(result.storeCreditsDiscount).toEqual(100)
  })

  it('can calculate cart totals and override shipping', () => {
    const result = getCartTotals(cart, 10)
    expect(result.subTotal).toEqual(316.15)
    expect(result.orderSummary).toEqual(316.15)
    expect(result.grandTotal).toEqual(316.15)
    expect(result.totalCost).toEqual(326.15)
    expect(result.shippingTotal).toEqual(10)
    expect(result.discountTotal).toEqual(0)
  })

  it('can calculate cart totals with store credit and override shipping', () => {
    const result = getCartTotals(cart, 10, 100)
    expect(result.subTotal).toEqual(316.15)
    expect(result.orderSummary).toEqual(316.15)
    expect(result.grandTotal).toEqual(316.15)
    expect(result.totalCost).toEqual(226.15)
    expect(result.shippingTotal).toEqual(10)
    expect(result.discountTotal).toEqual(0)
  })

  it('can calculate cart totals with shipping', () => {
    const result = getCartTotals(cartWithShipping)
    expect(result.subTotal).toEqual(316.15)
    expect(result.orderSummary).toEqual(316.15)
    expect(result.grandTotal).toEqual(326.1)
    expect(result.totalCost).toEqual(326.1)
    expect(result.shippingTotal).toEqual(9.95)
    expect(result.discountTotal).toEqual(0)
  })

  it('can calculate cart totals with shipping and store credit', () => {
    const result = getCartTotals(cartWithShipping, undefined, 100)
    expect(result.subTotal).toEqual(316.15)
    expect(result.orderSummary).toEqual(316.15)
    expect(result.grandTotal).toEqual(326.1)
    expect(result.totalCost).toEqual(226.1)
    expect(result.shippingTotal).toEqual(9.95)
    expect(result.discountTotal).toEqual(0)
  })

  it('can calculate cart totals with shipping and override shipping', () => {
    const result = getCartTotals(cartWithShipping, 19.95)
    expect(result.subTotal).toEqual(316.15)
    expect(result.orderSummary).toEqual(316.15)
    expect(result.grandTotal).toEqual(326.1)
    expect(result.totalCost).toEqual(336.1)
    expect(result.shippingTotal).toEqual(19.95)
    expect(result.discountTotal).toEqual(0)
  })

  it('can calculate cart totals with shipping and store credit and override shipping', () => {
    const result = getCartTotals(cartWithShipping, 19.95, 100)
    expect(result.subTotal).toEqual(316.15)
    expect(result.orderSummary).toEqual(316.15)
    expect(result.grandTotal).toEqual(326.1)
    expect(result.totalCost).toEqual(236.1)
    expect(result.shippingTotal).toEqual(19.95)
    expect(result.discountTotal).toEqual(0)
  })

  it('can calculate cart totals with shipping and discounts', () => {
    const result = getCartTotals(cartWithShippingAndDiscounts)
    expect(result.subTotal).toEqual(316.15)
    expect(result.orderSummary).toEqual(316.15)
    expect(result.grandTotal).toEqual(276.1)
    expect(result.totalCost).toEqual(276.1)
    expect(result.shippingTotal).toEqual(9.95)
    expect(result.discountTotal).toEqual(50)
  })

  it('can calculate cart totals with shipping and discounts and store credit', () => {
    const result = getCartTotals(cartWithShippingAndDiscounts, undefined, 100)
    expect(result.subTotal).toEqual(316.15)
    expect(result.orderSummary).toEqual(316.15)
    expect(result.grandTotal).toEqual(276.1)
    expect(result.totalCost).toEqual(176.1)
    expect(result.shippingTotal).toEqual(9.95)
    expect(result.discountTotal).toEqual(50)
  })

  it('can calculate cart totals with discounts and override shipping cost', () => {
    const result = getCartTotals(cartWithShippingAndDiscounts, 5.95)
    expect(result.orderSummary).toEqual(316.15)
    expect(result.subTotal).toEqual(316.15)
    expect(result.grandTotal).toEqual(276.1)
    expect(result.totalCost).toEqual(272.1)
    expect(result.shippingTotal).toEqual(5.95)
    expect(result.discountTotal).toEqual(50)
  })

  it('can calculate cart totals with discounts and store credit and override shipping cost', () => {
    const result = getCartTotals(cartWithShippingAndDiscounts, 5.95, 100)
    expect(result.orderSummary).toEqual(316.15)
    expect(result.subTotal).toEqual(316.15)
    expect(result.grandTotal).toEqual(276.1)
    expect(result.totalCost).toEqual(172.1)
    expect(result.shippingTotal).toEqual(5.95)
    expect(result.discountTotal).toEqual(50)
  })
})
