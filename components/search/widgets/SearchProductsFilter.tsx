import React from 'react'
import { FlatList } from 'react-native'
import { useCurrentRefinements, useRefinementList } from 'react-instantsearch-hooks'
import { useProductAttributes } from '../hooks'
import Container from '../../ui/Container'
import { isValidArray } from '../../../utils/validation'
import theme from '../../../constants/theme'
import Type from '../../ui/Type'
import IconBadge from '../../ui/IconBadge'
import AdoreSvgIcon from '../../ui/AdoreSvgIcon'

type SearchProductsFilterItemProps = { attribute: string; label: string; onSelect: any; isVisible?: boolean }

const SearchProductsFilterItem = ({ attribute, label, onSelect, isVisible }: SearchProductsFilterItemProps) => {
  const { items } = useRefinementList({ attribute })
  const { items: currentRefinements } = useCurrentRefinements({ includedAttributes: [attribute] })

  const handlePress = () => onSelect(attribute, label)

  if (!isValidArray(items)) return null
  if (!isVisible) return null

  return (
    <Container
      style={{ borderWidth: 0, borderBottomWidth: 1 }}
      onPress={handlePress}
      rows
      justify="space-between"
      align
      pv={2}
      pl={2}
      pr={1.7}
      border={theme.borderColor}
    >
      <Type semiBold size={13}>
        {label}
      </Type>
      <Container rows justify="flex-end" align>
        {isValidArray(currentRefinements?.[0]?.refinements) && (
          <Container mr={1} style={{ width: 20 }}>
            <IconBadge
              text={currentRefinements[0].refinements.length}
              fontSize={10}
              width={20}
              style={{ top: -10, right: 0, backgroundColor: theme.orange }}
            />
          </Container>
        )}
        <Container rows align>
          <AdoreSvgIcon name="ArrowRight" width={16} height={13} />
        </Container>
      </Container>
    </Container>
  )
}

type SearchProductsAttributesProps = {
  isVisible?: boolean
  onSelectAttribute: (attribute: string, label: string) => void
}

const SearchProductsFilter = ({ onSelectAttribute, isVisible }: SearchProductsAttributesProps) => {
  const attributes = useProductAttributes()

  const renderItem = ({ item }: any) => (
    <SearchProductsFilterItem
      attribute={item.attribute}
      label={item.label}
      onSelect={onSelectAttribute}
      isVisible={isVisible}
    />
  )

  return (
    <FlatList
      style={{ flexGrow: 1 }}
      data={attributes}
      keyExtractor={(item: any) => item.attribute}
      renderItem={renderItem}
    />
  )
}

export default SearchProductsFilter
