import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { RefinementListItem } from 'instantsearch.js/es/connectors/refinement-list/connectRefinementList'
import RadioInput, { RadioInputProps } from '../../ui/RadioInput'
import Container from '../../ui/Container'
import SearchSuggestionsHitsHighlightItem from '../SearchSuggestionsHitsHighlightItem'
import Type from '../../ui/Type'
import theme from '../../../constants/theme'
import { formatNumber } from '../../../utils/format'

type SearchProductsRefinementsRadioProps = { item: RefinementListItem } & RadioInputProps

const styles = StyleSheet.create({
  filterCountContainer: {
    flexDirection: 'row',
    backgroundColor: theme.lightGrey,
    borderWidth: 0,
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 12
  }
})

const SearchProductsRefinementsRadio = ({ checked, onPress, item, ...props }: SearchProductsRefinementsRadioProps) => {
  const [disabled, setDisabled] = useState<boolean>()
  const handlePress = useCallback(
    evt => {
      if (onPress && !disabled) {
        setDisabled(true)
        onPress(evt)
      }
    },
    [disabled]
  )

  const handleCheckedChange = useCallback(() => {
    if (disabled) {
      setDisabled(false)
    }
  }, [disabled])
  useEffect(handleCheckedChange, [checked])

  return (
    <RadioInput
      {...props}
      checked={checked}
      onPress={handlePress}
      disabled={disabled}
      label={
        <Container pt={0.5} align center rows style={{ width: '75%' }}>
          <SearchSuggestionsHitsHighlightItem highlighted={item.highlighted || ''} />
          <Container ml={1} style={styles.filterCountContainer}>
            <Type color={theme.lightBlack} size={13} letterSpacing={0.5}>
              {formatNumber(item.count)}
            </Type>
          </Container>
        </Container>
      }
    />
  )
}

export default SearchProductsRefinementsRadio
