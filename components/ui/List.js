import React, { useEffect } from 'react'
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'
import Container from './Container'
import AdoreSvgIcon from './AdoreSvgIcon'
import Type from './Type'
import theme from '../../constants/theme'
import { isValidArray } from '../../utils/validation'

const styleSheet = {
  container: {}
}

const navItemStyle = {
  borderColor: theme.borderColor,
  borderTopWidth: 1
}
const ListItem = ({ item, onPress, hasArrow = true, isLast, renderItem, pv = 1.8, ph = 1.5 }) => {
  const handlePress = evt => {
    onPress(item, evt)
  }
  return (
    <Container
      rows
      align
      pv={pv}
      ph={ph}
      style={[navItemStyle, { borderBottomWidth: isLast ? 1 : 0 }]}
      onPress={!item.disabled && handlePress}
    >
      <Container flex={1} opacity={item.disabled ? 0.5 : undefined}>
        {renderItem && renderItem({ item })}
      </Container>
      {hasArrow && (
        <Container rows align>
          <AdoreSvgIcon name="ArrowRight" width={16} height={13} />
        </Container>
      )}
    </Container>
  )
}

const List = ({ items, flatList = false, scrollEnabled = false, onItemPress, renderItem, ph, pv, ...rest }) => {
  if (!isValidArray(items)) {
    return null
  }
  const renderListItem = (item, index) => (
    <ListItem
      item={item}
      index={index}
      key={`${item.id || item.name}-${index}`}
      isFirst={index === 0}
      isLast={index === items.length - 1}
      onPress={onItemPress}
      renderItem={renderItem}
      ph={ph}
      pv={pv}
    />
  )
  if (flatList) {
    return (
      <FlatList
        scrollEnabled={scrollEnabled}
        data={items}
        numColumns={1}
        keyExtractor={(item, index) => `${item.id || item.name}-${index}`}
        renderItem={({ item, index }) => renderListItem(item, index)}
        {...rest}
      />
    )
  }

  return <Container>{items.map(renderListItem)}</Container>
}

export default List
