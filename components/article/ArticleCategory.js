import React, { useEffect } from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import Type from '../ui/Type'
import theme from '../../constants/theme'
import Container from '../ui/Container'
import ResponsiveImage from '../ui/ResponsiveImage'

const width = 100
const styleSheet = {
  container: {},
  image: {
    width,
    height: width,
    borderRadius: width,
    backgroundColor: theme.borderColor,
    marginBottom: 10
  }
}

const ArticleCategory = ({ name, type, routineIcon, guideIcon, containerProps = {} }) => (
  <Container style={styleSheet.container} align {...containerProps}>
    {routineIcon && type === 'routines' && (
      <ResponsiveImage
        width={width}
        height={width}
        src={routineIcon}
        useAspectRatio
        styles={{ container: { width, height: width, marginBottom: 10 } }}
      />
    )}
    {guideIcon && type === 'GUIDES' && (
      <ResponsiveImage
        width={width}
        height={width}
        src={guideIcon}
        useAspectRatio
        styles={{ container: { width, height: width, marginBottom: 10 } }}
      />
    )}
    {!guideIcon && !routineIcon && <View style={styleSheet.image} />}
    <Type bold size={14} heading>
      {name}
    </Type>
    <Type heading size={13} light>
      {type}
    </Type>
  </Container>
)

export default ArticleCategory
