import React from 'react'
import { StyleSheet, View } from 'react-native'
import { isValidArray } from '../../utils/validation'
import theme from '../../constants/theme'
import Container from '../ui/Container'
import CartLineItem from './CartLineItem'
import Type from '../ui/Type'
import CartLineItemGiftCertificate from './CartLineItemGiftCertificate'

const styles = StyleSheet.create({
  cartRow: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.borderColor,
    backgroundColor: 'white'
  }
})

const CartRow = ({ children, ...rest }) => (
  <Container style={styles.cartRow} {...rest}>
    {children}
  </Container>
)

const CartListProducts = ({ lineItems, products, isQuantityChangeEnabled }) => {
  const getProductDetails = sku => {
    if (sku && isValidArray(products)) {
      return products.find(p => p.productSku.includes(sku))
    }
  }

  return (
    <View testID="CartListProducts">
      {lineItems.map(item => (
        <CartRow key={item.id}>
          {item.name === 'Gift Certificate' ? (
            <CartLineItemGiftCertificate item={item} />
          ) : (
            <CartLineItem
              isQuantityChangeEnabled={isQuantityChangeEnabled}
              item={item}
              product={getProductDetails(item?.sku)}
            />
          )}
        </CartRow>
      ))}
    </View>
  )
}

const CartList = ({ lineItems, products, isQuantityChangeEnabled = true }) =>
  isValidArray(lineItems) ? (
    <CartListProducts isQuantityChangeEnabled={isQuantityChangeEnabled} lineItems={lineItems} products={products} />
  ) : (
    <Type center pt={2}>
      No items in Bag.
    </Type>
  )

export default CartList
