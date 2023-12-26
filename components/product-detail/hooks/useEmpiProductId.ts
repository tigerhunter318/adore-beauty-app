import { useNavigation, useRoute } from '@react-navigation/core'
import { StackNavigationProp } from '@react-navigation/stack'
import { useEffect } from 'react'
import { bigcommerceUtils } from '../../../services/bigcommerce'

export const useEmpiProductId = () => {
  const route = useRoute()
  const navigation = useNavigation<StackNavigationProp<any>>()
  // @ts-ignore
  const { empi, sku } = route?.params || {}

  const navigationToSku = (productSku: any) => {
    navigation.setParams({ productSku })
  }

  const fetchProductSku = async (catalogId: any) => {
    const catalogProduct = await bigcommerceUtils.fetchBigCommerceProductByCatalogId(catalogId)
    if (catalogProduct?.sku) {
      navigationToSku(catalogProduct.sku)
    }
  }

  const handleSku = () => {
    if (empi && sku) {
      navigationToSku(sku)
    } else if (empi) {
      fetchProductSku(empi)
    }
  }

  useEffect(handleSku, [empi, sku])
}
