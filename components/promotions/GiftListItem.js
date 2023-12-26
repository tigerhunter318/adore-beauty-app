import React from 'react'
import Container from '../ui/Container'
import Type from '../ui/Type'
import theme from '../../constants/theme'
import ResponsiveImage from '../ui/ResponsiveImage'
import ProductAddToCart from '../product/ProductAddToCart'
import { formatCurrency } from '../../utils/format'

const styleSheet = {
  container: {
    width: '50%',
    height: 230
  }
}

const bannerStyles = {
  position: 'absolute',
  width: '100%',
  height: 20,
  top: 15,
  left: -40,
  transform: [{ rotate: '-45deg' }]
}

const Banner = ({ text }) => (
  <Container style={bannerStyles} background={theme.orangeColor}>
    <Type bold center heading>
      {text}
    </Type>
  </Container>
)

const GiftListItem = ({ data, navigation, disabled }) => {
  data.gift_items = [
    {
      name: data?.name,
      productImage: data?.images?.[0]?.url_standard
    }
  ]
  const thumbail = data?.images?.[0]?.url_thumbnail
  const imageWidth = 80
  const imageHeight = 80
  const { price } = data
  const brandName = data.name && data.name.split(' - ')[0]
  const title = data.name && data.name.split(' - ')[1]
  const handlePressPromo = item => {
    const image = item.productImage
    const description = item?.description
    const productType = 'gift'
    navigation.push('PromoQuickView', {
      item,
      image,
      description,
      productType
    })
  }

  const onPress = () => handlePressPromo(data)

  return (
    <Container style={styleSheet.container} p={1} ph={0.5} onPress={onPress}>
      <Container border={theme.orangeColor} background="white" style={{ height: 190, overflow: 'hidden' }} p={0.5}>
        <Container align justify>
          <ResponsiveImage
            src={thumbail}
            styles={{
              image: { width: imageWidth, height: imageHeight }
            }}
            width={imageWidth}
            height={imageHeight}
            useAspectRatio
          />
        </Container>
        <Type numberOfLines={1} size={12} bold>
          {brandName} {price !== 0 && formatCurrency(price)}
        </Type>
        <Type numberOfLines={2} size={12} mb={1.2}>
          {title}
        </Type>

        <Container style={{ position: 'absolute', right: 5, top: 142 }}>
          <ProductAddToCart
            productData={data}
            productSku={data.sku}
            cartProductId={data.id}
            optimized
            disabled={disabled}
            isQuickView={false}
            isGiftView
          />
        </Container>

        {price === 0 && <Banner text="FREE" />}
      </Container>
    </Container>
  )
}

export default GiftListItem
