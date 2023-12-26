import React, { useState } from 'react'
import { Alert } from 'react-native'
import { useDispatch } from 'react-redux'
import Icon from '../ui/Icon'
import wishlists, { useFindWishlistByProductId } from '../../store/modules/wishlists'
import { useActionState, useIsLoggedIn } from '../../store/utils/stateHook'
import FavouriteWishlistModal from './FavouriteWishlistModal'
import Container from '../ui/Container'
import Loading from '../ui/Loading'
import { algoliaInsights } from '../../services/algolia'
import { appReview } from '../../services/appReview'
import { emarsysService } from '../../services/emarsys/emarsys'
import { emarsysEvents } from '../../services/emarsys/emarsysEvents'
import theme from '../../constants/theme'

const styleSheet = {
  container: {}
}

const FavouriteButtonPlaceHolder = () => {
  const handleFavouritePress = () => {
    Alert.alert(
      'Please select a shade',
      'You will need to choose a product shade before you can add it to your Wishlist',
      [{ text: 'OK' }],
      { cancelable: false }
    )
  }

  return (
    <Container style={{ width: 24, height: 24 }}>
      <Icon name="ios-heart-empty" type="ion" style={{ opacity: 0.2 }} onPress={handleFavouritePress} />
    </Container>
  )
}

const FavouriteButtonContainer = ({
  productData,
  navigation,
  variantId,
  catalogProductId,
  containerComponent = null,
  onProductRemove
}) => {
  const dispatch = useDispatch()
  const [isModalActive, setIsModalActive] = useState(false)
  const [loading, setLoading] = useState(false) // useActionState('wishlists.request.pending')
  const lists = useActionState('wishlists.wishlists') || []
  const account = useActionState('customer.account')
  const isLoggedIn = useIsLoggedIn()
  const wishlistItem = useFindWishlistByProductId(catalogProductId)
  const defaultWishlistId = lists?.[0]?.id
  const isFavourite = !!wishlistItem

  const trackFavouriteAddTag = async () => {
    emarsysEvents.trackCustomEvent('addToWishlist', {
      'Product ID': `${productData?.product_id}`,
      'Product SKU': productData?.productSku?.[0],
      'Product Name': productData?.name,
      'Product Brand': productData?.brand_name,
      'Product Image URL': productData?.productImage,
      'Product Price': `${productData?.price}`,
      'Product link URL': productData?.product_url,
      'Product Categories': productData?.categories?.map(category => category.title).join(','),
      has_special_price: Number(productData?.oldPrice) > Number(productData?.price) ? '1' : '0'
    })
  }

  const handleFavouriteRemove = async () => {
    setLoading(true)
    await dispatch(wishlists.actions.removeFromWishlist(wishlistItem))
    setLoading(false)
  }
  const handleFavouriteAdd = async data => {
    setLoading(true)
    const items = [{ product_id: catalogProductId }]

    await emarsysService.pauseInAppMessages()
    await dispatch(wishlists.actions.addToWishlist({ ...data, items }))

    if (onProductRemove) {
      onProductRemove()
    }

    emarsysService.resumeInAppMessages()

    if (productData.queryId) {
      algoliaInsights.addProductToFavorite(account, productData)
    }

    trackFavouriteAddTag()

    appReview.rateAppFromWishlist()

    setLoading(false)
  }
  const handleFavouritePress = () => {
    if (!isLoggedIn) {
      navigation.navigate('Login', { goBack: true })
    } else if (!lists?.length || lists?.length > 1) {
      setIsModalActive(true)
    } else {
      handleFavouriteAdd({ id: defaultWishlistId })
    }
  }

  return (
    <Container>
      {containerComponent ? (
        containerComponent(loading, handleFavouritePress, Loading, Icon)
      ) : (
        <Container style={{ width: 24, height: 24 }}>
          {loading && <Loading size="small" color={theme.lightBlack} />}
          {!loading && (
            <Icon
              name={isFavourite ? 'ios-heart' : 'ios-heart-empty'}
              type="ion"
              style={styleSheet.icon}
              onPress={isFavourite ? handleFavouriteRemove : handleFavouritePress}
            />
          )}
        </Container>
      )}

      <FavouriteWishlistModal
        isVisible={isModalActive}
        isPending={loading}
        lists={lists}
        onSubmit={handleFavouriteAdd}
        onClose={() => setIsModalActive(false)}
      />
    </Container>
  )
}
const FavouriteButton = ({ loadingCatalogData, ...rest }) => {
  if (loadingCatalogData) {
    return (
      <Container style={{ width: 24, height: 24 }}>
        <Loading size="small" color="black" />
      </Container>
    )
  }
  if (rest?.catalogProductId) {
    return <FavouriteButtonContainer {...rest} />
  }
  return <FavouriteButtonPlaceHolder />
}

export default FavouriteButton
