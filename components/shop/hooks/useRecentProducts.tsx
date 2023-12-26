import { useEffect } from 'react'
import { getAsyncStorageItem, setAsyncStorageItem } from '../../../utils/asyncStorage'
import config from '../../../constants/config'
import useProductsListQuery, { ProductsQueryResult } from '../../../gql/hasura/products/hooks/useProductsListQuery'
import { isValidArray } from '../../../utils/validation'
import { useAppContext } from '../../../AppProvider'

const key = 'recentProducts'

type RecentProductsOptions = {
  skip?: boolean
  readStorage?: boolean
  refreshing?: boolean
  exclude?: string
}
type RecentProductsResult = ProductsQueryResult & {
  addRecentProduct: (sku: string) => Promise<void>
}
export const useRecentProducts = ({
  skip = true,
  readStorage = false,
  refreshing,
  exclude = ''
}: RecentProductsOptions): RecentProductsResult => {
  const {
    recentProductState: [recentSkus, setSkus]
  } = useAppContext()
  const skus = recentSkus.filter(sku => sku !== `${exclude}`)
  const { products, refetch, complete, ...queryResult } = useProductsListQuery({ skus, skip })

  const syncStorageToState = async () => {
    let recentProducts: any[] = await getAsyncStorageItem(key)

    if (isValidArray(recentProducts)) {
      recentProducts = recentProducts
        .map(product => (typeof product === 'string' ? product : product?.sku))
        .filter(sku => !!sku)
      setSkus(recentProducts)
    }
  }

  const addRecentProduct = async (sku: string) => {
    setSkus(prev => {
      let next = isValidArray(prev) ? prev : []
      next = [sku, ...next.filter(item => item !== sku)].slice(0, config.recentProductsLimit)
      setAsyncStorageItem('recentProducts', next)
      return next
    })
  }

  useEffect(() => {
    if (readStorage) {
      syncStorageToState()
    }
  }, [readStorage])

  useEffect(() => {
    if (refreshing) {
      refetch()
    }
  }, [refreshing])

  return { addRecentProduct, products, refetch, complete: complete || !isValidArray(skus), ...queryResult }
}
