import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import theme from '../../constants/theme'
import Container from '../ui/Container'
import ResponsiveImage from '../ui/ResponsiveImage'
import Type from '../ui/Type'
import { formatCurrency } from '../../utils/format'
import wishlists, { useFindWishlistByProductId } from '../../store/modules/wishlists'
import ProductAddToCart from '../product/ProductAddToCart'
import Loading from '../ui/Loading'
import { useProductCartPending } from '../product/useProductCartPending'
import { isSmallDevice } from '../../utils/device'
import CartLineItemRemove from '../cart/CartLineItemRemove'
import { isValidArray, isValidNumber } from '../../utils/validation'
import { withScreenRouter } from '../../navigation/router/screenRouter'

const styleSheet = {
  container: {},
  image: {
    width: 100,
    height: 100,
    backgroundColor: theme.borderColor
  },
  cartRow: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.borderColor,
    backgroundColor: 'white'
  }
}

const CartRow = ({ children, ...rest }) => (
  <Container style={styleSheet.cartRow} {...rest}>
    {children}
  </Container>
)

const WishlistLineItem = ({ item, navigation, onItemClick = () => {} }) => {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const wishlistItem = useFindWishlistByProductId(item.product_id)
  const { productData: product, catalogProduct } = item
  const { name, productImage, price, oldPrice, specialPrice, productSku, has_special_price_i, isSalable } = product
  const hasSpecialPrice = !!has_special_price_i && isValidNumber(specialPrice)

  const isOutOfStock = isSalable === 0

  const selectedOption =
    item.variant_id > 1 ? product.attributeOptions?.find(o => o.option_id === item.variant_id) : null

  const isCartPending = useProductCartPending(productSku)
  const isPending = isLoading || isCartPending

  const handleProductRemove = async () => {
    setIsLoading(true)
    await dispatch(wishlists.actions.removeFromWishlist(wishlistItem))
    setIsLoading(false)
  }

  const handleProductPress = async () => {
    setIsLoading(true)
    await withScreenRouter(navigation).push('ProductStack/Product', { ...product, productSku: catalogProduct.sku })
    onItemClick(product)
    setIsLoading(false)
  }

  const Price = () => (
    <Container align rows>
      {!!hasSpecialPrice && !isPending && (
        <Type letterSpacing={1} lineThrough color={theme.lightBlack}>
          {formatCurrency(oldPrice)}{' '}
        </Type>
      )}
      {!isPending ? (
        <Type size={15} bold letterSpacing={1} color={hasSpecialPrice ? theme.orange : theme.black}>
          {formatCurrency(hasSpecialPrice ? specialPrice : price)}
        </Type>
      ) : (
        <Loading size="small" color={theme.lightBlack} />
      )}
    </Container>
  )

  const AddToCart = () => (
    <Container ph={0} pv={0.5} rows>
      <ProductAddToCart
        productData={product}
        productSku={product.productSku}
        cartProductId={product.cartProductId}
        disabled={isOutOfStock}
      />
    </Container>
  )

  return (
    <Container style={styleSheet.container} pv={1.5} ph={1}>
      <Container rows style={{ height: 110 }}>
        <Container style={styleSheet.image} mr={1} onPress={handleProductPress}>
          {productImage && <ResponsiveImage width={100} height={100} src={productImage} useAspectRatio />}
        </Container>
        <Container style={styleSheet.details} flex={1}>
          <Container rows zIndex={1}>
            <Container onPress={handleProductPress} flex={1}>
              <Type numberOfLines={2} size={13} mb={1}>
                {name}
                {selectedOption && <Type color={theme.lightBlack}> - {selectedOption.color}</Type>}
              </Type>
            </Container>
            <CartLineItemRemove disabled={isPending} onRemovePress={handleProductRemove} />
          </Container>
          <Container>
            {isSmallDevice() ? (
              <Container align="flex-start" pt={0.5}>
                <Price />
                <AddToCart />
              </Container>
            ) : (
              <Container rows align pt={1} justify="space-between">
                <AddToCart />
                <Price />
              </Container>
            )}
          </Container>
        </Container>
      </Container>
    </Container>
  )
}

const WishlistItems = ({ items, navigation }) => {
  if (!isValidArray(items)) {
    return (
      <Type center pt={2}>
        No items in Wishlist.
      </Type>
    )
  }

  return (
    <Container>
      {items.map((item, index) => (
        <CartRow key={`${index}-${item.id}`}>
          <WishlistLineItem item={item} navigation={navigation} />
        </CartRow>
      ))}
    </Container>
  )
}

export default WishlistItems
