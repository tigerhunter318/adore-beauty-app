import React, { useEffect, useState } from 'react'
import Container from '../ui/Container'
import useRecommendedProducts, { useRecommendedProductsFilters } from '../shop/hooks/useRecommendedProducts'
import { TabsTiles } from '../ui/MultiTabs'
import ProductsListCarousel from '../product/ProductsListCarousel'
import Type from '../ui/Type'

type ProductRecommendedTabsProps = { itemViewId: number; brandName: string; skip: boolean; refreshing: boolean }

const ProductRecommendedTabs = ({ itemViewId, brandName, skip, refreshing }: ProductRecommendedTabsProps) => {
  const [activeTab, setActiveTab] = useState('similar')
  const filters = useRecommendedProductsFilters(brandName)
  const logic = activeTab === 'similar' ? 'RELATED' : 'ALSO_BOUGHT'
  const { products, trackRecommendationClick, loading, complete, fetchRecommendedProducts } = useRecommendedProducts({
    skip,
    logic,
    refreshing,
    itemViewId,
    filters
  })

  const handleFetchRecommendedProducts = () => {
    if (!skip && logic) {
      fetchRecommendedProducts()
    }
  }

  useEffect(handleFetchRecommendedProducts, [logic, skip])

  if (activeTab === 'similar' && complete && !products && !loading) return null

  return (
    <Container pt={2} style={{ height: 390 }}>
      <TabsTiles
        tabsTiles={['similar', 'recommended']}
        onPress={setActiveTab}
        activeTab={activeTab}
        containerStyle={{ paddingHorizontal: 20, paddingBottom: 10 }}
      />
      {complete && !products && !loading ? (
        <Container justify style={{ height: 280 }}>
          {!!logic && (
            <Container>
              <Type bold size={16} center mb={1}>
                No results
              </Type>
              <Type size={14} ph={2} center pv={1}>
                Sorry, we couldn't find any results.
              </Type>
            </Container>
          )}
        </Container>
      ) : (
        <ProductsListCarousel
          data={products}
          loading={loading}
          hasPlaceholder
          complete={complete}
          contentLoaderConfigs={{
            type: 'ProductCarouselWithoutTitle',
            height: 260
          }}
          testID="ProductScreen.RecommendedProducts"
          trackRecommendationClick={trackRecommendationClick}
        />
      )}
    </Container>
  )
}

export default ProductRecommendedTabs
