import React, { useEffect, useState } from 'react'
import { Configure, Index, InstantSearch } from 'react-instantsearch-hooks'
import { View } from 'react-native'
import Animated, { useSharedValue } from 'react-native-reanimated'
import { useTranslateAnimation } from '../../utils/animate'
import { useResults } from '../../components/search/hooks'
import { getRemoteConfigJson } from '../../services/useRemoteConfig'
import envConfig from '../../config/envConfig'
import searchClient from '../../services/algolia'
import ContentLoading from '../../components/ui/ContentLoading'
import VirtualSearchBox from '../../components/search/VirtualSearchBox'
import useScreenVisible from '../../hooks/useScreenVisible'
import FadeView from '../../components/ui/animation/FadeView'
import SearchSuggestionsArticlesHits from '../../components/search/SearchSuggestionsArticlesHits'
import SearchSuggestionsHits from '../../components/search/SearchSuggestionsHits'
import CustomScreenTabs from '../../components/ui/CustomScreenTabs'
import { useSearchQuery } from '../../components/search/hooks/useSearchQuery'

const ProductsTab = ({ hitsPerPage, query }: { hitsPerPage: number; query: string }) => (
  <Index indexName={envConfig.algolia.suggestionIndex}>
    <Configure clickAnalytics hitsPerPage={hitsPerPage} />
    <SearchSuggestionsHits query={query} />
  </Index>
)

const ArticlesTab = ({ hitsPerPage }: { hitsPerPage: number }) => (
  <Index indexName={envConfig.algolia.articlesIndex} indexId="SearchSuggestionsArticles">
    <Configure clickAnalytics hitsPerPage={hitsPerPage} />
    <SearchSuggestionsArticlesHits />
  </Index>
)

const SearchSuggestionsTabs = ({ query }: { query: string }) => {
  const { articles: articlesHitsPerPage, products: productsHitsPerPage } = getRemoteConfigJson('search_suggestions')

  const routes = [
    {
      key: 'products',
      title: 'Products',
      component: <ProductsTab hitsPerPage={productsHitsPerPage || 100} query={query} />
    },
    {
      key: 'articles',
      title: 'Articles',
      component: <ArticlesTab hitsPerPage={articlesHitsPerPage ? productsHitsPerPage : 100} />
    }
  ]

  return <CustomScreenTabs routes={routes} resetCondition={!query} swipeEnabled={!!query} lazy />
}

const SearchSuggestions = (props: any) => {
  const { isScreenVisible, onReady, hasMounted } = props
  const { suggestionIndex } = envConfig.algolia
  const results = useResults(suggestionIndex)
  const { processingTimeMS } = results
  const { searchQuery = '' } = useSearchQuery()
  const animationRef = useSharedValue(-50)
  const animatedStyle = useTranslateAnimation({
    animationType: 'translateY',
    animationRef,
    visibleValue: -50,
    duration: 150,
    isVisible: !!searchQuery
  })

  const handleReady = () => {
    if (processingTimeMS >= 0) {
      onReady()
    }
  }

  useEffect(handleReady, [processingTimeMS])

  if (!isScreenVisible) return null

  return (
    <>
      {!!hasMounted && <VirtualSearchBox query={searchQuery} />}
      <Animated.View style={[animatedStyle, { flex: 1 }]}>
        <SearchSuggestionsTabs query={searchQuery} />
      </Animated.View>
    </>
  )
}

const SearchSuggestionsScreen = () => {
  const [hasMounted, setHasMounted] = useState<boolean>(false)
  const isScreenVisible = useScreenVisible()

  const handleSuggestionsReady = () => {
    if (!hasMounted) {
      setHasMounted(true)
    }
  }

  return (
    <>
      <InstantSearch indexName={envConfig.algolia.suggestionIndex} searchClient={searchClient}>
        <FadeView testID="SearchSuggestions" active={hasMounted} duration={300} style={{ flexGrow: 1 }}>
          <SearchSuggestions
            isScreenVisible={isScreenVisible}
            onReady={handleSuggestionsReady}
            hasMounted={hasMounted}
          />
        </FadeView>
      </InstantSearch>
      {!hasMounted && (
        <View style={{ position: 'absolute', left: 0, right: 0 }}>
          <ContentLoading type="SearchSuggestions" />
        </View>
      )}
    </>
  )
}

export default SearchSuggestionsScreen
