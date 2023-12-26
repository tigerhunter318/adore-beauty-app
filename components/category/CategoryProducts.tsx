import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { vh } from '../../utils/dimensions'
import { isValidArray } from '../../utils/validation'
import { useCategoryContext } from './CategoryProvider'
import ProductGrid from '../product/ProductGrid'
import Type from '../ui/Type'
import CategoryProductsHeader from './CategoryProductsHeader'
import useCategoryFilters from './hooks/useCategoryFilters'

type CategoryProductsProps = {
  products: [] | any
  loading: boolean
  isFetchingMore: boolean
  onEndReached: ((info: { distanceFromEnd: number }) => void) | null | undefined
  onScroll: any
  hasOffers: boolean
  isBrandCategory: boolean
  handleRefresh: any
  refreshing: boolean
  url: string
  brandLogo: string
  brandBanner: string
}

const CategoryProducts = ({
  products,
  loading,
  isFetchingMore,
  onEndReached,
  onScroll,
  hasOffers,
  isBrandCategory,
  handleRefresh,
  refreshing,
  brandLogo,
  brandBanner,
  url
}: CategoryProductsProps) => {
  const navigation = useNavigation()
  const { appliedSortOption } = useCategoryContext()
  const { numOfActiveGroups: appliedFiltersCount } = useCategoryFilters()

  if (!isValidArray(products) && !loading) {
    return (
      <Type size={16} mt={vh(30) / 10} center>
        Sorry, we couldn't find any results.
      </Type>
    )
  }

  return (
    <ProductGrid
      testID="ShopCategoryProductsScreen.ProductGrid"
      products={products}
      ListHeaderComponent={
        isBrandCategory ? (
          <CategoryProductsHeader
            filterCount={appliedFiltersCount}
            url={url}
            bannerUrl={brandBanner}
            logoUrl={brandLogo}
          />
        ) : null
      }
      hasReview
      navigation={navigation}
      appliedFiltersCount={appliedFiltersCount}
      onEndReached={onEndReached}
      hasImpressionTracking
      refreshing={refreshing}
      onRefresh={handleRefresh}
      onScroll={onScroll}
      containerStyle={{ paddingBottom: 100, height: '100%' }}
      appliedSortingOrder={appliedSortOption.index}
      isFetchingMore={isFetchingMore}
      hasOffers={hasOffers}
      itemHeight={335}
    />
  )
}

export default CategoryProducts
