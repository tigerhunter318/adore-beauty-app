export const getInitialVariantOption = ({ routeParams, productData }: { routeParams: any; productData: {} | any }) => {
  if (productData?.attributeOptions?.length > 0) {
    const { productSku, product_id: productId } = routeParams || {}
    const variantSku = productSku

    let sku: any

    if (typeof variantSku === 'string') {
      sku = variantSku
    } else if (Array.isArray(variantSku) && variantSku.length === 1) {
      sku = variantSku?.[0]
    }
    if (productId) {
      const variant = productData.attributeOptions.find(
        (attributeOption: any) => attributeOption?.product_id === parseInt(productId)
      )

      if (variant) {
        return variant
      }
    }
    if (sku) {
      const variant = productData.attributeOptions.find((attributeOption: any) =>
        attributeOption?.productSku?.includes(sku)
      )

      if (variant) {
        return variant
      }
    }
    return productData.attributeOptions[0]
  }
  return null
}
