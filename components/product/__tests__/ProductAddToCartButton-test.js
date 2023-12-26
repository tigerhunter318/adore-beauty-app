/* eslint-disable global-require */
import React from 'react'
import TestRenderer from 'react-test-renderer'
import ProductAddToCartButton from '../ProductAddToCartButton'

jest.mock('../OutOfStockSubscribe', () => 'OutOfStockSubscribe')

const cases = [
  {
    name: 'ArticleShopProductInStock',
    productData: require('./__mocks__/ArticleShopProductInStock.json'),
    expectations: [{ testID: 'Button.AddToCart.Type', value: 'Add to bag' }]
  },
  {
    name: 'ArticleShopProductOutOfStock',
    productData: require('./__mocks__/ArticleShopProductOutOfStock.json'),
    expectations: [{ testID: 'WaitlistButton.Type', value: 'notify me' }]
  },
  {
    name: 'ArticleShopProductSoldOut',
    productData: require('./__mocks__/ArticleShopProductSoldOut.json'),
    expectations: [{ testID: 'SoldOutButton.Type', value: 'sold out' }]
  },
  {
    name: 'GiftListItemInStock',
    productData: require('./__mocks__/GiftListItemInStock.json'),
    expectations: [{ testID: 'Button.AddToCart.Type', value: 'Add to bag' }]
  },
  {
    name: 'GiftListItemSoldOut',
    productData: require('./__mocks__/GiftListItemSoldOut.json'),
    expectations: [{ testID: 'GiftlistButton.Type', value: 'sold out' }]
  },
  {
    name: 'SearchProductCardInStock',
    productData: require('./__mocks__/SearchProductCardInStock.json'),
    expectations: [{ testID: 'Button.AddToCart.Type', value: 'Add to bag' }]
  },
  {
    name: 'SearchProductCardSoldOut',
    productData: require('./__mocks__/SearchProductCardSoldOut.json'),
    expectations: [{ testID: 'SoldOutButton.Type', value: 'sold out' }]
  },

  {
    name: 'SearchProductCardOutOfStock',
    productData: require('./__mocks__/SearchProductCardOutOfStock.json'),
    expectations: [{ testID: 'WaitlistButton.Type', value: 'notify me' }]
  },

  {
    name: 'ProductDetailWithVariants',
    status: 'In stock',
    productData: require('./__mocks__/ProductDetailWithVariants.json'),
    productVariant: 14527,
    expectations: [{ testID: 'Button.AddToCart.Type', value: 'Add to bag' }]
  },

  {
    name: 'ProductDetailWithVariants',
    status: 'Out of stock',
    productData: require('./__mocks__/ProductDetailWithVariants.json'),
    productVariant: 927,
    expectations: [{ testID: 'WaitlistButton.Type', value: 'notify me' }]
  },

  {
    name: 'ProductDetailInStock',
    productData: require('./__mocks__/ProductDetailInStock.json'),
    expectations: [{ testID: 'Button.AddToCart.Type', value: 'Add to bag' }]
  },

  {
    name: 'ProductDetailOutOfStock',
    productData: require('./__mocks__/ProductDetailOutOfStock.json'),
    expectations: [{ testID: 'WaitlistButton.Type', value: 'notify me' }]
  },

  {
    name: 'CategoryProductListItemWithVariantsInStock',
    productData: require('./__mocks__/CategoryProductListItemWithVariantsInStock.json'),
    expectations: [{ testID: 'Button.AddToCart.Type', value: 'Add to bag' }]
  },

  {
    name: 'CategoryProductListItemSoldOut',
    productData: require('./__mocks__/CategoryProductListItemSoldOut.json'),
    expectations: [{ testID: 'WaitlistButton.Type', value: 'notify me' }]
  },

  {
    name: 'WishlistInStock',
    productData: require('./__mocks__/WishlistInStock.json'),
    expectations: [{ testID: 'Button.AddToCart.Type', value: 'Add to bag' }]
  },

  {
    name: 'WishListSoldOut',
    productData: require('./__mocks__/WishListSoldOut.json'),
    expectations: [{ testID: 'WaitlistButton.Type', value: 'notify me' }]
  }
]

/*
jest --watch components/product/__tests__

 */
describe('ProductAddToCartButton', () => {
  cases.forEach(({ name, status = '', expectations, productData, productVariant = undefined, props = {} }) => {
    it(`${name} ${status}.`, () => {
      const render = TestRenderer.create(
        <ProductAddToCartButton {...props} productVariant={productVariant} productData={productData || {}} />
      )

      expect(render.toJSON()).toMatchSnapshot()

      expectations.forEach(({ testID, value }) => {
        expect(render.root.findByProps({ testID }).props.children).toBe(value)
      })
    })
  })
})
