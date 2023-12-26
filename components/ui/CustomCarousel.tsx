import React, { useState, useCallback, memo, useRef } from 'react'
import { StyleSheet } from 'react-native'
import Carousel from 'react-native-reanimated-carousel'
import CarouselPagination from './CarouselPagination'
import { vw } from '../../utils/dimensions'
import Container from './Container'
import { ViewportProvider } from '../viewport/ViewportContext'

const styleSheet = StyleSheet.create({
  dotContainerStyle: {
    paddingTop: 15,
    paddingBottom: 15
  },
  dotStyle: {
    marginHorizontal: 4,
    marginVertical: 0
  },
  activeDotStyle: {
    marginHorizontal: 4,
    marginTop: 0,
    marginBottom: 10
  }
})

type CustomCarouselProps = {
  items: any[]
  sliderWidth?: number
  containerHeight: number
  renderItem: Function
}

const CustomCarousel = ({
  items = [],
  sliderWidth = vw(100),
  containerHeight = 400,
  renderItem
}: CustomCarouselProps) => {
  const [activeSlide, setActiveSlide] = useState<number>(0)
  const [lastViewableIndex, setLastViewableIndex] = useState<number>(0)
  const carouselRef = useRef<any>(null)

  const handleSnapToItem = useCallback(
    (index: number) => {
      if (index > lastViewableIndex) {
        setLastViewableIndex(index)
      }
      setActiveSlide(index)
    },
    [lastViewableIndex]
  )

  const handleRenderItem = useCallback(
    ({ item, index }) => renderItem({ item, index, isViewable: lastViewableIndex >= index }),
    [lastViewableIndex, renderItem]
  )

  if (sliderWidth <= 0) {
    return null
  }

  return (
    <ViewportProvider lazyLoadImage={false}>
      <Container style={{ height: containerHeight }}>
        <Carousel
          loop={false}
          ref={carouselRef}
          data={items}
          windowSize={11}
          renderItem={handleRenderItem}
          width={sliderWidth}
          height={containerHeight - 10}
          onSnapToItem={handleSnapToItem}
          panGestureHandlerProps={{ activeOffsetX: [-10, 10] }}
        />
        {items?.length > 1 && (
          <CarouselPagination
            count={items.length}
            activeIndex={activeSlide}
            containerStyle={styleSheet.dotContainerStyle}
            dotStyle={styleSheet.dotStyle}
            activeDotStyle={styleSheet.activeDotStyle}
          />
        )}
      </Container>
    </ViewportProvider>
  )
}

export default memo(CustomCarousel)
