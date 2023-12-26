import React from 'react'
import { StyleSheet } from 'react-native'
import { vw } from '../../utils/dimensions'
import { formatCurrency } from '../../utils/format'
import Container from '../ui/Container'
import Type from '../ui/Type'
import theme from '../../constants/theme'
import ResponsiveImage from '../ui/ResponsiveImage'
import { withScreenRouter } from '../../navigation/router/screenRouter'

const styles = StyleSheet.create({
  productContainer: {
    flexGrow: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: theme.borderColor,
    width: vw(30.5)
  }
})

type CartBottomSheetRecommendationProps = {
  product: any
  onRecommendationPress: (product: any) => void
}

const CartBottomSheetRecommendation = ({ product, onRecommendationPress }: CartBottomSheetRecommendationProps) => {
  const { brand_name: brand, name, productImage, price } = product

  const handleRecommendationPress = () => onRecommendationPress(product)

  return (
    <Container style={styles.productContainer} onPressOut={handleRecommendationPress}>
      <Container center>
        {productImage && (
          <Container width={77}>
            <ResponsiveImage width={77} height={77} src={productImage} useAspectRatio />
          </Container>
        )}
      </Container>
      <Type size={13} semiBold pt={1}>
        {brand}
      </Type>
      <Type numberOfLines={2} size={12} pt={0.5} color={theme.lighterBlack}>
        {name}
      </Type>
      <Type size={13} semiBold pt={0.5}>
        {formatCurrency(price)}
      </Type>
    </Container>
  )
}

const CartBottomSheetRecommendations = ({ navigation, recommendedProducts, onClose, trackRecommendationClick }) => {
  const handleRecommendationPress = productData => {
    const currentRoute = navigation.getCurrentRoute()
    onClose()
    trackRecommendationClick(productData)

    if (currentRoute?.name === 'Product') {
      navigation.setParams({ identifier: null, productSku: null })
    }
    withScreenRouter(navigation).navigate('ProductStack/Product', { ...(productData || {}) })
  }

  return (
    <Container pt={2}>
      <Type bold size={13} letterSpacing={1}>
        You may also like
      </Type>
      <Container rows pt={1}>
        {recommendedProducts.map((product, index) => (
          <CartBottomSheetRecommendation
            key={`product-${index}`}
            product={product}
            onRecommendationPress={handleRecommendationPress}
          />
        ))}
      </Container>
    </Container>
  )
}

export default CartBottomSheetRecommendations
