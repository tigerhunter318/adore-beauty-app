import React, { memo, useCallback } from 'react'
import { FlatList, ScrollViewProps, StyleSheet } from 'react-native'
import { UseInfiniteHitsProps } from 'react-instantsearch-hooks'
import { useNavigation } from '@react-navigation/native'
import { BaseHit } from 'instantsearch.js'
import { algoliaInsights } from '../../services/algolia'
import { useActionState } from '../../store/utils/stateHook'
import { capitalizeFirstWord } from '../../utils/case'
import { isValidArray } from '../../utils/validation'
import { useRecentSearchTerms } from './hooks/useRecentSearchTerms'
import { useInfiniteHitsResults } from './hooks'
import Type from '../ui/Type'
import Container from '../ui/Container'
import theme from '../../constants/theme'
import CustomButton from '../ui/CustomButton'
import { useSafeInsets } from '../../utils/dimensions'

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    paddingHorizontal: 20
  },
  button: {
    backgroundColor: theme.white,
    borderColor: theme.black,
    borderWidth: 1,
    marginTop: 10,
    paddingTop: 15,
    paddingBottom: 15,
    width: '100%'
  }
})

type SearchSuggestionsArticlesHitsProps = ScrollViewProps & UseInfiniteHitsProps<BaseHit>

const SearchSuggestionsArticlesHits = (props: SearchSuggestionsArticlesHitsProps) => {
  const navigation = useNavigation()
  const account = useActionState('customer.account')
  const { loading, hits, results } = useInfiniteHitsResults(props)
  const { addRecentSearchTerm } = useRecentSearchTerms()
  const { bottom } = useSafeInsets()

  const handleClickQueryItem = (item: any) => {
    algoliaInsights.clickSuggestion(account, item)
    addRecentSearchTerm(item.query)
    navigation.navigate('PostScreen', { sysId: item.objectID })
  }

  const handleMoreArticlesPress = () => {
    navigation.navigate('SearchResults', { q: results?.query, initialTab: 'articles' })
  }

  const renderItem = useCallback(
    ({ item, index }) => (
      <Container
        pv={1}
        ph={2}
        onPress={() => handleClickQueryItem(item)}
        key={`SearchSuggestionsArticlesHits-${item.name}-${index}`}
      >
        <Container rows align>
          <Container style={{ backgroundColor: theme.lighterBlack, height: 5, width: 5 }} />
          <Type color={theme.lightBlack} pl={1} size={13}>
            {capitalizeFirstWord(item.name)}
          </Type>
        </Container>
      </Container>
    ),
    []
  )

  const keyExtractor = useCallback((item: any, index: number) => `${item.name}-${index}`, [])

  return (
    <Container flex={1}>
      <FlatList
        data={hits}
        renderItem={renderItem}
        keyboardDismissMode="on-drag"
        initialNumToRender={20}
        keyExtractor={keyExtractor}
        ListHeaderComponent={
          !loading ? (
            <Container>
              <Type bold size={13} pt={2} pb={1} ph={2} letterSpacing={0.5}>
                Suggestions
              </Type>
              {!isValidArray(hits) && (
                <Type color={theme.lightBlack} size={13} mt={1} ph={2}>
                  no results found
                </Type>
              )}
            </Container>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      {isValidArray(hits) && (
        <Container style={[styles.buttonContainer, { paddingBottom: bottom || 10 }]}>
          <CustomButton
            semiBold
            color={theme.black}
            style={styles.button}
            textStyle={{ letterSpacing: 1 }}
            onPress={handleMoreArticlesPress}
          >
            Show All Articles
          </CustomButton>
        </Container>
      )}
    </Container>
  )
}
export default memo(SearchSuggestionsArticlesHits)
