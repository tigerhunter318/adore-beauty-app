import React from 'react'
import { useRoute } from '@react-navigation/native'
import { getIn } from '../../../../utils/getIn'
import { useCategoryContext } from '../../../../components/category/CategoryProvider'
import { isValidArray } from '../../../../utils/validation'
import {
  CategoryProductsByPriceQuery,
  CategoryProductsDefaultQuery,
  formatCategoryProductsQuery
} from '../CategoryProductsQuery'
import { formatProductData } from '../../products/utils/formatProductData'
import { vh } from '../../../../utils/dimensions'
import ContentLoading from '../../../../components/ui/ContentLoading'
import envConfig from '../../../../config/envConfig'
import useQueryPagination from '../../utils/useQueryPagination'
import useCategoryFilters from '../../../../components/category/hooks/useCategoryFilters'
import { formatOrderBy } from '../../utils/format'

const isPriceQuery = (sortType: string) => /price/.test(sortType)
const isTopRatedQuery = (sortType: string) => sortType === 'Top rated'

type getCategoryProductsProps = {
  data: any
  target?: string
  sortType?: string | any
  sortBy?: any
  comestri_category_id?: any
  shouldFormatVariations?: boolean
  isChildCategoryQuery?: boolean
}

export const getCategoryProducts = ({
  data,
  sortType,
  sortBy,
  target = 'products',
  shouldFormatVariations = false
}: getCategoryProductsProps) => {
  let products = getIn(data, target)
  const sortingIndex = Object.entries(sortBy)[0][0]

  if (!isValidArray(products)) return []

  if (isPriceQuery(sortType)) {
    products = products.map((product: any) => ({ ...product.product, [sortingIndex]: product[sortingIndex] }))
  }

  return products.map((product: {}) => formatProductData({ product, shouldFormatVariations })).filter((x: any) => x)
}

const getCategoryProductsQuery = (type: string) => {
  if (isPriceQuery(type)) {
    return CategoryProductsByPriceQuery
  }

  return CategoryProductsDefaultQuery
}

type getQueryVariablesProps = {
  limit?: number
  sortBy: {}
  sortType: string
  queryConditions: any
}

const getQueryVariables = ({ limit, sortBy, sortType, queryConditions }: getQueryVariablesProps) => {
  let orderBy = sortBy
  let conditions = queryConditions

  if (isTopRatedQuery(sortType)) {
    orderBy = formatOrderBy('top_rated')
  }

  if (isPriceQuery(sortType)) {
    conditions = { price_book: { _contains: { name: envConfig.hasura.priceBookName } }, product: queryConditions }
  }

  return {
    limit,
    includeCount: true,
    order_by: orderBy,
    conditions
  }
}

type useCategoryProductsQueryProps = {
  skip?: boolean
}

const useCategoryProductsQuery = ({ skip }: useCategoryProductsQueryProps) => {
  const route: any = useRoute()
  const { url_path: urlPath, url, fullPath } = route?.params
  const { selectedFacets, appliedSortOption } = useCategoryContext()
  const sortBy = appliedSortOption.index
  const sortType = appliedSortOption.label
  const target = isPriceQuery(sortType) ? 'product_prices' : 'products'
  const categoryUrl = urlPath || fullPath || url
  useCategoryFilters([categoryUrl])

  const queryConditions = formatCategoryProductsQuery(selectedFacets)
  const variables = getQueryVariables({ queryConditions, sortType, limit: 20, sortBy })

  const formatResponse = response => ({
    products: getCategoryProducts({ data: response, sortType, sortBy, target }),
    productsResultCount: getIn(response, `${target}_aggregate.aggregate.count`)
  })

  return useQueryPagination(getCategoryProductsQuery(sortType), {
    variables,
    skip: skip || !categoryUrl,
    formatResponse,
    fetchMoreVariables: offset => ({ offset, includeCount: !(offset > 0) }),
    hasMoreResults: (fetchMoreResult, { limit }) => fetchMoreResult?.[target]?.length === limit,
    target,
    LoaderComponent: <ContentLoading type="ProductGrid" height={vh(100)} />
  })
}

export default useCategoryProductsQuery
