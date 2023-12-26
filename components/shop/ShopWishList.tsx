import React from 'react'
import { StyleSheet } from 'react-native'
import { useScreenRouter } from '../../navigation/router/screenRouter'
import { useWishlistItems } from '../../store/modules/wishlists'
import { useIsLoggedIn } from '../../store/utils/stateHook'
import { isValidArray } from '../../utils/validation'
import Container from '../ui/Container'
import Type from '../ui/Type'
import AdoreSvgIcon from '../ui/AdoreSvgIcon'
import theme from '../../constants/theme'
import Hr from '../ui/Hr'
import SectionTitle from '../ui/SectionTitle'

const styles = StyleSheet.create({
  viewAll: {
    color: theme.orange,
    textTransform: 'uppercase',
    letterSpacing: 1,
    lineHeight: 14,
    textAlign: 'center'
  },
  hr: {
    backgroundColor: theme.splitorColor,
    height: 1,
    marginBottom: 30,
    marginTop: 0
  }
})

const ShopWishList = () => {
  const wishlistItems = useWishlistItems()
  const isLoggedIn = useIsLoggedIn()
  const router = useScreenRouter()

  const handlePressViewAll = () => router.push('MainTab/Account/AccountWishlist')

  if (!isLoggedIn || !isValidArray(wishlistItems)) return null

  return (
    <Container onPress={handlePressViewAll} mb={3}>
      <Hr style={styles.hr} />
      <Container center mb={2}>
        <AdoreSvgIcon name="HeartFull" width={30} height={30} />
      </Container>
      <SectionTitle text="your " highlightedText="wishlist" />
      <Container>
        <Type style={styles.viewAll} semiBold>
          View All ({wishlistItems.length})
        </Type>
      </Container>
    </Container>
  )
}

export default ShopWishList
