import React from 'react'
import { useFindWishlistByProductId } from '../../store/modules/wishlists'
import Container from '../ui/Container'
import Type from '../ui/Type'
import FavouriteButton from '../wishlist/FavouriteButton'

const CartLineItemFavouriteButton = ({ item, ...rest }) => {
  const catalogProductId = item.product_id
  const isFavourite = !!useFindWishlistByProductId(catalogProductId)

  if (isFavourite) {
    return null
  }

  return (
    <FavouriteButton
      catalogProductId={catalogProductId}
      variantId={item?.variant_id}
      containerComponent={(loading, handleFavouritePress, Loading, Icon) => (
        <Container rows align mt={0.5} pb={0.5} onPress={handleFavouritePress}>
          <Container mr={1}>
            {loading && <Loading size="small" color="black" />}
            {!loading && <Icon size={20} name="ios-heart-empty" type="ion" />}
          </Container>
          <Type size={10} bold heading letterSpacing={0.91}>
            Move to wishlist
          </Type>
        </Container>
      )}
      {...rest}
    />
  )
}

export default CartLineItemFavouriteButton
