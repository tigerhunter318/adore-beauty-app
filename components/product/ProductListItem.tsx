import React, { memo } from 'react'
import { StyleSheet, Alert } from 'react-native'
import { isValidObject } from '../../utils/validation'
import Container from '../ui/Container'
import ProductListItemDetails from './ProductListItemDetails'
import { isTablet } from '../../utils/device'
import { useScreenRouter } from '../../navigation/router/screenRouter'
import { formatProductSkuValue } from '../../utils/format'

const styleSheet = StyleSheet.create({
  container: {
    width: isTablet() ? '33%' : '50%',
    padding: 0.5
  },
  inner: {
    padding: 15,
    backgroundColor: 'white'
  }
})

type ProductListItemProps = {
  data?: any
  cb?: () => void
  styles?: any
  navigation?: any
  onProductPress?: () => void
  onQuickViewPress?: () => void
  itemHeight?: number
  quickViewParams?: {}
  isRecommendedProduct?: boolean
  isContentVisible?: boolean
  testID?: any
  hasImage?: boolean
  imageWidth?: number
  hasAddToCart?: boolean
  hasQuickView?: boolean
  hasReview?: boolean
  hasFavourite?: boolean
  isCarouselItem?: boolean
  displayWidth?: number
  trackRecommendationClick?: (data: any) => void
}

const ProductListItem = ({
  data,
  cb,
  styles = {},
  navigation,
  onProductPress,
  onQuickViewPress,
  trackRecommendationClick,
  itemHeight = 305,
  quickViewParams = {},
  isContentVisible = true,
  testID = 'ProductListItem',
  ...props
}: ProductListItemProps) => {
  const productSku = formatProductSkuValue(data?.sku || data?.productSku)
  const isGiftCertificate = productSku === 'adore-beauty-gift-certificate'
  const router = useScreenRouter()

  const formatRouteParams = () => ({
    identifier: data?.identifier,
    productSku,
    product_url: data?.product_url,
    name: data?.name
  })

  const handleTrackRecommendationClick = () => {
    if (trackRecommendationClick) {
      trackRecommendationClick(data)
    }
  }

  const handleProductPress = () => {
    if (isGiftCertificate) {
      return navigation.push('GiftCertificate')
    }

    if (onProductPress) {
      return onProductPress()
    }

    if (cb) {
      cb()
    }

    handleTrackRecommendationClick()
    router.push('ProductStack/Product', formatRouteParams())
  }

  const handleQuickViewPress = () => {
    if (isGiftCertificate) {
      return navigation.push('GiftCertificate')
    }

    if (onQuickViewPress) {
      return onQuickViewPress()
    }

    handleTrackRecommendationClick()
    navigation.push('ProductQuickView', formatRouteParams())
  }

  const handleReviewsPress = () => {
    router.push('ProductStack/ProductTab', { id: 'reviews', name: 'Reviews', product_url: data.product_url })
  }

  const handleAddConfigurableProduct = () => {
    const title = 'Please select an option'
    const message = data?.inStock
      ? "You'll need to select an option in the drop-down menu before adding to bag"
      : "You'll need to select an option in the drop-down menu before signing up for back in stock notifications"

    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Got it',
        style: 'default',
        onPress: handleQuickViewPress
      }
    ])
  }

  return (
    <Container style={[styleSheet.container, styles.container]} testID={testID}>
      <Container activeOpacity={0.8} style={[styleSheet.inner, styles.inner, { height: itemHeight }]}>
        {isValidObject(data) && isContentVisible && (
          <ProductListItemDetails
            data={data}
            onProductPress={handleProductPress}
            onReviewsPress={handleReviewsPress}
            onQuickViewPress={handleQuickViewPress}
            onAddConfigurableProduct={handleAddConfigurableProduct}
            onCartAddSuccess={handleTrackRecommendationClick}
            styles={styles}
            isGiftCertificate={isGiftCertificate}
            {...props}
          />
        )}
      </Container>
    </Container>
  )
}

export default memo(ProductListItem)
