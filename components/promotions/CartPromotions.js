import React from 'react'
import { useActionState } from '../../store/utils/stateHook'
import { isValidArray } from '../../utils/validation'
import Container from '../ui/Container'
import CartChooseGift from './CartChooseGift'

const CartPromotions = ({ navigation }) => {
  const promotions = useActionState('cart.promotions')

  if (!isValidArray(promotions)) return null

  return (
    <Container justify pt={0} align testID="CartScreen.Promotions">
      {promotions.map((item, index) => (
        <CartChooseGift
          key={`choose-gift-${item.id}`}
          testID={`CartScreen.Promotions.CartChooseGift-${index}`}
          item={item}
          navigation={navigation}
        />
      ))}
    </Container>
  )
}

export default CartPromotions
