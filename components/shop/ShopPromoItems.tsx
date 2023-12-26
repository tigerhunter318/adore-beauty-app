import React from 'react'
import { StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { StackNavigationProp } from '@react-navigation/stack/src/types'
import { vw } from '../../utils/dimensions'
import { isValidArray, isLuxuryBrandProduct } from '../../utils/validation'
import { useScreenRouter } from '../../navigation/router/screenRouter'
import Container from '../ui/Container'
import CustomButton from '../ui/CustomButton'
import theme from '../../constants/theme'
import ContentLoading from '../ui/ContentLoading'
import CustomFlatlistCarousel from '../ui/CustomFlatlistCarousel'
import SectionTitle from '../ui/SectionTitle'

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.white,
    borderColor: theme.black,
    borderWidth: 1,
    marginTop: 10,
    paddingTop: 15,
    paddingBottom: 15,
    width: vw(90)
  }
})

export type ShopPromoItemsProps = {
  items?: []
  testID?: any
  hasTitle?: boolean
  mb?: number
  loading?: boolean
  productData?: any
}

const ShopPromoItems = ({
  items,
  testID,
  hasTitle = true,
  mb = 1,
  loading = false,
  productData
}: ShopPromoItemsProps) => {
  const navigation = useNavigation<StackNavigationProp<any>>()
  const isLuxuryProduct = isLuxuryBrandProduct(productData)
  const { getCurrentScreenPath } = useScreenRouter()

  const handlePromoPress = ({ item }: { item: object }) =>
    navigation.push('HasuraPromoQuickView', { ...item, parentScreenPath: getCurrentScreenPath() })

  const handleShowAllPromotions = () => {
    navigation.push('MainTab', {
      screen: 'Shop',
      params: {
        screen: 'ShopPromotions'
      }
    })
  }

  return (
    <Container style={{ backgroundColor: 'white' }} testID={testID} mb={mb}>
      {hasTitle && <SectionTitle text="latest " highlightedText="promotions" />}
      {loading && <ContentLoading type="Promotions" width={400} />}
      {!loading && isValidArray(items) && (
        <CustomFlatlistCarousel
          data={items}
          onPress={handlePromoPress}
          type="promotions"
          width={vw(100) - 60}
          carouselItemStyle={{ marginLeft: 10 }}
        />
      )}
      {!isLuxuryProduct && (
        <Container justify center>
          <CustomButton
            semiBold
            color={theme.black}
            style={styles.button}
            onPress={handleShowAllPromotions}
            testID="ShopAllPromotions"
          >
            Shop All Promotions
          </CustomButton>
        </Container>
      )}
    </Container>
  )
}

export default ShopPromoItems
