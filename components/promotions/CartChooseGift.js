import React from 'react'
import Container from '../ui/Container'
import Type from '../ui/Type'
import GiftProductCarousel from './GiftProductCarousel'
import theme from '../../constants/theme'
import { useCartLineItems } from '../../store/modules/cart'

const CartChooseGift = ({ item, navigation, testID }) => {
  const cartItems = useCartLineItems()
  const products = item?.rules?.[0]?.actions?.[0]?.products
  const maxQuantity = item?.rules?.[0]?.actions?.[0]?.quantity

  if (cartItems?.length > 0 && products?.length > 0) {
    const itemsInCart = cartItems.filter(
      cartItem => !!products.find(productItem => cartItem.product_id === productItem.id)
    )
    if (itemsInCart?.length >= maxQuantity) {
      return null
    }
  }

  return (
    <Container p={2} background={theme.lighterPink} align testID={testID}>
      <Container background="white">
        <Type center bold mb={1} pt={1}>
          {item.name}
        </Type>
        <Container>{products && <GiftProductCarousel products={products} navigation={navigation} />}</Container>
      </Container>
    </Container>
  )
}

export default CartChooseGift
