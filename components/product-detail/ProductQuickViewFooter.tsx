import React from 'react'
import { StyleSheet } from 'react-native'
import { formatCurrency } from '../../utils/format'
import { isIos, isSmallDevice } from '../../utils/device'
import { useScreenRouter } from '../../navigation/router/screenRouter'
import ProductAddToCart from '../product/ProductAddToCart'
import Container from '../ui/Container'
import Type from '../ui/Type'
import theme from '../../constants/theme'
import { isValidArray } from '../../utils/validation'
import ProductVariants from './ProductVariants'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 52,
    paddingBottom: isSmallDevice() ? 0 : 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    borderTopColor: theme.borderColor,
    borderTopWidth: 1
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  oldPrice: {
    textDecorationLine: 'line-through',
    marginRight: 10
  },
  priceContainer: {
    flex: 1,
    alignItems: 'baseline'
  },
  moreInfoBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 3,
    paddingHorizontal: 10,
    marginRight: 10
  },
  moreInfoBtnLabel: {
    fontSize: 12,
    color: theme.black,
    textTransform: 'uppercase'
  }
})

const shadowStyle = {
  shadowOffset: { width: 0, height: 2 },
  shadowColor: theme.borderColorDark,
  shadowOpacity: 1,
  shadowRadius: 10
}

type ProductQuickViewFooterProps = {
  productData: {} | any
  scrollViewRef: any
  onClose: any
  routeParams: any
  selectedOption: any
}

const ProductQuickViewFooter = ({
  productData,
  scrollViewRef,
  onClose,
  routeParams = {},
  selectedOption
}: ProductQuickViewFooterProps) => {
  const isConfigurableProduct = productData.productType !== 'simple' && isValidArray(productData.attributeOptions)
  const hasOldPrice = !!parseInt(productData?.oldPrice)
  const { navigateScreen } = useScreenRouter()

  const handleViewDetailClick = () => {
    onClose()
    // goback to modal screen parent when going back from product
    navigateScreen('ProductStack/Product', { ...productData, fromScreenPath: routeParams?.parentScreenPath })
  }

  const scrollToDropdown = () => {
    if (scrollViewRef?.current?.scrollTo) {
      scrollViewRef.current.scrollTo({
        x: 0,
        y: 300,
        animated: true
      })
    }
  }

  let height = isSmallDevice() ? 60 : 90
  if (isConfigurableProduct) {
    height += 65
  }

  return (
    <Container style={[styles.container, { height }, isIos() && shadowStyle]}>
      {isConfigurableProduct && <ProductVariants productData={productData} variant={selectedOption} />}
      <Container rows style={styles.inner} gutter>
        <Container style={styles.priceContainer}>
          {hasOldPrice && (
            <Type size={15} style={styles.oldPrice}>
              {formatCurrency(productData.oldPrice)}
            </Type>
          )}
          {!!productData?.price && (
            <Type bold size={17} color={hasOldPrice ? theme.orange : theme.black} lineHeight={20}>
              {formatCurrency(productData.price)}
            </Type>
          )}
        </Container>
        <Container border={theme.black} onPress={handleViewDetailClick} style={styles.moreInfoBtn}>
          <Type style={styles.moreInfoBtnLabel}>more info</Type>
        </Container>
        {productData && (
          <ProductAddToCart
            productSku={selectedOption ? selectedOption.productSku : productData.productSku}
            cartProductId={
              selectedOption ? selectedOption.big_commerce_product_id : productData.big_commerce_product_id
            }
            product_id={selectedOption ? selectedOption.product_id : productData.product_id}
            product_variant={selectedOption ? selectedOption.option_id : null}
            productType={productData.productType}
            attributeOptions={productData.attributeOptions}
            scrollToDropdown={scrollToDropdown}
            productData={productData}
          />
        )}
      </Container>
    </Container>
  )
}

export default ProductQuickViewFooter
