import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { formatCurrency } from '../../utils/format'
import { isIos } from '../../utils/device'
import { isValidArray } from '../../utils/validation'
import Container from '../ui/Container'
import Type from '../ui/Type'
import ProductAddToCart from '../product/ProductAddToCart'
import theme from '../../constants/theme'
import FavouriteButton from '../wishlist/FavouriteButton'
import CatalogProductProvider from '../product/CatalogProductProvider'
import ProductVariants from './ProductVariants'

const shadowStyle = {
  shadowOffset: { width: 0, height: 2 },
  shadowColor: theme.borderColorDark,
  shadowOpacity: 1,
  shadowRadius: 10
}

const styleSheet = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    height: 52,
    width: '100%',
    backgroundColor: 'white',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderColor: theme.borderColor
  },
  cover: {
    position: 'absolute',
    width: '100%',
    top: 0,
    height: 140, // cover shadow in safearea
    backgroundColor: 'white',
    paddingBottom: 100
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

  icon: {}
})

type ProductPriceBarProps = {
  productData: any
  variant: any
  scrollToDropdown?: () => void
}

const ProductPriceBar = ({ productData, variant, scrollToDropdown = () => {} }: ProductPriceBarProps) => {
  const navigation = useNavigation()
  const isConfigurableProduct = productData?.productType !== 'simple' && isValidArray(productData?.attributeOptions)
  const height = isConfigurableProduct ? 52 + 65 : 52
  const { price, oldPrice, productSku, product_id: productId, productType } = productData || {}
  const hasSpecialPrice = !!oldPrice && !!price && oldPrice !== price

  return (
    <View style={[styleSheet.container, { height }, isIos() && shadowStyle]} testID="ProductPriceBar">
      <View style={styleSheet.cover} />
      {isConfigurableProduct && <ProductVariants productData={productData} variant={variant} />}
      <Container rows style={styleSheet.inner} gutter>
        <Type style={styleSheet.priceContainer}>
          {!!hasSpecialPrice && (
            <Type size={15} style={styleSheet.oldPrice}>
              {formatCurrency(oldPrice)}
            </Type>
          )}
          {!!price && (
            <Type bold size={17} color={hasSpecialPrice ? theme.orange : theme.black}>
              {!!hasSpecialPrice && ' '}
              {formatCurrency(price)}
            </Type>
          )}
        </Type>
        <ProductAddToCart
          productSku={variant ? variant.productSku : productSku}
          cartProductId={variant ? variant.big_commerce_product_id : productData?.big_commerce_product_id}
          product_id={variant ? variant.product_id : productId}
          product_variant={variant ? variant.option_id : null}
          productType={productType}
          attributeOptions={productData?.attributeOptions}
          scrollToDropdown={scrollToDropdown}
          productData={productData}
          containerStyle={{ marginRight: 15, marginTop: 5 }}
        />
        <CatalogProductProvider product={productData} selectedOption={variant}>
          {({ catalogProductId, loading }: any) => (
            <FavouriteButton
              catalogProductId={catalogProductId}
              productData={productData}
              navigation={navigation}
              variantId={variant?.option_id}
              loadingCatalogData={loading}
            />
          )}
        </CatalogProductProvider>
      </Container>
    </View>
  )
}

export default ProductPriceBar
