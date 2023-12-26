import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { formatCurrency } from '../../utils/format'
import { getRemoteConfigItem } from '../../services/useRemoteConfig'
import { isValidArray } from '../../utils/validation'
import Type from '../ui/Type'
import Container from '../ui/Container'
import ReviewSummary from '../product-review/ReviewSummary'
import ImageGallery from './ImageGallery'
import StockMessage from './StockMessage'
import ProductSize from './ProductSize'
import AfterPayInfo from './AfterPayInfo'
import AfterPayModal from './AfterPayModal'
import ProductFindation from './ProductFindation/ProductFindation'
import Colors from '../../constants/Colors'
import theme from '../../constants/theme'

const styles = StyleSheet.create({
  name: {
    fontSize: 22,
    paddingVertical: 10
  },
  reviewsContainer: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  productSize: {
    marginTop: 12
  },
  oldPrice: {
    textDecorationLine: 'line-through',
    marginRight: 10,
    fontSize: 16,
    paddingBottom: 5
  },
  priceContainer: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  price: {
    lineHeight: 33,
    fontSize: 22,
    letterSpacing: 1
  },
  priceSaving: {
    lineHeight: 26,
    fontSize: 13,
    backgroundColor: Colors.mudColor,
    paddingHorizontal: 10,
    marginTop: 2,
    marginLeft: 18,
    color: theme.lightBlack
  },
  stockMessage: {
    paddingVertical: 25
  },
  afterPay: {
    paddingHorizontal: 15
  }
})

type ProductMainProps = {
  productVariant: any
  data: {} | any
  productImages: []
  onReviewContainerLayout: any
  onReviewPress: any
  productName: string
}

const ProductMain = ({
  productVariant,
  data,
  productImages,
  onReviewContainerLayout,
  onReviewPress,
  productName
}: ProductMainProps) => {
  const [isAfterPayOpen, setIsAfterPayOpen] = useState(false)
  const { name, size, price, oldPrice, afterpayInstallments, has_findation: hasFindation } = data || {}
  const isFindationEnable = getRemoteConfigItem('findation_enabled')
  const hasSpecialPrice = !!oldPrice && !!price && oldPrice !== price

  const getOldPriceSaving = () => {
    const percentageDiscount = Math.floor(((oldPrice - price) / oldPrice) * 100)
    return `SAVE ${percentageDiscount}%`
  }
  const toggleAfterPayModal = () => setIsAfterPayOpen(!isAfterPayOpen)

  return (
    <Container>
      <Type bold style={styles.name} testID="ProductScreen.Header.Title">
        {name || productName}
      </Type>
      <View onLayout={onReviewContainerLayout} style={styles.reviewsContainer}>
        <ReviewSummary {...data} onPress={onReviewPress} isRateBold />
      </View>
      <ProductSize size={size} style={styles.productSize} />
      {isValidArray(productImages) && (
        <Container pt={3} pb={productImages.length > 1 ? 0 : 3}>
          <ImageGallery productImages={productImages} />
        </Container>
      )}
      {hasSpecialPrice && <Type style={styles.oldPrice}>{formatCurrency(oldPrice)}</Type>}
      <Container style={styles.priceContainer}>
        <Type bold style={styles.price} color={hasSpecialPrice ? theme.orange : theme.black}>
          {formatCurrency(price)}
        </Type>
        {hasSpecialPrice && (
          <Type semiBold style={styles.priceSaving}>
            {getOldPriceSaving()}
          </Type>
        )}
      </Container>
      <Container style={styles.stockMessage}>
        <StockMessage productData={data} productVariant={productVariant} />
      </Container>
      {isFindationEnable && hasFindation && <ProductFindation data={data} />}
      <AfterPayInfo
        style={styles.afterPay}
        installments={afterpayInstallments}
        toggleAfterPayModal={toggleAfterPayModal}
      />
      <AfterPayModal isVisible={isAfterPayOpen} onClose={toggleAfterPayModal} />
    </Container>
  )
}

export default ProductMain
