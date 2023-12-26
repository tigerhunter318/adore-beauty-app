import { useState } from 'react'
import useAsyncEffect from 'use-async-effect'
import { bigcommerceUtils } from '../../services/bigcommerce'
import { isValidArray } from '../../utils/validation'

type CatalogProductProviderProps = {
  children: any
  product?: {} | any
  selectedOption?: {} | any
  productSku?: string
}

const CatalogProductProvider = ({ children, product, selectedOption, productSku }: CatalogProductProviderProps) => {
  const [catalogProductId, setCatalogProductId] = useState(null)
  const [catalogProductData, setCatalogProductData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [catalogSku, setCatalogSku] = useState(null)
  let sku = selectedOption?.productSku || selectedOption?.sku || product?.productSku || productSku

  if (isValidArray(sku)) {
    const [firstSku] = sku
    sku = firstSku
  }

  const handleSkuChange = async (isMounted: any) => {
    if (sku !== catalogSku) {
      setCatalogProductId(null)
      setCatalogSku(sku)
      setLoading(true)
      const response =
        sku &&
        (await bigcommerceUtils.fetchBigCommerceProduct(sku, [
          'date_created',
          'price',
          'cost_price',
          'base_variant_id'
        ]))
      if (!isMounted()) return
      setLoading(false)
      setCatalogProductData(response)
      setCatalogProductId(response?.id)
    }
  }

  useAsyncEffect(handleSkuChange, [sku])

  return children({ catalogProductId, catalogProductData, loading })
}

export default CatalogProductProvider
