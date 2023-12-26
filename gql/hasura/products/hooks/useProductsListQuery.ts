import { QueryResult } from '@apollo/client'
import { isValidArray, isValidObject } from '../../../../utils/validation'
import useHasuraQuery, { hasuraQuery } from '../../utils/useHasuraQuery'
import ProductsListQuery from '../ProductsListQuery'
import { formatProductData } from '../utils/formatProductData'
import { formatOrderBy } from '../../utils/format'
import {
  formatProductConditionWithVariant,
  productInLocaleCondition,
  productInStockCondition,
  productVisibleInCatalogOrSearchCondition
} from '../ProductConditions'

type ProductsQueryProps = {
  magentoProductIds?: number[]
  skus?: string[]
  productUrls?: string[]
  conditions?: {}
  visibility?: {} | undefined
  inventoryCondition?: {} | undefined
  includeVariations?: boolean
  variables?: {}
  sortBy?: 'new' | 'top_rated' | 'recommended'
  limit?: number
  skip?: boolean
}

export type ProductsQueryResult = QueryResult & {
  products: any[]
  complete: boolean
}

const formatProductsQueryOptions = ({
  skus,
  magentoProductIds,
  visibility = productVisibleInCatalogOrSearchCondition,
  inventoryCondition = productInStockCondition,
  includeVariations: shouldIncludeVariations = undefined,
  conditions: extraConditions = {},
  variables = {},
  sortBy = 'recommended',
  limit: queryLimit = 10,
  skip = false
}: ProductsQueryProps) => {
  let limit: number = queryLimit
  let fieldCondition = {}
  let includeVariations = shouldIncludeVariations ?? false

  if (Array.isArray(magentoProductIds)) {
    fieldCondition = { magento_product_id: { _in: magentoProductIds } }
    limit = magentoProductIds.length
  }

  if (Array.isArray(skus)) {
    fieldCondition = { sku: { _in: skus } }
    limit = skus.length
  }

  if (isValidObject(fieldCondition)) {
    includeVariations = shouldIncludeVariations ?? true
  }

  const productConditions = {
    ...formatProductConditionWithVariant({
      condition: fieldCondition,
      inventoryCondition,
      visibility
    }),
    ...productInLocaleCondition
  }

  const conditions = {
    ...productConditions,
    ...extraConditions
  }

  const variationCondition = includeVariations ? { ...fieldCondition, ...inventoryCondition } : {}

  return {
    variables: {
      conditions,
      variationCondition,
      includeVariations,
      limit,
      orderBy: formatOrderBy(sortBy),
      ...variables
    },
    skip: limit === 0 || skip
  }
}

const mergeChildVariantWithParentData = (parent: any = {}, variant: any = {}) => ({
  ...parent,
  ...variant,
  name: parent.name,
  name_raw: parent.name_raw
})

const isParentProductResult = (product: any = {}, props: ProductsQueryProps): boolean => {
  let isParentResult = false
  const isParentType = product.class_type !== 'sku'
  const { skus, magentoProductIds } = props || {}

  if (isParentType) {
    if (isValidArray(skus)) {
      isParentResult = !!skus.find(sku => sku === product.sku)
    }

    if (isValidArray(magentoProductIds)) {
      isParentResult = !!magentoProductIds.find(id => id === product.magento_product_id)
    }
  }
  return isParentResult
}
/*
 * format a product query result.
 * flatten nested variants
 * merge variants with parent data
 */
export const formatProductsQueryResult = (data: any, props: ProductsQueryProps): any[] | undefined => {
  let productsData
  if (isValidArray(data?.products)) {
    productsData = data.products.reduce((acc, product) => {
      let items
      if (product.variations?.length > 0) {
        // flatten nested variants as their own result item
        items = product.variations.map(variant =>
          formatProductData({
            product: mergeChildVariantWithParentData(product, variant),
            shouldFormatVariations: false
          })
        )
        // if a query result also contains a match for parent product as an additional result item
        if (isParentProductResult(product, props)) {
          items = [...items, formatProductData({ product, shouldFormatVariations: false })]
        }
      } else {
        items = [formatProductData({ product, shouldFormatVariations: false })]
      }
      return [...acc, ...items]
    }, [])
  }

  return productsData
}

/**
 * async function version of useProductsQuery hook
 * @param props
 */
export const fetchProductsListQuery = async (props: ProductsQueryProps) => {
  const { data } = await hasuraQuery({ query: ProductsListQuery, ...formatProductsQueryOptions(props) })
  return formatProductsQueryResult(data, props)
}

/**
 * @usages
 * const {products} = useProductsListQuery({skus : ["AB-RQ-SET-DBL"]})
 * const {products} = useProductsListQuery({skus : ["1G5YCL0000","1G5Y150000","AB-RQ-SET-DBL"]})
 * const {products} = useProductsListQuery({
 *     sortBy: 'new',
 *     limit: 20,
 *     skip,
 *     inventoryCondition:productNotSoldOutCondition,
 *     includeVariations:true,
 *     skus : [
 *       "10giftcardgwp",
 *       "769915194791",
 *       "ELED096",
 *       "MB108102",
 *       "MCSL",
 *       "RYC002A000",
 *       "make-up-for-ever-hd-skin-powder-foundation",
 *       "M3EW290000",
 *       "M3EW3G0000",
 *       "1G5YCP0000"
 *     ]
 *   })

 * @param props
 */
const useProductsListQuery = (props: ProductsQueryProps): ProductsQueryResult => {
  const { data, loading, error, ...queryResult } = useHasuraQuery(ProductsListQuery, formatProductsQueryOptions(props))
  const hasConditionals = isValidObject(
    Object.fromEntries(
      Object.entries(props).filter(([_, value]) => (Array.isArray(value) ? isValidArray(value) : value))
    )
  )

  return {
    products: formatProductsQueryResult(data, props),
    complete: (!!data && !loading && !error) || (!data && !loading && !hasConditionals),
    loading,
    error,
    data,
    ...queryResult
  }
}

export default useProductsListQuery
