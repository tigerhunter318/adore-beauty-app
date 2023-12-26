import React, { memo, useEffect } from 'react'
import useProductsListQuery from '../../gql/hasura/products/hooks/useProductsListQuery'
import ProductsListCarousel from '../product/ProductsListCarousel'

const ShopBestSellers = ({
  skip = true,
  isScreenRefreshing = false
}: {
  skip: boolean
  isScreenRefreshing: boolean
}) => {
  const { products, loading, refetch, complete } = useProductsListQuery({ limit: 10, skip })

  const handleRefresh = () => {
    if (isScreenRefreshing) {
      refetch()
    }
  }

  useEffect(handleRefresh, [isScreenRefreshing])

  return (
    <ProductsListCarousel
      testID="ShopScreen.ShopBestSellers"
      text={`Best `}
      highlightedText="Sellers"
      data={products}
      loading={loading}
      complete={complete}
    />
  )
}

export default memo(ShopBestSellers)
