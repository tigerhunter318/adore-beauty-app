import React from 'react'
import Container from '../ui/Container'
import Type from '../ui/Type'
import theme from '../../constants/theme'
import { getIn } from '../../utils/getIn'
import { formatCurrency } from '../../utils/format'
import QuantityPicker from '../product/QuantityPicker'
import Loading from '../ui/Loading'
import CartLineItemFavouriteButton from './CartLIneItemFavouriteButton'
import { isIos, isSmallDevice } from '../../utils/device'
import { getRemoteConfigItem, getRemoteConfigNumber } from '../../services/useRemoteConfig'

const CartLineItemGiftStockAvailability = ({ item }) => {
  const { sku, availability, inventory_level: inventoryLevel, quantity } = item
  const minimumStockLevel = getRemoteConfigNumber('minimum_stock_level')
  const excludePromosBySku = getRemoteConfigItem('excluded_promo_stock_message_skus')
  const isLowOnStock = inventoryLevel < minimumStockLevel
  const isPromoStockMessageHidden = excludePromosBySku?.includes(sku)
  let status = ''

  if (availability) {
    if (inventoryLevel > 0) {
      status = `Only ${inventoryLevel} left`
    }

    if (availability !== 'available' || inventoryLevel < 1 || inventoryLevel < quantity) {
      status = 'out of stock'
    }
  }

  if (isPromoStockMessageHidden || !inventoryLevel) return null

  return (
    <Type size={10} uppercase bold color={isLowOnStock ? theme.darkRed : theme.green}>
      {isLowOnStock ? status : 'In stock'}
    </Type>
  )
}

const CartLineItemGift = ({ numberOfLines, item }) => (
  <Container justify="space-between" rows>
    <Container>
      <CartLineItemGiftStockAvailability item={item} />
    </Container>
    <Type size={15} pt={numberOfLines > 1 ? 2.2 : 3.8} bold color={theme.orange}>
      FREE
    </Type>
  </Container>
)

const CartLineItemStockAvailability = ({ item }) => {
  const { availability, inventory_level: inventoryLevel, quantity } = item

  if (availability) {
    let status = ''
    if (availability === 'preorder') {
      status = `preorder`
    } else if (availability !== 'available') {
      status = 'product unavailable'
    } else if (inventoryLevel < 1) {
      status = 'out of stock'
    } else if (inventoryLevel < quantity) {
      // status = `only ${item.inventory_level} left in stock.`
      status = `QTY UNAVAILABLE`
    }

    if (status) {
      return (
        <Container mt={0.5}>
          <Type size={10} uppercase bold color={availability === 'preorder' ? theme.orange : theme.darkRed}>
            {status}
          </Type>
        </Container>
      )
    }
  }

  return null
}

const LineItemQuantity = ({ item, onQuantityChange, quantity, isLoading, isQuantityChangeEnabled }) => {
  const itemPrice = getIn(item, 'list_price') || 0
  const width = isIos() ? 45 : 40
  const widthCompensation = isSmallDevice() ? 11 : 8.5
  let hasQuantityPicker = itemPrice > 0 && item?.inventory_level > 0 && isQuantityChangeEnabled
  let maxQuantity = Math.min(item?.inventory_level, getRemoteConfigNumber('max_line_item_quantity'))

  if (item.availability === 'preorder') {
    hasQuantityPicker = true
    maxQuantity = getRemoteConfigNumber('max_line_item_quantity')
  }

  return (
    <Container ph={0} pv={0.5} rows align>
      {hasQuantityPicker && (
        <QuantityPicker
          title="QUANTITY"
          width={quantity === 1 ? `${width + widthCompensation}%` : `${width}%`}
          defaultValue={isLoading ? null : quantity}
          onChange={onQuantityChange}
          numOfOptions={maxQuantity}
        />
      )}
      {!hasQuantityPicker && (
        <Container border={1} ph={1.25} pv={0.5} style={{ borderColor: theme.borderColor }}>
          <Type bold>{quantity}</Type>
        </Container>
      )}
      {!!(quantity > 1) && (
        <Type size={11} ml={1}>
          {formatCurrency(itemPrice)}
        </Type>
      )}
    </Container>
  )
}

const LineItemPrice = ({ isLoading, product, item, quantity }) => {
  const totalPrice = getIn(item, 'extended_list_price') || 0
  const oldPrice = product?.oldPrice ? product?.oldPrice * quantity : 0
  const hasSpecialPrice = !!oldPrice && oldPrice !== totalPrice

  return (
    <Container pb={0.5}>
      {!isLoading && hasSpecialPrice && (
        <Type letterSpacing={1} lineThrough color={theme.lightBlack}>
          {formatCurrency(oldPrice)}{' '}
        </Type>
      )}
      {!isLoading ? (
        <Type size={15} bold letterSpacing={1} color={hasSpecialPrice ? theme.orange : theme.black}>
          {formatCurrency(totalPrice)}
        </Type>
      ) : (
        <Loading size="small" color={theme.lightBlack} />
      )}
    </Container>
  )
}

const CartLineItemDetails = ({
  isGift,
  numberOfLines,
  navigation,
  item,
  product,
  onQuantityChange,
  onProductRemove,
  quantity,
  isLoading,
  isQuantityChangeEnabled
}) => {
  if (isGift) {
    return <CartLineItemGift numberOfLines={numberOfLines} item={item} />
  }

  return (
    <Container>
      <CartLineItemStockAvailability item={item} />
      <Container rows align="flex-end" justify="space-between">
        <Container>
          <LineItemQuantity
            item={item}
            onQuantityChange={onQuantityChange}
            quantity={quantity}
            isLoading={isLoading}
            isQuantityChangeEnabled={isQuantityChangeEnabled}
          />
          {!!item && !!product && (
            <CartLineItemFavouriteButton
              onProductRemove={onProductRemove}
              productData={product}
              item={item}
              navigation={navigation}
            />
          )}
        </Container>
        <LineItemPrice isLoading={isLoading} product={product} item={item} quantity={quantity} />
      </Container>
    </Container>
  )
}

export default CartLineItemDetails
