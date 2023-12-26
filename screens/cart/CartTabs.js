import React from 'react'
import { ErrorBoundary } from '@sentry/react-native'
import CartList from '../../components/cart/CartList'
import Container from '../../components/ui/Container'
import CartExpressPostInfo from '../../components/cart/CartExpressPostInfo'
import CartEmpty from '../../components/cart/CartEmpty'
import CartMinSpend from './messages/CartMinSpend'
import WishlistItems from '../../components/wishlist/WishlistItems'
import CartPromotions from '../../components/promotions/CartPromotions'
import useProductQuery from '../../gql/useProductQuery'
import { useWishlistsProducts } from '../../store/modules/wishlists'
import Loading from '../../components/ui/Loading'
import { useActionState } from '../../store/utils/stateHook'
import { getRemoteConfigNumber } from '../../services/useRemoteConfig'
import { pluraliseString } from '../../utils/format'
import Type from '../../components/ui/Type'
import CartCodes from '../../components/cart/CartCodes'

const BagTab = ({
  isPending,
  hasItems,
  bagItems,
  navigation,
  isBelowMinimum,
  minSpend,
  cartDetails,
  expressPostInfo,
  onCouponAddedToCart
}) => {
  const giftCertificates = useActionState('cart.giftCertificates')
  const maxGiftCardCodes = getRemoteConfigNumber('max_gift_card_codes')
  const giftPlaceholder =
    giftCertificates?.length === maxGiftCardCodes
      ? `ONLY ${pluraliseString(maxGiftCardCodes, 'gift card').toUpperCase()} PER ORDER`
      : `ADD GIFT CARD`
  const sku = bagItems?.map(item => item.sku)
  const { data } = useProductQuery({ sku }, 'shipping_group, shipping_group_s, brand_name, categories { title }')
  const products = data?.products || []
  const hasDangerousProduct =
    products.findIndex(product => `${product.shipping_group_s}`.toLowerCase() === 'dangerous') !== -1

  return (
    <Container>
      {!hasItems ? (
        <CartEmpty navigation={navigation} isPending={isPending} />
      ) : (
        <>
          <CartPromotions navigation={navigation} />
          <CartList lineItems={bagItems} products={products} />
          <CartCodes
            onCouponAddedToCart={onCouponAddedToCart}
            maxGiftCardCodes={maxGiftCardCodes}
            giftPlaceholder={giftPlaceholder}
          />
          {isBelowMinimum && <CartMinSpend onPress={() => navigation.navigate('Shop')} amount={minSpend} />}
          {!isBelowMinimum && expressPostInfo?.isEnabled && !hasDangerousProduct && minSpend !== 0 && (
            <CartExpressPostInfo cartDetails={cartDetails} minAmount={expressPostInfo?.minAmount} />
          )}
        </>
      )}
    </Container>
  )
}

const WishlistTab = ({ navigation }) => {
  const { wishlistsProducts, loading } = useWishlistsProducts()

  if (loading) return <Loading screen lipstick />

  return <WishlistItems items={wishlistsProducts} navigation={navigation} />
}

const CartTabs = ({ tabName, ...props }) => (
  <Container pb={5}>
    {tabName === 'bag' ? (
      <BagTab {...props} />
    ) : (
      <ErrorBoundary
        fallback={
          <Type center mt={2}>
            Unable to load wishlist.
          </Type>
        }
      >
        <WishlistTab {...props} />
      </ErrorBoundary>
    )}
  </Container>
)

export default CartTabs
