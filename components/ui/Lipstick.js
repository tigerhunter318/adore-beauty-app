import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import theme from '../../constants/theme'
import Container from './Container'

const LipstickSvg = require('../../assets/images/lipstickLoader.svg').default

const blockContainer = {
  width: 15,
  height: 47,
  left: 100,
  top: 100,
  position: 'absolute'
}
const block = {
  backgroundColor: theme.black60,
  width: 11,
  height: 10,
  left: 2,
  bottom: 2,
  position: 'absolute'
}
const blocks = [
  { ...block, width: 11, height: 19 },
  { ...block, bottom: 21, left: 4, width: 7, height: 10 },
  { ...block, bottom: 31, left: 5.5, width: 4, height: 12 }
]

const Lipstick = ({ width = 215, height = 247 }) => {
  const [progress, setProgress] = useState(0)
  const totalHeight = blocks[0].height + blocks[1].height + blocks[2].height
  const h = totalHeight * progress
  const getStyle = index => {
    const maxHeight = blocks[index].height
    let startHeight = 0
    if (index === 1) {
      startHeight = blocks[0].height
    }
    if (index === 2) {
      startHeight = blocks[0].height + blocks[1].height
    }
    let bh = 0
    if (h >= startHeight) {
      bh = Math.min(maxHeight, h - startHeight)
    }
    return [blocks[index], { height: bh }]
  }
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev < 1 ? prev + 0.05 : 0))
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <Container>
      <LipstickSvg width={width} height={height} />
      <View style={blockContainer}>
        <View style={getStyle(0)} />
        <View style={getStyle(1)} />
        <View style={getStyle(2)} />
      </View>
    </Container>
  )
}

export default Lipstick
