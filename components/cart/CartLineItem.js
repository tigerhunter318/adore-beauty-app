import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import Container from '../ui/Container'
import Type from '../ui/Type'
import theme from '../../constants/theme'
import { getIn } from '../../utils/getIn'
import cart from '../../store/modules/cart'
import ResponsiveImage from '../ui/ResponsiveImage'
import { useActionState } from '../../store/utils/stateHook'
import CartLineItemDetails from './CartLineItemDetails'
import { bigcommerceUtils } from '../../services/bigcommerce'
import CartLineItemRemove from './CartLineItemRemove'
import { withScreenRouter } from '../../navigation/router/screenRouter'

const styleSheet = {
  image: {
    width: 100,
    height: 100,
    backgroundColor: theme.borderColor
  },
  cartRow: {
    borderBottomWidth: 1,
    borderColor: theme.borderColor
  },
  quantityInput: {
    width: 40,
    height: 30,
    textAlign: 'center',
    borderWidth: 1
  }
}

const CartLineItem = ({ item, product, isQuantityChangeEnabled }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [numberOfLines, setNumberOfLines] = useState(0)
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const quantity = getIn(item, 'quantity')
  const name = getIn(item, 'name')
  const productImage = item.image_url || product.productImage || ''
  const isGift = bigcommerceUtils.isGiftItem(item)
  const isAutoAddGift = bigcommerceUtils.isAutoAddGiftItem(item)
  const cartPending = useActionState('cart.request.pending')

  const handleLoading = async func => {
    setIsLoading(true)
    await func()
    setIsLoading(false)
  }

  const handleLineItemQuantityChange = qty =>
    handleLoading(() => dispatch(cart.actions.changeLineItemQuantity(item, Math.max(1, qty))))

  const handleLineItemRemove = () => {
    handleLoading(() => dispatch(cart.actions.removeLineItem(item)))
  }

  const handleLineItemPress =
    !isGift && product
      ? () => withScreenRouter(navigation).push('ProductStack/Product', { ...product, productSku: item.sku })
      : undefined

  return (
    <Container pv={1} ph={2} background={isGift ? theme.lighterPink : undefined} testID="CartLineItem">
      <Container rows>
        <Container style={styleSheet.image} mr={1} onPress={handleLineItemPress}>
          {productImage && <ResponsiveImage width={100} height={100} src={productImage} useAspectRatio />}
        </Container>
        <Container style={styleSheet.details} flex={1} pt={0.4}>
          <Container rows zIndex={1}>
            <Container onPress={!isGift && handleLineItemPress} flex={1}>
              <Type
                numberOfLines={2}
                size={13}
                lineHeight={22}
                onTextLayout={e => setNumberOfLines(e.nativeEvent.lines.length)}
              >
                {name}
              </Type>
            </Container>
            {!isAutoAddGift && <CartLineItemRemove disabled={isLoading} onRemovePress={handleLineItemRemove} />}
          </Container>
          <CartLineItemDetails
            isQuantityChangeEnabled={isQuantityChangeEnabled}
            quantity={quantity}
            product={product}
            numberOfLines={numberOfLines}
            onQuantityChange={handleLineItemQuantityChange}
            item={item}
            isGift={isGift}
            isLoading={isLoading || cartPending}
            navigation={navigation}
            onProductRemove={handleLineItemRemove}
          />
        </Container>
      </Container>
    </Container>
  )
}

export default CartLineItem
