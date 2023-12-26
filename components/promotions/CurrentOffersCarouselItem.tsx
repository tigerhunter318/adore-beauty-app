import React from 'react'
import { StyleSheet } from 'react-native'
import { formatPromotionData } from './utils/helpers'
import Container from '../ui/Container'
import Type from '../ui/Type'
import ResponsiveImage from '../ui/ResponsiveImage'
import theme from '../../constants/theme'
import ImageSize from '../../constants/ImageSize'

const styles = StyleSheet.create({
  item: {
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageContainer: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

type CurrentOffersCarouselItemProps = {
  item: {}
  index: number
  onPress: ({ item }: { item: object }) => void
  height?: number
  imageSize?: number
}

const CurrentOffersCarouselItem = ({
  item,
  index,
  onPress,
  height = 380,
  imageSize = 160
}: CurrentOffersCarouselItemProps) => {
  const { brandLogo, image, title } = formatPromotionData(item)
  const imageUrl = image || brandLogo
  const { width: imageWidth, height: imageHeight } = ImageSize.promotion.thumbnail

  return (
    <Container ph={1} style={[styles.item, { height }]} key={index} onPress={() => onPress({ item })}>
      {imageUrl ? (
        <Container style={styles.imageContainer}>
          <ResponsiveImage
            src={imageUrl}
            width={imageWidth}
            height={imageHeight}
            displayWidth={imageSize}
            useAspectRatio
          />
        </Container>
      ) : (
        <Container
          style={{ width: imageSize, height: imageSize }} // image placeholder
        />
      )}
      <Type semiBold letterSpacing={1.5} center mt={2} style={{ height: 70 }} numberOfLines={4}>
        {title}
      </Type>
      <Container>
        <Type heading size={12} pt={2} color={theme.lighterBlack}>
          View Offer
        </Type>
        <Container style={{ borderBottomWidth: 1, borderBottomColor: theme.darkGray, paddingTop: 5 }} />
      </Container>
    </Container>
  )
}

export default CurrentOffersCarouselItem
