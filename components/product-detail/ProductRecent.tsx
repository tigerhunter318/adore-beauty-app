import React, { memo } from 'react'
import ProductsListCarousel from '../product/ProductsListCarousel'
import { useRecentProducts } from '../shop/hooks/useRecentProducts'

type ProductRecentProps = {
  isScreenRefreshing: boolean
  skip: boolean
  exclude?: string
  isLuxuryProduct?: boolean
}

const ProductRecent = ({ isScreenRefreshing, skip = true, exclude, isLuxuryProduct }: ProductRecentProps) => {
  const { products, loading, complete } = useRecentProducts({ skip, exclude, refreshing: isScreenRefreshing })

  return (
    <ProductsListCarousel
      testID="ProductScreen.RecentProducts"
      text="recent "
      highlightedText="products"
      data={products}
      loading={loading}
      complete={isLuxuryProduct || complete}
    />
  )
}

export default memo(ProductRecent)
