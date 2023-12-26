import React, { useRef } from 'react'
import { TextInput, StyleSheet } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useRecentSearchTerms } from './hooks/useRecentSearchTerms'
import { useScreenFocusEffect } from '../../hooks/useScreen'
import { Timeout } from '../../config/types'
import { isIos } from '../../utils/device'
import SearchBox from '../ui/SearchBox'
import theme from '../../constants/theme'
import { useSearchQuery } from './hooks/useSearchQuery'
import { useScreenRouter } from '../../navigation/router/screenRouter'
import useLuxuryBrands from '../../gql/hasura/brands/hooks/useLuxuryBrands'
import useUrlNavigation from '../../navigation/utils/useUrlNavigation'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 40
  },
  input: {
    height: 40,
    paddingLeft: 35,
    fontSize: isIos() ? 14 : 13, // issue: https://github.com/facebook/react-native/issues/29663
    backgroundColor: theme.white,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: theme.white
  }
})

type SearchScreenHeaderSearchBoxProps = { debounceDelay?: number }

const SearchScreenHeaderSearchBox = ({ debounceDelay = 300 }: SearchScreenHeaderSearchBoxProps) => {
  const inputRef = useRef<TextInput>(null)
  const timeoutRef = useRef<null | Timeout>(null)
  const { searchInputTerm, setSearchInputTerm, searchQuery, setSearchQuery, updateSearchQueries } = useSearchQuery()
  const { addRecentSearchTerm } = useRecentSearchTerms()
  const route = useRoute()
  const navigation = useNavigation()
  const router = useScreenRouter()
  const { findLuxuryBrandUrl } = useLuxuryBrands()
  const urlNavigation = useUrlNavigation()

  // @ts-ignore
  const routeSearchParams = route?.params?.q

  const handleChangeText = (newQuery: string) => {
    setSearchInputTerm(newQuery)
    clearTimeout(timeoutRef.current as Timeout)
    timeoutRef.current = setTimeout(() => setSearchQuery(newQuery), debounceDelay)
  }

  const handleSubmitEditing = async (evt: { preventDefault: () => void; nativeEvent: any }) => {
    const { text } = evt.nativeEvent

    if (text) {
      evt.preventDefault()
      inputRef?.current?.blur()
      clearTimeout(timeoutRef.current as Timeout)
      addRecentSearchTerm(text)
      setSearchQuery(text)

      const luxuryBrandUrl = findLuxuryBrandUrl(text)

      if (luxuryBrandUrl) {
        return urlNavigation.navigate(luxuryBrandUrl, { name: text })
      }

      navigation.navigate('SearchResults', { q: text })
    }
  }

  const handleInputClear = async () => {
    if (route.name !== 'SearchSuggestions') {
      router.navigate('ProductStack/SearchSuggestions')
    }

    await updateSearchQueries('')
  }

  const handleInputFocus = async () => {
    if (route.name === 'Product') {
      updateSearchQueries('')
      router.navigate('ProductStack/SearchSuggestions')
    }

    if (route.name === 'SearchResults') {
      setSearchQuery(searchInputTerm)
      router.navigate('ProductStack/SearchSuggestions')
    }
  }

  const handleScreenFocus = () => {
    if (route.name === 'SearchSuggestions') {
      if (searchInputTerm && searchQuery) {
        setSearchInputTerm(searchQuery)
      }
      if (!searchInputTerm && !searchQuery) {
        setSearchInputTerm(searchQuery)
      }

      setTimeout(() => inputRef?.current?.focus(), 300)
    } else if (route.name === 'SearchResults' && routeSearchParams) {
      setSearchInputTerm(routeSearchParams)
    }
  }

  useScreenFocusEffect(handleScreenFocus, [route.name, routeSearchParams, searchQuery, inputRef?.current])

  return (
    <SearchBox
      placeholder={isIos() ? 'Search brands, products, articles' : 'Search'}
      ref={inputRef}
      inputValue={route.name === 'Product' ? '' : searchInputTerm || ''}
      onChangeText={handleChangeText}
      onClearPress={handleInputClear}
      onFocus={handleInputFocus}
      onSubmitEditing={handleSubmitEditing}
      containerStyles={styles.container}
      inputStyles={{ paddingRight: searchInputTerm ? 35 : 0, ...styles.input }}
      testID={`${route.name}.SearchBox`}
    />
  )
}

export default SearchScreenHeaderSearchBox
