import React, { memo, useCallback, useState } from 'react'
import { FlatList, Keyboard, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { isValidArray } from '../../utils/validation'
import { vw } from '../../utils/dimensions'
import {
  formatBrandNameFromProductName,
  formatCurrency,
  formatPageIdentifier,
  formatProductSkuValue,
  stripBrandFromProductName
} from '../../utils/format'
import { useScreenFocusEffect } from '../../hooks/useScreen'
import { isIos } from '../../utils/device'
import Container from '../ui/Container'
import Type from '../ui/Type'
import theme from '../../constants/theme'
import ResponsiveImage from '../ui/ResponsiveImage'
import settings from '../../constants/settings'
import Loading from '../ui/Loading'
import ImageSize from '../../constants/ImageSize'
import ImagePlaceholder from '../ui/ImagePlaceholder'

const width = vw(100) / 3
const height = 215

const styles = StyleSheet.create({
  productContainer: {
    flexGrow: 1,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: theme.borderColor,
    width,
    height
  },
  title: {
    fontSize: 13,
    paddingTop: 20,
    paddingLeft: 20,
    paddingBottom: 10,
    letterSpacing: 0.5
  },
  loading: {
    height,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 20
  }
})

const LoadingIndicator = () => (
  <Container style={styles.loading}>
    <Loading animating />
  </Container>
)

type SearchProductsCarouselItemProps = {
  product: any
  isFirstProduct: boolean
  isLastProduct: boolean
  onProductPress: (product: {}) => void
}

const SearchProductsCarouselItem = ({
  product,
  isFirstProduct,
  isLastProduct,
  onProductPress
}: SearchProductsCarouselItemProps) => {
  const { brand, brand_name, manufacturer, name, productImage, thumbnail_url: thumbNail, price } = product
  const brandName = formatBrandNameFromProductName(brand || manufacturer || brand_name, name)
  const productName = stripBrandFromProductName(brandName, name)
  const { width: imageWidth, height: imageHeight } = ImageSize.product.thumbnail
  const handleProductPress = () => onProductPress(product)

  return (
    <Container
      testID="SearchProductsCarousel.Item"
      style={styles.productContainer}
      onPress={handleProductPress}
      ml={isFirstProduct ? 2 : 0}
      mr={isLastProduct ? 2 : 0}
    >
      <Container center mt={1}>
        {productImage || thumbNail ? (
          <Container width={110}>
            <ResponsiveImage
              width={imageWidth}
              height={imageHeight}
              src={productImage || thumbNail}
              useAspectRatio
              url={undefined}
              displayWidth={undefined}
              displayHeight={undefined}
              strategy={undefined}
            />
          </Container>
        ) : (
          <ImagePlaceholder width={97} />
        )}
      </Container>
      <Type size={13} semiBold pt={1} numberOfLines={1}>
        {brandName}
      </Type>
      <Type numberOfLines={2} size={12} pt={0.5} color={theme.lighterBlack}>
        {productName}
      </Type>
      <Type size={13} semiBold style={{ position: 'absolute', bottom: isIos() ? 10 : 5, left: 10 }}>
        {formatCurrency(price)}
      </Type>
    </Container>
  )
}

type SearchProductsCarouselProps = {
  data: {}[]
  title: string
  onEndReached: () => void
  hasMore: boolean
  trackRecommendationClick: (productData: any) => void
}

const SearchProductsCarousel = ({
  data,
  title,
  onEndReached,
  trackRecommendationClick,
  hasMore = false
}: SearchProductsCarouselProps) => {
  const [listRef, setListRef] = useState<FlatList | null>()
  const navigation = useNavigation<StackNavigationProp<any>>()

  const scrollToIndex = () => {
    if (listRef) {
      listRef.scrollToIndex({ animated: false, index: 0 })
    }
  }
  useScreenFocusEffect(scrollToIndex, [listRef, title])

  const handleProductPress = async (productData: any) => {
    Keyboard.dismiss()
    trackRecommendationClick(productData)

    const url = productData?.url || productData?.product_url
    const identifier = productData?.identifier || formatPageIdentifier(productData.url, true)
    const productSku = formatProductSkuValue(productData.sku || productData.productSku)
    const isGiftCertificate = productSku === 'adore-beauty-gift-certificate'

    if (isGiftCertificate) return navigation.push('GiftCertificate')

    if (!(url || identifier)) return

    navigation.push('Product', {
      productSku,
      product_id: productData.product_id,
      url,
      identifier,
      q: ''
    })
  }

  const renderItem = useCallback(
    ({ item, index }) => (
      <SearchProductsCarouselItem
        isFirstProduct={index === 0}
        isLastProduct={index === data.length - 1}
        key={`search-product-${index}`}
        product={item}
        onProductPress={handleProductPress}
      />
    ),
    [data.length]
  )

  const getItemLayout = useCallback(
    (_, index) => ({
      length: width,
      offset: width * index,
      index
    }),
    []
  )

  const keyExtractor = useCallback((item, index) => `${item.product_id}-${index}`, [])

  if (!isValidArray(data)) return null

  return (
    <Container>
      <Type bold style={styles.title}>
        {title}
      </Type>
      <FlatList
        horizontal
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        ref={ref => setListRef(ref)}
        data={data}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        keyExtractor={keyExtractor}
        viewabilityConfig={settings.viewConfigRef}
        initialScrollIndex={0}
        initialNumToRender={10}
        windowSize={3}
        maxToRenderPerBatch={1}
        onEndReachedThreshold={0.1}
        onEndReached={onEndReached}
        showsHorizontalScrollIndicator={false}
        ListFooterComponent={hasMore ? <LoadingIndicator /> : undefined}
      />
    </Container>
  )
}

export default memo(SearchProductsCarousel)
