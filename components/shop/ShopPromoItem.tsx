import React from 'react'
import Container from '../ui/Container'
import Type from '../ui/Type'
import ResponsiveImage from '../ui/ResponsiveImage'
import theme from '../../constants/theme'
import { formatPromotionData } from '../promotions/utils/helpers'
import ImageSize from '../../constants/ImageSize'

const styleSheet = {
  carouselItem: {
    height: 325,
    backgroundColor: theme.white,
    shadowColor: theme.black,
    shadowOffset: { width: 2, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 10,
    paddingBottom: 10
  },
  itemImageWrapper: {
    width: '100%',
    backgroundColor: theme.white,
    marginTop: 5,
    height: 202
  },
  itemImageContainer: {
    width: 130,
    height: 130
  },
  title: {
    height: 44
  },
  description: {
    lineHeight: 24,
    letterSpacing: 0.5,
    color: theme.lightBlack
  }
}

const colors = [theme.darkPeach, theme.darkOrange]

type ShopPromoItemsProps = {
  item: {}
  index: number
  onPromoPress: (item: any) => void
}

const ShopPromoItem = ({ item, index, onPromoPress }: ShopPromoItemsProps) => {
  const { code, isAddFreeItem, description, title, image } = formatPromotionData(item)
  const hasCouponCode = !isAddFreeItem && code
  const { width, height } = ImageSize.product.medium
  const handlePressPromo = () => onPromoPress({ item })

  return (
    <Container
      testID="ShopPromoItem"
      key={index}
      align
      ph={0.5}
      style={[
        styleSheet.carouselItem,
        {
          backgroundColor: colors[index % colors.length]
        }
      ]}
      activeOpacity={1}
      onPress={handlePressPromo}
    >
      <Container style={styleSheet.itemImageWrapper} center justify="space-between">
        <Container style={styleSheet.title} align mt={1.5}>
          <Type heading size={14} center ph={2.2} lineHeight={22} bold numberOfLines={2}>
            {title}
          </Type>
        </Container>
        <Container style={styleSheet.itemImageContainer} mt={1.3}>
          {image && <ResponsiveImage src={image} width={width} height={height} useAspectRatio />}
        </Container>
      </Container>
      <Container pt={1}>
        {hasCouponCode && (
          <Type bold center ph={1.6} numberOfLines={2}>
            USE PROMO CODE{' '}
            <Type bold center color={theme.white}>
              {' '}
              {code}
            </Type>
          </Type>
        )}
        <Type
          numberOfLines={hasCouponCode ? 3 : 4}
          pt={0.5}
          size={13}
          left
          ph={2.1}
          letterSpacing={0.09}
          lineHeight={20}
          center
        >
          {description}
        </Type>
      </Container>
    </Container>
  )
}

export default ShopPromoItem
