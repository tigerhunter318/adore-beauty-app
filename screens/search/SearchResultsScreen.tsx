import React, { useState } from 'react'
import { Configure, InstantSearch } from 'react-instantsearch-hooks'
import { useActionState } from '../../store/utils/stateHook'
import { useHasFocusedScreen, useScreenFocusEffect } from '../../hooks/useScreen'
import envConfig from '../../config/envConfig'
import Container from '../../components/ui/Container'
import SearchResultsHeader from '../../components/search/SearchResultsHeader'
import SearchProductsHits from '../../components/search/SearchProductsHits'
import SearchArticlesHits from '../../components/search/SearchArticlesHits'
import searchClient from '../../services/algolia'

const initialState = {
  articles: { nbHits: 0, loading: null },
  products: { nbHits: 0, loading: null }
}

const SearchResultsScreen = ({ navigation, route }: any) => {
  const [resultsCountState, setResultsCountState] = useState<{}>(initialState)
  const [tabName, setTabName] = useState('products')
  const isConsentGiven = useActionState('customer.isConsentGiven')
  const productsFilters = isConsentGiven ? 'is_consent_needed_i:0' : ''
  const articlesFilters = isConsentGiven ? 'category_isConsentNeeded=0' : ''
  const { productIndex, articlesIndex } = envConfig.algolia
  const { q: query = '', initialTab } = route?.params || {}
  const isScreenVisible = useHasFocusedScreen()

  const handleCountChange = (newState = {}) => setResultsCountState(prevState => ({ ...prevState, ...newState }))

  const handleTabChange = (category: string) => setTabName(category)

  const onMount = () => {
    if (initialTab && tabName !== initialTab) {
      navigation.setParams({ initialTab: undefined })
      setTabName(initialTab)
    }
  }
  useScreenFocusEffect(onMount, [initialTab, tabName])

  return (
    <Container flexGrow={1}>
      <SearchResultsHeader
        onChangeTab={handleTabChange}
        searchResultCategory={tabName}
        productIndex={productIndex}
        resultsCountState={resultsCountState}
      />
      <Configure clickAnalytics query={query} filters={productsFilters} />
      <SearchProductsHits isVisible={isScreenVisible && tabName === 'products'} onCountChange={handleCountChange} />
      <InstantSearch indexName={articlesIndex} searchClient={searchClient}>
        <Configure clickAnalytics query={query} filters={articlesFilters} />
        <SearchArticlesHits isVisible={isScreenVisible && tabName === 'articles'} onCountChange={handleCountChange} />
      </InstantSearch>
    </Container>
  )
}

export default SearchResultsScreen
