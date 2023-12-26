import gql from 'graphql-tag'
import envConfig from '../../../config/envConfig'
import { isValidArray } from '../../../utils/validation'
import { formatUrlPathQueryVariables } from '../utils/format'
import {
  formatProductConditionWithVariant,
  productInLocaleCondition,
  productNotSoldOutCondition,
  productVisibleInCatalogOrSearchCondition
} from '../products/ProductConditions'
import { ProductFragments } from '../products/ProductFragments'

export const categoryProductsInventoryCondition = formatProductConditionWithVariant({
  inventoryCondition: productNotSoldOutCondition,
  visibility: productVisibleInCatalogOrSearchCondition
})
export const formatCategoryProductsQuery = (
  selections: any,
  excludeKey?: string,
  queryInventoryCondition?: any
): any => {
  let conditions = []
  const { facets, category } = selections || {}
  const { price, brand, subCategory, ...facetOptions } = facets || {}
  const inventoryCondition = queryInventoryCondition ?? categoryProductsInventoryCondition

  if ((category || subCategory) && excludeKey !== 'subCategory') {
    const categoryUrl = subCategory?.length > 0 ? subCategory[0] : category
    conditions.push({
      categories: {
        category: formatUrlPathQueryVariables(categoryUrl)
      }
    })
  }

  if (brand && excludeKey !== 'brand') {
    conditions.push({
      brands: {
        brand: { identifier: { _in: brand } }
      }
    })
  }

  if (price) {
    let priceConditions = {}

    if (isValidArray(price)) {
      const { _gte, _lte } = JSON.parse(price[0])

      priceConditions = {
        _and: [
          { amount: { _gte } },
          { amount: { _lte } },
          { price_book: { _contains: { name: envConfig.hasura.priceBookName } } }
        ]
      }
    }

    conditions.push({ product_prices: priceConditions })
  }

  if (facetOptions) {
    const facetConditions = Object.keys(facetOptions)
      .filter(code => code !== excludeKey)
      .filter(code => isValidArray(facetOptions[code]))
      .map(code => ({
        facet_groups: {
          facet_group_code: { _eq: code },
          facet_group_options: { facet_group_option_code: { _in: facetOptions[code] } }
        }
      }))

    conditions = [...conditions, ...facetConditions]
  }

  if (conditions.length > 0) {
    return {
      _and: conditions,
      ...inventoryCondition,
      ...productInLocaleCondition
    }
  }

  return {
    ...inventoryCondition,
    ...productInLocaleCondition
  }
}

const CategoryProductsQueryFragments = gql`
  ${ProductFragments}
  fragment categoryProductsFields on products {
    ...productFields
    ...productMetadata
    ...productReviewAverage
    ...productInventories
    ...productBrandCategory
    ...productImage
    ...productPrices
  }
`

export const CategoryProductsDefaultQuery = gql`
  ${CategoryProductsQueryFragments}
  query app_CategoryProductsDefaultQuery(
    $conditions: products_bool_exp!
    $order_by: [products_order_by!]
    $offset: Int
    $limit: Int
    $includeCount: Boolean!
  ) {
    products(where: $conditions, order_by: $order_by, limit: $limit, offset: $offset) {
      __cache_as_categoryProduct: __typename
      ...categoryProductsFields
    }
    products_aggregate(where: $conditions) @include(if: $includeCount) {
      aggregate {
        count
      }
    }
  }
`

export const CategoryProductsByPriceQuery = gql`
  ${CategoryProductsQueryFragments}
  query app_CategoryProductsByPriceQuery(
    $conditions: product_prices_bool_exp
    $order_by: [product_prices_order_by!]
    $offset: Int
    $limit: Int
    $includeCount: Boolean!
  ) {
    product_prices(where: $conditions, order_by: $order_by, limit: $limit, offset: $offset) {
      amount
      price_book
      product {
        __cache_as_categoryProduct: __typename
        ...categoryProductsFields
      }
    }
    product_prices_aggregate(where: $conditions) @include(if: $includeCount) {
      aggregate {
        count
      }
    }
  }
`
