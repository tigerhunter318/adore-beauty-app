import React, { useCallback, memo, useState } from 'react'
import { FlatList } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { ViewportProvider } from '../viewport/ViewportContext'
import { groupArray } from '../../utils/array'
import { isValidArray } from '../../utils/validation'
import { isSmallDevice } from '../../utils/device'
import { vw } from '../../utils/dimensions'
import Container from './Container'
import useViewableItems from '../../hooks/useViewableItems'
import settings from '../../constants/settings'
import ProductListItem from '../product/ProductListItem'
import ShopPromoItem from '../shop/ShopPromoItem'
import CurrentOffersCarouselItem from '../promotions/CurrentOffersCarouselItem'
import PromoBannerItem from '../promotions/PromoBannerItem'

type ProductsCarouselItemProps = {
  items: [] | any
  width: number
  isLastSlide: boolean
  isFirstSlide: boolean
  carouselItemStyle: object
  navigation: any
  productProps: {
    hasReview: boolean
    hasFavourite: boolean
    hasAddToCart: boolean
    hasQuickView: boolean
  }
  trackRecommendationClick?: (product?: any) => void
}

const ProductsCarouselItem = ({
  items,
  width,
  navigation,
  carouselItemStyle,
  isFirstSlide,
  isLastSlide,
  productProps = {
    hasReview: false,
    hasFavourite: false,
    hasAddToCart: true,
    hasQuickView: true
  },
  trackRecommendationClick
}: ProductsCarouselItemProps) => (
  <Container
    rows
    width={isSmallDevice() ? 270 : width}
    ml={isFirstSlide && 1}
    mr={isLastSlide && 1}
    style={carouselItemStyle}
  >
    {items.map((item: object, index: number) => (
      // @ts-ignore
      <ProductListItem
        data={item}
        navigation={navigation}
        hasFavourite={false}
        hasImage
        styles={{ inner: { padding: 10 } }}
        displayWidth={isSmallDevice() ? 100 : 120}
        key={`products-carousel-item-${index}`}
        isCarouselItem
        trackRecommendationClick={trackRecommendationClick}
        {...productProps}
      />
    ))}
  </Container>
)

type PromotionsCarouselItemProps = {
  items: [] | any
  width: number
  onPress: ({ item }: { item: object }) => void
  isLastSlide: boolean
  isFirstSlide: boolean
  carouselItemStyle: object
}

const PromotionsCarouselItem = ({
  items,
  width,
  onPress,
  isLastSlide,
  isFirstSlide,
  carouselItemStyle
}: PromotionsCarouselItemProps) => (
  <Container rows ml={isFirstSlide && 2}>
    {items.map((item: object, index: number) => (
      <Container
        width={width}
        style={carouselItemStyle}
        mr={isLastSlide && 3}
        key={`promotions-carousel-item-${index}`}
      >
        <ShopPromoItem item={item} index={index} onPromoPress={onPress} />
      </Container>
    ))}
  </Container>
)

type PromoBannersCarouselItemProps = {
  items: [] | any
  width: number
  onPress: ({ item }: { item: object }) => void
  isLastSlide: boolean
  isFirstSlide: boolean
  carouselItemStyle: object
  loadingLinkUrl: string
}

const PromoBannersCarouselItem = ({
  items,
  width,
  onPress,
  isLastSlide,
  isFirstSlide,
  carouselItemStyle,
  loadingLinkUrl
}: PromoBannersCarouselItemProps) => (
  <Container rows ml={isFirstSlide && 2}>
    {items.map((item: any, index: number) => (
      <Container
        width={width}
        style={carouselItemStyle}
        mr={isLastSlide && 3}
        key={`promotions-carousel-item-${index}`}
      >
        <PromoBannerItem item={item} index={index} isLoading={item?.url === loadingLinkUrl} onPress={onPress} />
      </Container>
    ))}
  </Container>
)

type OffersCarouselItemProps = {
  items: [] | any
  width: number
  onPress: ({ item }: { item: object }) => void
  isLastSlide: boolean
  isFirstSlide: boolean
  isSingleSlide: boolean
  carouselItemStyle: object
}

const OffersCarouselItem = ({
  items,
  width,
  onPress,
  isLastSlide,
  isFirstSlide,
  isSingleSlide,
  carouselItemStyle
}: OffersCarouselItemProps) => (
  <Container>
    {isSingleSlide && !items?.[1] ? (
      <Container width={vw(100)} style={carouselItemStyle}>
        <CurrentOffersCarouselItem item={items[0]} onPress={onPress} index={0} />
      </Container>
    ) : (
      <Container rows ml={isFirstSlide && vw(20) / 10} mr={isLastSlide && vw(20) / 10}>
        {items.map((item: object, index: number) => (
          <Container width={width} style={carouselItemStyle} key={`offers-carousel-item-${index}`}>
            <CurrentOffersCarouselItem item={item} index={index} onPress={onPress} />
          </Container>
        ))}
      </Container>
    )}
  </Container>
)

const CustomFlatlistCarouselItem = (props: any) => {
  switch (props.type) {
    case 'products':
      return <ProductsCarouselItem {...props} />
    case 'promotions':
      return <PromotionsCarouselItem {...props} />
    case 'promoBanners':
      return <PromoBannersCarouselItem {...props} />
    case 'currentOffers':
      return <OffersCarouselItem {...props} />
    case 'recentlyOrdered':
      return <ProductsCarouselItem {...props} />
    default:
      return null
  }
}

type CustomFlatlistCarouselProps = {
  data: any[]
  width?: number
  productProps?: any
  type?: string
  onPress?: ({ item }: { item: object }) => void
  footerContent?: any
  lazyLoadImage?: boolean
  carouselItemStyle?: object
  initialNumToRender?: number
  ItemSeparatorComponent?: any
  loadingLinkUrl?: string
  trackRecommendationClick?: (product?: any) => void
}

const CustomFlatlistCarousel = ({
  data = [],
  width = vw(75),
  productProps,
  type = 'products',
  onPress = () => {},
  lazyLoadImage = false,
  carouselItemStyle = {},
  initialNumToRender = 3,
  ItemSeparatorComponent,
  ...props
}: CustomFlatlistCarouselProps) => {
  const navigation = useNavigation()
  const slidesData = groupArray(data, 2).map((items, key) => ({ items, key }))
  const [listRef, setListRef] = useState<FlatList<{ items: any; key: number }> | null>()

  const { handleViewableItemsChanged, isItemViewable, keyExtractor } = useViewableItems({
    keyName: 'key',
    initialNumToRender
  })

  const renderItem = ({ item, index }: { item: { items: object }; index: number }) => {
    if (!isValidArray(item.items) || !isItemViewable(item, index)) return null

    return (
      <CustomFlatlistCarouselItem
        type={type}
        width={width}
        onPress={onPress}
        items={item.items}
        navigation={navigation}
        productProps={productProps}
        carouselItemStyle={carouselItemStyle}
        isSingleSlide={slidesData.length === 1}
        isLastSlide={slidesData.length - 1 === index}
        isFirstSlide={index === 0}
        {...props}
      />
    )
  }

  const getItemLayout = useCallback(
    (_, index) => ({
      length: width,
      offset: width * index,
      index
    }),
    [width]
  )

  if (!isValidArray(slidesData)) return null

  return (
    <ViewportProvider lazyLoadImage={lazyLoadImage}>
      <FlatList
        horizontal
        ref={ref => setListRef(ref)}
        data={slidesData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        viewabilityConfig={settings.viewConfigRef}
        ItemSeparatorComponent={ItemSeparatorComponent}
        onViewableItemsChanged={handleViewableItemsChanged}
        initialScrollIndex={0}
        initialNumToRender={4}
        windowSize={3}
        onEndReachedThreshold={0.1}
        showsHorizontalScrollIndicator={false}
      />
    </ViewportProvider>
  )
}

export default memo(CustomFlatlistCarousel)
