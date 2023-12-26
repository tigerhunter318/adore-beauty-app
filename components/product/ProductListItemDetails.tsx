import React from 'react'
import { StyleSheet } from 'react-native'
import { formatCurrency } from '../../utils/format'
import ResponsiveImage from '../ui/ResponsiveImage'
import Type from '../ui/Type'
import Container from '../ui/Container'
import ReviewSummary from '../product-review/ReviewSummary'
import ProductAddToCart from './ProductAddToCart'
import theme from '../../constants/theme'
import ProductTitle from './ProductTitle'
import { useProductCartPending } from './useProductCartPending'
import ImageSize from '../../constants/ImageSize'
import ImagePlaceholder from '../ui/ImagePlaceholder'

const styleSheet = StyleSheet.create({
  title: {
    marginTop: 15,
    letterSpacing: 0.5
  },
  price: {
    fontSize: 15,
    letterSpacing: 0.5
  },
  footer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  quickViewButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 3
  },
  quickViewButtonText: {
    fontSize: 12,
    color: theme.black,
    textTransform: 'uppercase'
  },
  buttonsContainer: {
    flexDirection: 'row',
    paddingTop: 5,
    justifyContent: 'space-between'
  }
})

const imageStyle = {
  alignSelf: 'center'
}

type ProductListItemDetailsProps = {
  data: any
  onQuickViewPress: () => void
  onProductPress: () => void
  onReviewsPress: () => void
  onAddConfigurableProduct: () => void
  onCartAddSuccess: () => void
  isGiftCertificate: boolean
  styles: any
  imageHeight?: number
  imageWidth?: number
  hasReview?: boolean
  hasAddToCart?: boolean
  hasQuickView?: boolean
  hasImage?: boolean
  isCarouselItem?: boolean
  displayWidth?: number
  displayHeight?: number
  imagePlaceholderSize?: number
}

const ProductListItemDetails = ({
  data,
  imageHeight,
  imageWidth = ImageSize.product.thumbnail.width,
  hasReview = false,
  hasAddToCart = false,
  hasQuickView = false,
  onQuickViewPress,
  onProductPress,
  onReviewsPress,
  onAddConfigurableProduct,
  onCartAddSuccess,
  isGiftCertificate,
  displayWidth,
  displayHeight,
  styles,
  isCarouselItem
}: ProductListItemDetailsProps) => {
  const {
    name,
    productImage,
    brand_name: brandName,
    specialPrice,
    price,
    oldPrice,
    productSku,
    cartProductId,
    productType,
    backorders,
    objectId,
    isSalable,
    inStock,
    attributeOptions
  } = data
  const isConfigurable = productType === 'configurable'
  const isPending = useProductCartPending(productSku, objectId)
  const isBackorders = backorders === 'Backorders' && !inStock && !!isSalable
  const hasSpecialPrice = !!parseFloat(specialPrice)

  return (
    <Container>
      <Container onPress={onProductPress} testID="ProductListItem.Image">
        {productImage ? (
          <ResponsiveImage
            src={productImage}
            styles={{
              image: {
                ...imageStyle
              }
            }}
            width={imageWidth}
            height={imageHeight || imageWidth}
            displayWidth={displayWidth || imageWidth}
            displayHeight={displayHeight || imageHeight || displayWidth || imageWidth}
            useAspectRatio
          />
        ) : (
          <Container center>
            <ImagePlaceholder displayWidth={displayWidth || imageWidth} />
          </Container>
        )}
        <ProductTitle name={name} style={[styleSheet.title, styles.title]} brand={brandName} />
        {isGiftCertificate && <Container mt={2.3} />}
        {!isGiftCertificate && (
          <Container>
            {!hasSpecialPrice && (
              <Type style={[styleSheet.price, styles.price]} bold>
                {formatCurrency(price)}
              </Type>
            )}
            {!!hasSpecialPrice && (
              <Type style={[styleSheet.price, styles.price]}>
                <Type lineThrough>{formatCurrency(oldPrice)}</Type>
                <Type color={oldPrice ? theme.orange : theme.black} bold>
                  {' '}
                  {formatCurrency(price)}
                </Type>
              </Type>
            )}
            {hasReview && (
              <Container style={[styleSheet.footer, styles.footer]}>
                <ReviewSummary onPress={onReviewsPress} optimized {...data} containerStyle={{ paddingVertical: 8 }} />
              </Container>
            )}
          </Container>
        )}
      </Container>
      <Container style={styleSheet.buttonsContainer}>
        <Container flex={isBackorders ? 0.6 : 1} mr={0.3}>
          {hasQuickView && (
            <Container
              border={theme.black}
              onPress={onQuickViewPress}
              style={styleSheet.quickViewButtonContainer}
              disabled={isPending}
            >
              <Type semiBold style={styleSheet.quickViewButtonText}>
                view
              </Type>
            </Container>
          )}
        </Container>
        <Container flex={1} ml={0.3}>
          {hasAddToCart && !isGiftCertificate && (
            <ProductAddToCart
              productData={data}
              productSku={productSku}
              cartProductId={cartProductId}
              onAddToBag={isConfigurable ? onAddConfigurableProduct : undefined}
              onCartAddSuccess={onCartAddSuccess}
              productType={productType}
              attributeOptions={attributeOptions}
              optimized
              isListingView
              isCarouselItem={isCarouselItem}
            />
          )}
        </Container>
      </Container>
    </Container>
  )
}

export default ProductListItemDetails
