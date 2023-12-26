import React, { memo, useCallback, useRef } from 'react'
import { Keyboard, ListRenderItemInfo } from 'react-native'
import { FlatList } from 'react-native-gesture-handler' // https://github.com/facebook/react-native/issues/34225#issuecomment-1225205775
import { useRefinementList } from 'react-instantsearch-hooks'
import { RefinementListItem } from 'instantsearch.js/es/connectors/refinement-list/connectRefinementList'
import { formatSlug } from '../../../utils/format'
import { useClearAttributeRefinement } from '../hooks'
import { isValidArray } from '../../../utils/validation'
import SearchRefinementsSearchBox, { SearchRefinementsSearchBoxRef } from './SearchRefinementsSearchBox'
import theme from '../../../constants/theme'
import Container from '../../ui/Container'
import Type from '../../ui/Type'
import SearchProductsRefinementsRadio from './SearchProductsRefinementsRadio'

type SearchProductsRefinementsProps = {
  attribute: string
  limit?: number
  isVisible?: boolean
}
const SearchProductsRefinements = ({ attribute, isVisible, limit = 20 }: SearchProductsRefinementsProps) => {
  const { clearRefinement } = useClearAttributeRefinement()
  const searchBoxRef = useRef<SearchRefinementsSearchBoxRef>(null)
  const {
    items,
    refine,
    toggleShowMore,
    canToggleShowMore,
    isShowingMore,
    searchForItems,
    canRefine
  } = useRefinementList({
    attribute,
    operator: 'or',
    limit,
    showMoreLimit: 200,
    showMore: true,
    sortBy: ['count']
  })

  const handleRefine = (item: RefinementListItem) => {
    Keyboard.dismiss()
    searchBoxRef.current?.clear()
    if (item.isRefined && items.filter((obj: RefinementListItem) => obj.isRefined).length === 1) {
      clearRefinement(attribute)
    } else {
      refine(item.value)
    }
  }

  const onEndReached = () => {
    if (!isShowingMore && canToggleShowMore && items?.length > 0) {
      toggleShowMore()
    }
  }

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<RefinementListItem>) => (
      <Container mb={2}>
        <SearchProductsRefinementsRadio
          id={item.label}
          onPress={() => handleRefine(item)}
          item={item}
          checked={item.isRefined}
        />
      </Container>
    ),
    [canRefine]
  )

  const keyExtractor = useCallback(
    (item: RefinementListItem, index: number) => `${index}-${formatSlug(item.label)}`,
    []
  )

  if (!isVisible) return null

  return (
    <>
      <SearchRefinementsSearchBox onChange={searchForItems} ref={searchBoxRef} />
      {!isValidArray(items) && (
        <Type color={theme.lightBlack} size={13} mt={2} ml={2}>
          no results found
        </Type>
      )}
      <FlatList
        data={items}
        style={{
          paddingVertical: 15,
          paddingHorizontal: 20
        }}
        initialNumToRender={limit}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        contentContainerStyle={{ paddingBottom: 20 }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      />
    </>
  )
}

export default memo(SearchProductsRefinements)
