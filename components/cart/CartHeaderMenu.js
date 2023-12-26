import React from 'react'
import Container from '../ui/Container'
import Type from '../ui/Type'
import theme from '../../constants/theme'
import { vw } from '../../utils/dimensions'
import { pluraliseString } from '../../utils/format'

const styleSheet = {
  container: {
    borderBottomWidth: 1,
    borderColor: theme.borderColor
  },
  item: {},
  itemActive: {
    borderBottomWidth: 2,
    borderColor: 'black'
  }
}

const HeaderItem = ({ name, count, activeTab, onPress }) => {
  const active = activeTab === name
  const handlePress = () => {
    onPress(name)
  }
  return (
    <Container
      pv={1.5}
      style={active ? { ...styleSheet.item, ...styleSheet.itemActive } : styleSheet.item}
      onPress={handlePress}
    >
      <Type
        center
        style={{ width: vw(50) }}
        semiBold={active}
        size={13}
        letterSpacing={1}
        heading
        color={active ? 'black' : theme.darkGray}
      >
        {name}
        {count}
      </Type>
    </Container>
  )
}

const CartHeaderMenu = ({ cartQuantity, wishlistItems, onPressItem, activeTab }) => (
  <Container style={styleSheet.container} rows>
    <HeaderItem
      activeTab={activeTab}
      onPress={onPressItem}
      name="bag"
      count={` (${pluraliseString(cartQuantity, 'item')})`}
    />
    <HeaderItem
      activeTab={activeTab}
      onPress={onPressItem}
      name="wishlist"
      count={` (${pluraliseString(wishlistItems?.length, 'item')})`}
    />
  </Container>
)

export default CartHeaderMenu
