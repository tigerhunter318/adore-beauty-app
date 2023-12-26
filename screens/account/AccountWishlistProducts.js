import React, { useState } from 'react'
import { Alert, ScrollView } from 'react-native'
import { useDispatch } from 'react-redux'
import { useActionState } from '../../store/utils/stateHook'
import wishlists, { useWishlistsProducts } from '../../store/modules/wishlists'
import Container from '../../components/ui/Container'
import Type from '../../components/ui/Type'
import WishlistItems from '../../components/wishlist/WishlistItems'
import theme from '../../constants/theme'
import CustomButton from '../../components/ui/CustomButton'
import FavouriteWishlistModal from '../../components/wishlist/FavouriteWishlistModal'
import { pluraliseString } from '../../utils/format'
import { isValidArray } from '../../utils/validation'
import Loading from '../../components/ui/Loading'

const AccountWishlistProducts = ({ navigation, route }) => {
  const [isModalActive, setIsModalActive] = useState(false)
  const dispatch = useDispatch()
  const isPending = useActionState('wishlists.request.pending')
  const wishlist = route.params.wishlist || {}
  const { name, is_public, id: wishlistId } = wishlist
  const { wishlistsProducts, loading } = useWishlistsProducts(wishlist.id)

  if (loading) return <Loading screen lipstick />

  const handleRemoveWishlist = async () => {
    await dispatch(wishlists.actions.removeWishlist({ wishlistId }))
    navigation.goBack()
  }

  const handleEditSubmit = formData => {
    dispatch(
      wishlists.actions.updateWishlist({
        wishlistId,
        data: { name: formData.name, is_public: formData.is_public, items: wishlistsProducts }
      })
    )
  }

  const handleEditPress = () => setIsModalActive(true)

  const handleRemovePress = () => {
    const msg = `Are you sure you want to delete the Wishlist "${name}"?`
    Alert.alert(
      'Delete',
      msg,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        { text: 'OK', onPress: handleRemoveWishlist }
      ],
      { cancelable: false }
    )
  }

  return (
    <ScrollView>
      <Container pt={2} mb={1} rows justify="center">
        <Type bold size={25}>
          {name}
        </Type>
      </Container>
      <Container>
        <Container center rows justify>
          {is_public && (
            <Type bold color={theme.orange}>
              Public List{' '}
            </Type>
          )}
          {!is_public && <Type bold>Private List </Type>}
          <Type>{pluraliseString(wishlistsProducts?.length, 'item')}</Type>
        </Container>
      </Container>
      <Container rows center justify="center" pt={2} mb={2}>
        <CustomButton background="white" fontSize={12} pv={0.7} ph={2} mr={1} onPress={handleEditPress}>
          Edit
        </CustomButton>
        <CustomButton background="black" fontSize={12} pv={0.7} border="black" ml={1} onPress={handleRemovePress}>
          Delete
        </CustomButton>
      </Container>
      {isValidArray(wishlistsProducts) ? (
        <WishlistItems navigation={navigation} items={wishlistsProducts} />
      ) : (
        <Type center pt={2}>
          No items in Wishlist.
        </Type>
      )}
      <FavouriteWishlistModal
        isVisible={isModalActive}
        isPending={isPending}
        onSubmit={handleEditSubmit}
        editData={wishlist}
        onClose={() => setIsModalActive(false)}
      />
    </ScrollView>
  )
}

export default AccountWishlistProducts
