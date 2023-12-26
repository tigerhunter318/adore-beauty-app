import formatProductInventory from '../formatProductInventory'
import {
  inStockBigCommerce,
  outOfStockBigCommerce,
  inStockGraphQL,
  outOfStockGraphQL,
  preOrderGraphQL,
  soldOutGraphQL,
  inStockHasura,
  soldOutHasura,
  preOrderHasura,
  outOfStockHasura,
  inStockProductVariantsHasura,
  outOfStockProductVariantsHasura,
  inStockAlgolia,
  outOfStockAlgolia,
  isSoldOutAlgolia,
  preOrderAlgolia,
  incompleteDataAlgolia,
  incompleteDataGraphQL,
  incompleteDataHasura
} from './__mocks__'

// jest --watch components/product/utils/__tests__/formatProductInventory-test.js

describe('formatProductInventory tests', () => {
  /*eslint-disable*/
  const cases = [
    {
      name: 'Big Commerce: Gift Item In Stock',
      productData: inStockBigCommerce,
      expected: {
        isSalable: true,
        isSoldOut: false,
        isOutOfStock: false,
        isBackordersOutOfStock: false,
        isGiftlistItemOutOfStock: false,
        quantity: 40
      }
    },
    {
      name: 'Big Commerce: Gift Item Out Of Stock',
      productData: outOfStockBigCommerce,
      expected: {
        isSalable: false,
        isSoldOut: false,
        isOutOfStock: false,
        isBackordersOutOfStock: false,
        isGiftlistItemOutOfStock: true,
        quantity: 0
      }
    },
    {
      name: 'GraphQL: In Stock',
      productData: inStockGraphQL,
      expected: {
        isSalable: true,
        isSoldOut: false,
        isOutOfStock: false,
        isBackordersOutOfStock: false,
        isGiftlistItemOutOfStock: false,
        quantity: 56
      }
    },
    {
      name: 'GraphQL: Out Of Stock',
      productData: outOfStockGraphQL,
      expected: {
        isSalable: false,
        isSoldOut: false,
        isOutOfStock: false,
        isBackordersOutOfStock: false,
        isGiftlistItemOutOfStock: false,
        quantity: 0
      }
    },
    {
      name: "GraphQL: Pre Order",
      productData: preOrderGraphQL,
      expected: {
        isSalable: true,
        isSoldOut: false,
        isOutOfStock: false,
        isBackordersOutOfStock: true,
        isGiftlistItemOutOfStock: false,
        quantity: 0
      }
    },
    {
      name: "GraphQL: Sold Out",
      productData: soldOutGraphQL,
      expected: {
        isSalable: false,
        isSoldOut: true,
        isOutOfStock: false,
        isBackordersOutOfStock: false,
        isGiftlistItemOutOfStock: false,
        quantity: 0
      }
    },
    {
      name: "GraphQL: Incomplete Data",
      productData: incompleteDataGraphQL,
      expected: {
        isSalable: false,
        isSoldOut: false,
        isOutOfStock: false,
        isBackordersOutOfStock: false,
        isGiftlistItemOutOfStock: false,
        quantity: 0
      }
    },
    {
      name: 'Hasura: Out Of Stock',
      productData: outOfStockHasura,
      expected: {
        isSalable: false,
        isSoldOut: false,
        isOutOfStock: true,
        isBackordersOutOfStock: false,
        isGiftlistItemOutOfStock: false,
        quantity: 0
      }
    },
    {
      name: 'Hasura: In Stock',
      productData: inStockHasura,
      expected: {
        isSalable: true,
        isSoldOut: false,
        isOutOfStock: false,
        isBackordersOutOfStock: false,
        isGiftlistItemOutOfStock: false,
        quantity: 912
      }
    },
    {
      name: 'Hasura: Sold Out',
      productData: soldOutHasura,
      expected: {
        isSalable: false,
        isSoldOut: true,
        isOutOfStock: false,
        isBackordersOutOfStock: false,
        isGiftlistItemOutOfStock: false,
        quantity: 0
      }
    },
    {
      name:  'Hasura: Pre Order',
      productData: preOrderHasura,
      expected: {
        isSalable: false,
        isSoldOut: false,
        isOutOfStock: false,
        isBackordersOutOfStock: true,
        isGiftlistItemOutOfStock: false,
        quantity: 0
      }
    },
    {
      name: "Hasura: Incomplete Data",
      productData: incompleteDataHasura,
      expected: {
        isSalable: false,
        isSoldOut: false,
        isOutOfStock: false,
        isBackordersOutOfStock: false,
        isGiftlistItemOutOfStock: false,
        quantity: 0
      }
    },
    {
      name: 'Hasura: Product With At Least One Variant In Stock',
      productData: inStockProductVariantsHasura,
      productVariant: 105283,
      expected: {
        isSalable: false,
        isSoldOut: false,
        isOutOfStock: false,
        isBackordersOutOfStock: false,
        isGiftlistItemOutOfStock: false,
        quantity: 0
      }
    },
    {
      name: 'Hasura: Product With All Variants Out Of Stock',
      productData: outOfStockProductVariantsHasura,
      productVariant: 'test',
      expected: {
        isSalable: false,
        isSoldOut: false,
        isOutOfStock: true,
        isBackordersOutOfStock: false,
        isGiftlistItemOutOfStock: false,
        quantity: 0
      }
    },
    {
      name: "Algolia: In Stock",
      productData: inStockAlgolia,
      expected: {
        isSalable: true,
        isSoldOut: false,
        isOutOfStock: false,
        isBackordersOutOfStock: false,
        isGiftlistItemOutOfStock: false,
        quantity: 636
      }
    },
    {
      name: "Algolia: Out Of Stock",
      productData: outOfStockAlgolia,
      expected: {
        isSalable: true,
        isSoldOut: false,
        isOutOfStock: true,
        isBackordersOutOfStock: false,
        isGiftlistItemOutOfStock: false,
        quantity: 0
      }
    },
    {
      name: "Algolia: Sold Out",
      productData: isSoldOutAlgolia,
      expected: {
        isSalable: false,
        isSoldOut: true,
        isOutOfStock: false,
        isBackordersOutOfStock: false,
        isGiftlistItemOutOfStock: false,
        quantity: 0
      }
    },
    {
      name: "Algolia: Pre Order",
      productData: preOrderAlgolia,
      expected: {
        isSalable: true,
        isSoldOut: false,
        isOutOfStock: false,
        isBackordersOutOfStock: true,
        isGiftlistItemOutOfStock: false,
        quantity: 0
      }
    },
    {
      name: "Algolia: Incomplete Data",
      productData: incompleteDataAlgolia,
      expected: {
        isSalable: false,
        isSoldOut: false,
        isOutOfStock: false,
        isBackordersOutOfStock: false,
        isGiftlistItemOutOfStock: false,
        quantity: 0
      }
    }
  ]
  
  /* eslint-enable */

  cases.forEach(({ name, productData, productVariant, expected }) => {
    it(name, () => {
      expect(formatProductInventory(productData, productVariant)).toStrictEqual(expected)
    })
  })
})
