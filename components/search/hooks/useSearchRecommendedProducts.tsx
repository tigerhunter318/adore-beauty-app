import { useEffect } from 'react'
import { isValidArray } from '../../../utils/validation'
import useRecommendedProducts from '../../shop/hooks/useRecommendedProducts'
import { useRecentProducts } from '../../shop/hooks/useRecentProducts'

const useSearchRecommendedProducts = () => {
  const { products: recommendedProducts, trackRecommendationClick, fetchRecommendedProducts } = useRecommendedProducts({
    skip: false
  })
  const { products: recentProducts, loading, complete: isRecentQueryComplete } = useRecentProducts({ skip: false })

  const handleFetchRecommendedProducts = () => {
    if (isRecentQueryComplete && !isValidArray(recentProducts)) {
      fetchRecommendedProducts()
    }
  }

  useEffect(handleFetchRecommendedProducts, [isRecentQueryComplete])

  // TOOD return loading
  return { recentProducts, recommendedProducts, trackRecommendationClick }
}

export default useSearchRecommendedProducts
