import React, { useState, useRef, useCallback, memo } from 'react'
import { StyleSheet, View } from 'react-native'
import Carousel from 'react-native-reanimated-carousel'
import CarouselPagination from '../ui/CarouselPagination'
import { vw } from '../../utils/dimensions'
import { ViewportProvider } from '../viewport/ViewportContext'
import theme from '../../constants/theme'
import Container from '../ui/Container'
import ResponsiveImage from '../ui/ResponsiveImage'
import ImageZoomModal from './ImageZoomModal'
import AdoreSvgIcon from '../ui/AdoreSvgIcon'
import ImageSize from '../../constants/ImageSize'

const styleSheet = StyleSheet.create({
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  dotContainerStyle: {
    marginBottom: 20
  }
})

const imageSlideSize = vw(90)

const ImageGallery = ({ productImages, initialNumToRender = 1 }) => {
  const [imageZoomComponent, setImageZoomComponent] = useState<JSX.Element | null>(null)
  const [activeSlide, setActiveSlide] = useState<number>(0)
  const [lastViewableIndex, setLastViewableIndex] = useState<number>(initialNumToRender - 1)
  const carouselRef = useRef<any>(null)
  const { width: imageWidth, height: imageHeight } = ImageSize.product.large

  const data = productImages.map((image: any, index: any) => ({ id: index, url: image }))

  const handleImageZoomModal = (value: React.SetStateAction<JSX.Element | null>) => setImageZoomComponent(value)

  const getImageComponent = useCallback(
    url => <ResponsiveImage src={url} width={imageWidth} height={imageHeight} useAspectRatio />,
    []
  )

  const renderItem = useCallback(
    ({ item, index }) => {
      const isContentViewable = lastViewableIndex >= index

      const handleImagePress = () => handleImageZoomModal(getImageComponent(item.url))

      return (
        <Container style={styleSheet.slide} onPress={handleImagePress}>
          {getImageComponent(isContentViewable ? item.url : null)}
        </Container>
      )
    },
    [lastViewableIndex]
  )

  const handleZoomIconPress = () => handleImageZoomModal(getImageComponent(data[activeSlide]?.url))

  const handleModalClose = () => handleImageZoomModal(null)

  const onSnapToItem = (index: number) => {
    if (index > lastViewableIndex) {
      setLastViewableIndex(index)
    }
    setActiveSlide(index)
  }

  return (
    <ViewportProvider lazyLoadImage={false}>
      <>
        <View
          style={{
            flex: 1,
            marginTop: 10,
            marginBottom: data?.length > 1 ? 10 : 0
          }}
        >
          <Carousel
            loop={false}
            ref={carouselRef}
            data={data}
            windowSize={1}
            renderItem={renderItem}
            width={imageSlideSize}
            height={imageSlideSize}
            onSnapToItem={onSnapToItem}
            panGestureHandlerProps={{ activeOffsetX: [-10, 10] }}
          />
          <Container
            onPress={handleZoomIconPress}
            style={{
              flex: 1,
              marginTop: 10,
              marginBottom: data?.length > 1 ? 10 : 0
            }}
          >
            <AdoreSvgIcon name="ZoomIn" width={27} height={20} color={theme.black} align />
          </Container>
          {productImages?.length > 1 && (
            <CarouselPagination
              count={productImages.length}
              activeIndex={activeSlide}
              dotStyle={styleSheet.dotContainerStyle}
            />
          )}
        </View>
        <ImageZoomModal imageZoomComponent={imageZoomComponent} onClose={handleModalClose} />
      </>
    </ViewportProvider>
  )
}

export default memo(ImageGallery)
