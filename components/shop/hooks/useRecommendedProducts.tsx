import { useCallback, useEffect, useState } from 'react'
import { emarsysService } from '../../../services/emarsys/emarsys'
import envConfig from '../../../config/envConfig'
import useLuxuryBrands from '../../../gql/hasura/brands/hooks/useLuxuryBrands'
import { isValidArray, isValidObject } from '../../../utils/validation'
import { emarsysEvents } from '../../../services/emarsys/emarsysEvents'
import useProductsListQuery, { ProductsQueryResult } from '../../../gql/hasura/products/hooks/useProductsListQuery'

const formatRecommendedProductsData = data =>
  data.map((item: any) => ({
    ...item,
    productImage: item.imageUrl,
    name: item.title,
    product_id: item.productId,
    brand_name: item.brand,
    zoomImageUrl: ''
  }))

export const useRecommendedProductsFilters = (brand: string) => {
  const { luxuryBrands, findLuxuryBrand } = useLuxuryBrands()

  let filters = {
    type: 'exclude',
    field: 'c_brand',
    comparison: 'in',
    expectation: luxuryBrands?.map(({ name }) => name).join(', ')
  }

  if (findLuxuryBrand(brand)) {
    filters = {
      type: 'include',
      field: 'c_brand',
      comparison: 'is',
      expectation: brand
    }
  }

  return filters
}

type RecommendedProductsResult = ProductsQueryResult & {
  trackRecommendationClick: (productData: any) => void
  fetchRecommendedProducts: () => void
}

type useRecommendedProductsProps = {
  limit?: number
  filters?: object
  itemViewId?: any
  logic?: string
  skip?: boolean
  refreshing?: boolean
}

const useRecommendedProducts = ({
  limit = 10,
  filters = {},
  itemViewId = undefined,
  logic = 'PERSONAL',
  skip = false,
  refreshing = false
}: useRecommendedProductsProps): RecommendedProductsResult => {
  const [recommendedProductsData, setRecommendedProductsData] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  console.log({ recommendedProductsData })

  const recommendedProductsIds = recommendedProductsData
    .map(product => (product?.productId ? Number(product.productId) : undefined))
    .filter(x => x)
  console.log({ recommendedProductsIds })

  const queryResult = useProductsListQuery({
    magentoProductIds: recommendedProductsIds || [],
    includeVariations: false,
    skip
  })
  console.log({ products: queryResult?.products })

  const fetchRecommendedProducts = async () => {
    setRecommendedProductsData([])
    if (!envConfig.emarsys.recommendedProductsEnabled) {
      return
    }
    setLoading(true)

    let filtersObj: any = filters
    let result: any
    console.log({ filtersObj })
    console.log({ itemViewId })

    try {
      if (!isValidObject(filtersObj)) {
        filtersObj = {
          type: 'exclude',
          field: 'isSalable',
          comparison: 'is',
          expectation: '0'
        }
      }

      let response = null
      if (itemViewId) {
        response = await emarsysService.fetchRecommendProductsQueryLimitFilters(
          logic,
          `${itemViewId}`,
          limit,
          filtersObj
        )
      } else if (filtersObj.comparison) {
        console.log({ logic, limit, filtersObj })
        response = await emarsysService.fetchRecommendProductsLimitFilters(logic, limit, filtersObj)
      }
      console.log({ response })

      if (isValidArray(response)) {
        result = formatRecommendedProductsData(response)
      }
    } catch (error) {
      console.warn('useRecommendedProducts', 'fetchData:error', error)
    }
    console.log({ result })

    if (isValidArray(result)) {
      setRecommendedProductsData(formatRecommendedProductsData(result))
    } else {
      setRecommendedProductsData([])
    }
    setLoading(false)
  }

  const trackRecommendationClick = useCallback(
    async productData => {
      const recommendation = recommendedProductsData?.find(
        item => item?.productId === `${productData?.magento_product_id}`
      )

      if (recommendation) {
        try {
          await emarsysEvents.trackRecommendationClick(recommendation)
        } catch (error) {
          console.warn('useRecommendedProducts', 'trackRecommendationClick', error)
        }
      }
    },
    [recommendedProductsData]
  )

  useEffect(() => {
    if (refreshing) {
      fetchRecommendedProducts()
    }
  }, [refreshing])

  return { ...queryResult, loading: loading || queryResult.loading, fetchRecommendedProducts, trackRecommendationClick }
}

export default useRecommendedProducts
