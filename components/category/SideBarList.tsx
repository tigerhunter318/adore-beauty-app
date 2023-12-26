import React from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { isValidArray, isValidObject } from '../../utils/validation'
import Container from '../ui/Container'
import Type from '../ui/Type'
import theme from '../../constants/theme'
import AdoreSvgIcon from '../ui/AdoreSvgIcon'
import IconBadge from '../ui/IconBadge'

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingLeft: 20,
    paddingRight: 15
  },
  right: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  rightText: {
    fontSize: 12,
    color: theme.textGrey,
    marginRight: 10,
    maxWidth: 200
  },
  itemSeparator: {
    borderBottomWidth: 1,
    borderColor: theme.borderColor
  }
})

const ItemSeparatorComponent = () => <Container style={styles.itemSeparator} />

type SideBarListItemProps = {
  onChange: (item: {}) => void
  item: any
  isCurrentRefinement: boolean
  hasNestedOptions: boolean
  isLast: boolean
}

const SideBarListItem = ({ onChange, item, isCurrentRefinement, hasNestedOptions, isLast }: SideBarListItemProps) => {
  const handleItemPress = () => {
    if (!isCurrentRefinement) {
      onChange(item)
    }
  }

  return (
    <Container style={[styles.heading, isLast && styles.itemSeparator]} onPress={handleItemPress}>
      <Type semiBold={isCurrentRefinement || hasNestedOptions} size={13}>
        {item.label}
      </Type>
      {hasNestedOptions && (
        <Container style={styles.right}>
          {item.right && (
            <Type style={styles.rightText} numberOfLines={1}>
              {item.right}
            </Type>
          )}
          {!!item.activeFiltersCount && (
            <Container mr={1} style={{ width: 20 }}>
              <IconBadge
                text={item.activeFiltersCount}
                fontSize={10}
                width={20}
                style={{ top: -10, right: 0, backgroundColor: theme.orange }}
              />
            </Container>
          )}
          <AdoreSvgIcon name="ArrowRight" width={16} height={13} />
        </Container>
      )}
    </Container>
  )
}

type SideBarListProps = {
  data: [] | any
  onChange: (item: {}) => void
  hasNestedOptions?: boolean
  currentRefinement?: string | any
  contentContainerStyle?: any
}

const SideBarList = ({
  data,
  onChange,
  hasNestedOptions = false,
  currentRefinement,
  contentContainerStyle = {}
}: SideBarListProps) => {
  const renderItem = ({ item, index }: { item: { label: string }; index: number }) =>
    isValidObject(item) ? (
      <SideBarListItem
        onChange={onChange}
        item={item}
        isLast={index === data?.length - 1}
        isCurrentRefinement={currentRefinement === item.label}
        hasNestedOptions={hasNestedOptions}
      />
    ) : null

  const keyExtractor = (item: { label: string }, index: number) => `${item?.label}-${index}`

  if (!isValidArray(data)) return null

  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ItemSeparatorComponent={ItemSeparatorComponent}
      contentContainerStyle={contentContainerStyle}
    />
  )
}

export default SideBarList
