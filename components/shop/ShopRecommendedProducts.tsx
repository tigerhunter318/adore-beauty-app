import React, { memo, useEffect } from 'react'
import ProductsListCarousel from '../product/ProductsListCarousel'
import useRecommendedProducts from './hooks/useRecommendedProducts'
import useCacheExpiry from '../../hooks/useCacheExpiry'

const ShopRecommendedProducts = ({ refreshing, skip }) => {
  const { products, trackRecommendationClick, loading, complete, fetchRecommendedProducts } = useRecommendedProducts({
    skip
  })

  const handleFetch = () => {
    if (!skip) {
      setCacheTime()
      fetchRecommendedProducts()
    }
  }
  const { setCacheTime } = useCacheExpiry('ShopRecommendedProducts', {
    onExpired: () => {
      handleFetch()
    }
  })

  useEffect(() => {
    if (refreshing) {
      handleFetch()
    }
  }, [refreshing])

  useEffect(() => {
    handleFetch()
  }, [skip])

  return (
    <ProductsListCarousel
      testID="ShopScreen.ShopRecommendedProducts"
      text={`Recommended for `}
      highlightedText="You"
      data={products}
      loading={loading}
      hasPlaceholder
      complete={complete}
      trackRecommendationClick={trackRecommendationClick}
    />
  )
}

export default memo(ShopRecommendedProducts)
