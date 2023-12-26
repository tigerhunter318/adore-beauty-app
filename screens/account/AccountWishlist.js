import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { ScrollView } from 'react-native'
import { useActionState } from '../../store/utils/stateHook'
import Container from '../../components/ui/Container'
import Type from '../../components/ui/Type'
import wishlists from '../../store/modules/wishlists'
import List from '../../components/ui/List'
import IconBadge from '../../components/ui/IconBadge'
import theme from '../../constants/theme'
import CustomButton from '../../components/ui/CustomButton'
import FavouriteWishlistModal from '../../components/wishlist/FavouriteWishlistModal'

const ListItem = ({ item }) => (
  <Container rows>
    <Container flex={1} mr={1}>
      <Type>{item.name}</Type>
    </Container>
    {item.is_public && (
      <Container mr={1}>
        <Container background={theme.orange} pv={0.25} ph={1} borderRadius={5}>
          <Type bold color="white" size={12}>
            Public
          </Type>
        </Container>
      </Container>
    )}
    <Container mr={1} style={{ width: 20 }}>
      <IconBadge
        text={item?.items?.length}
        fontSize={10}
        width={20}
        style={{ top: -1, right: 0, backgroundColor: item?.items?.length > 0 ? theme.orange : theme.darkGray }}
      />
    </Container>
  </Container>
)

const AccountWishlist = ({ navigation }) => {
  const dispatch = useDispatch()
  const [isModalActive, setIsModalActive] = useState(false)
  const isPending = useActionState('wishlists.request.pending')
  const wishlistsItems = useActionState('wishlists.wishlists')

  const handleWishlistPress = wishlist => {
    navigation.push('AccountWishlistProducts', { wishlist })
  }
  const handleCreateWishlist = data => {
    dispatch(wishlists.actions.addToWishlist({ ...data, items: [] }))
  }
  const handleAddNew = () => {
    setIsModalActive(true)
  }

  return (
    <ScrollView testID="AccountWishlistScreen">
      <Container pv={2}>
        <Type bold center size={25}>
          Wishlists
        </Type>
      </Container>
      <Container mb={2}>
        <List items={wishlistsItems} renderItem={ListItem} loading={isPending} onItemPress={handleWishlistPress} />
      </Container>
      <Container center>
        <CustomButton width={200} onPress={handleAddNew} loading={isPending}>
          Add New Wishlist
        </CustomButton>
      </Container>
      <FavouriteWishlistModal
        isVisible={isModalActive}
        isPending={isPending}
        onSubmit={handleCreateWishlist}
        onClose={() => setIsModalActive(false)}
      />
    </ScrollView>
  )
}

export default AccountWishlist
