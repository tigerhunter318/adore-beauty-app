import React from 'react'
import { StyleSheet, View } from 'react-native'
import { groupArray } from '../../utils/array'
import { isTablet } from '../../utils/device'
import theme from '../../constants/theme'
import Container from '../ui/Container'
import ProductListItem from './ProductListItem'
import CustomCarousel from '../ui/CustomCarousel'

const styleSheet = StyleSheet.create({
  container: {},
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.borderColor,
    borderColor: theme.borderColor,
    borderWidth: 0
  }
})

type ProductCarouselItemProps = {
  item: any
  navigation?: any
  hasImage: boolean
  productProps?: {}
}

const ProductCarouselItem = ({ item, navigation, hasImage, productProps = {} }: ProductCarouselItemProps) => (
  <View style={styleSheet.slide}>
    <Container rows justify="flex-start" style={{ width: '100%' }}>
      {item &&
        item.map((product: { product_id: string | number | null | undefined }) => (
          <ProductListItem
            {...productProps}
            data={product}
            key={product.product_id}
            navigation={navigation}
            hasFavourite={false}
            hasImage={hasImage}
          />
        ))}
      {item && item.length === 1 && <ProductListItem hasAddToCart hasQuickView />}
    </Container>
  </View>
)

type ProductCarouselProps = {
  products?: []
  navigation: any
  containerHeight?: number
  productProps?: {}
}

const ProductCarousel = ({
  products,
  navigation,
  containerHeight = 370,
  productProps = {
    hasReview: false,
    hasFavourite: false,
    hasAddToCart: true,
    hasQuickView: true
  }
}: ProductCarouselProps) => {
  const renderItem = ({ item, isViewable }) =>
    isViewable && (
      <ProductCarouselItem item={item} navigation={navigation} productProps={productProps} hasImage={isViewable} />
    )

  if (products && products.length > 0) {
    const items = groupArray(products, isTablet() ? 3 : 2)
    return <CustomCarousel items={items} containerHeight={containerHeight} renderItem={renderItem} />
  }
  return null
}

export default ProductCarousel
