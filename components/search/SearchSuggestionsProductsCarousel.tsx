import React from 'react'
import { Configure, Index, UseInfiniteHitsProps } from 'react-instantsearch-hooks'
import { useActionState } from '../../store/utils/stateHook'
import { useInfiniteHitsResults } from './hooks'
import { isValidArray } from '../../utils/validation'
import SearchProductsCarousel from './SearchProductsCarousel'
import envConfig from '../../config/envConfig'
import ContentLoading from '../ui/ContentLoading'
import Container from '../ui/Container'

type SearchSuggestionsProductsCarouselProps = UseInfiniteHitsProps & {
  recommendedProducts: any
  recentProducts: any
  query?: string
  trackRecommendationClick?: (productData: any) => void
}

const SearchRelatedProductsCarousel = ({
  recommendedProducts,
  recentProducts,
  trackRecommendationClick,
  query,
  ...props
}: SearchSuggestionsProductsCarouselProps) => {
  const { hits, loading, showMore, isLastPage } = useInfiniteHitsResults(props)
  let data: [] = hits as []
  let title = 'Related Products'
  const hasSuggestions = !!query && !loading
  const hasMore: boolean = hasSuggestions && !isLastPage

  const onEndReached = () => hasMore && showMore()

  if (!hasSuggestions && isValidArray(recentProducts)) {
    data = recentProducts
    title = 'Recently Viewed Products'
  }

  if (!hasSuggestions && !isValidArray(recentProducts) && isValidArray(recommendedProducts)) {
    data = recommendedProducts
    title = 'Best Sellers'
  }

  if (!query && !isValidArray(data)) {
    return (
      <Container>
        <ContentLoading type="RecommendedProducts" height={241} animate={false} />
      </Container>
    )
  }

  return (
    <SearchProductsCarousel
      onEndReached={onEndReached}
      data={query ? data : data?.slice(0, 10)}
      title={title}
      hasMore={hasMore}
      trackRecommendationClick={trackRecommendationClick}
    />
  )
}

const SearchSuggestionsProductsCarousel = (props: SearchSuggestionsProductsCarouselProps) => {
  const isConsentGiven = useActionState('customer.isConsentGiven')
  const productsFilters = isConsentGiven ? 'is_consent_needed_i:0' : ''

  return (
    <Index indexName={envConfig.algolia.productIndex} indexId="ProductsSuggestionsIndex">
      <Configure clickAnalytics filters={productsFilters} hitsPerPage={10} />
      <SearchRelatedProductsCarousel {...props} />
    </Index>
  )
}

export default SearchSuggestionsProductsCarousel
