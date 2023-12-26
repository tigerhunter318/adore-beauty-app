import React from 'react'
import { StyleSheet, View } from 'react-native'

const styleSheet = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 4,
    backgroundColor: '#D8D8D8',
    opacity: 0.4,
    scaleX: 0.6,
    scaleY: 0.6
  },
  activeDot: {
    backgroundColor: '#000000',
    opacity: 1,
    scaleX: 1,
    scaleY: 1
  }
})

type CarouselPaginationProps = {
  activeIndex?: number
  count: number
  containerStyle?: any
  dotStyle?: any
  activeDotStyle?: any
}

const CarouselPagination = ({
  activeIndex = 0,
  count,
  containerStyle = {},
  dotStyle = {},
  activeDotStyle = {}
}: CarouselPaginationProps) => {
  const dots = []

  const getDotStyle = index => [
    styleSheet.dot,
    dotStyle,
    index === activeIndex && { ...styleSheet.activeDot, activeDotStyle }
  ]

  for (let i = 0; i < count; i += 1) {
    dots.push(<View key={i} style={getDotStyle(i)} />)
  }

  return <View style={[styleSheet.container, containerStyle]}>{dots}</View>
}

export default CarouselPagination
