import React, { memo } from 'react'
import useRecentlyOrderedProducts from './hooks/useRecentlyOrderedProducts'
import ProductsListCarousel from '../product/ProductsListCarousel'

const ShopRecentlyOrderedProducts = props => {
  const { products, loading, complete } = useRecentlyOrderedProducts(props)

  return (
    <ProductsListCarousel
      testID="ShopScreen.ShopRecentlyOrderedProducts"
      text={`Previously `}
      highlightedText="Ordered"
      data={products}
      loading={loading}
      complete={complete}
    />
  )
}

export default memo(ShopRecentlyOrderedProducts)
