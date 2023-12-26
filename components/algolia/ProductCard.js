import React, { memo } from 'react'
import ProductListItem from '../product/ProductListItem'
import { algoliaInsights } from '../../services/algolia'
import { useActionState } from '../../store/utils/stateHook'
import { formatPageIdentifier } from '../../utils/format'
import { isValidArray, isValidObject } from '../../utils/validation'

const ProductCard = ({
  data,
  styles = {},
  navigation,
  hasAddToCart = true,
  hasReview = false,
  hasFavourite = false,
  ...props
}) => {
  const account = useActionState('customer.account')
  const productId = algoliaInsights.getProductId(data)

  if (!isValidObject(data)) return <ProductListItem testID="ProductCard" />

  const productData = {
    productImage: data.image_url,
    name: data.name,
    productSku: data.sku,
    product_id: productId,
    productType: data.type_id,
    reviewAverage: data.reviewAverage,
    reviewTotal: data.rating_summary,
    has_special_price: !!data.specialPrice,
    price: data.specialPrice || data.price,
    oldPrice: data.oldPrice,
    specialPrice: data.specialPrice,
    queryId: data.__queryID,
    url: data.url,
    objectId: data.objectID,
    brand_name: data.manufacturer,
    isSalable: !!data.is_salable,
    backorders: data.backorders,
    inStock: !!parseInt(data.in_stock),
    quantity: data.stock_qty || 0
  }

  const isConsentNeeded = () => !!Number(data.is_consent_needed_i)

  const formatRouteParams = () => {
    const routeParams = {
      productData,
      url: data.url,
      queryId: data.__queryID,
      child_product_id: data.product_id,
      product_url: data.url
    }
    if (productId) {
      routeParams.product_id = productId
    }
    if (isValidArray(data.sku)) {
      routeParams.productSku = data.sku
    }
    if (data.url) {
      routeParams.identifier = formatPageIdentifier(data.url, true)
    }
    if (isConsentNeeded()) {
      routeParams.productSku = data.sku
      routeParams.is_consent_needed = 1
    }

    return routeParams
  }

  const handleProductPress = () => {
    algoliaInsights.clickProduct(account, data)
    navigation.push('Product', formatRouteParams())
  }

  const handleQuickViewPress = () => {
    algoliaInsights.clickProductQuickView(account, data)
    navigation.push('ProductQuickView', formatRouteParams())
  }

  return (
    <ProductListItem
      testID="ProductCard"
      navigation={navigation}
      data={productData}
      styles={styles}
      hasQuickView
      hasAddToCart={hasAddToCart}
      hasReview={hasReview}
      hasFavourite={hasFavourite}
      onQuickViewPress={handleQuickViewPress}
      onProductPress={handleProductPress}
      {...props}
    />
  )
}

export default memo(ProductCard)
