import React, { useState } from 'react'
import { Alert } from 'react-native'
import { useDispatch } from 'react-redux'
import cart, { useCartLineItems, useCartItemsProductDetail, useFindCartLineItem } from '../../store/modules/cart'
import { useActionState } from '../../store/utils/stateHook'
import { fbEvents } from '../../services/facebook'
import { tealiumEvents } from '../../services/tealium'
import { formatProductSkuValue } from '../../utils/format'
import { useProductCartPending } from './useProductCartPending'
import { isValidArray } from '../../utils/validation'
import Container from '../ui/Container'
import branchEvents from '../../services/branch/branchEvents'
import ProductAddToCartButton from './ProductAddToCartButton'

type ProductAddToCartProps = {
  productSku: string
  product_id?: any
  cartProductId: number
  product_variant?: any
  onCartAddSuccess?: () => void
  productType: string
  attributeOptions: any
  isListingView?: boolean
  scrollToDropdown?: () => void
  productData: any
  optimized?: boolean
  disabled?: boolean
  containerStyle?: {} | any
  onAddToBag?: (productData: any) => void
  isCarouselItem?: boolean
  isGiftView?: boolean
}

const ProductAddToCart = ({
  productSku,
  product_id,
  cartProductId,
  product_variant,
  onCartAddSuccess,
  productType,
  attributeOptions,
  isListingView = false,
  scrollToDropdown,
  productData,
  optimized = false,
  disabled,
  containerStyle = {},
  onAddToBag,
  isCarouselItem,
  isGiftView
}: ProductAddToCartProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const dispatch = useDispatch()
  const cartItems = useCartLineItems()
  const cartItemsProductDetail = useCartItemsProductDetail()
  const customerAccount = useActionState('customer.account')
  const cartLineItem = useFindCartLineItem(productSku)
  const isPending = useProductCartPending(productSku, productData?.objectId, productData?.product_id)

  const hasAttributeOptions = () => productType !== 'simple' && isValidArray(attributeOptions) && !product_variant

  const handleOptionAlert = () => {
    const title = 'Please select an option'
    const message = "You'll need to select an option in the drop-down menu before adding to bag"

    Alert.alert(title, message)
  }

  const handleEventLog = (lineItem: {
    productSku: string
    quantity: number
    product_id: number
    cartProductId: number
    product_variant: any
    productData: any
  }) => {
    fbEvents.logAddToCart(productData, customerAccount)
    tealiumEvents.addCartAdd(productData, cartItems, customerAccount, cartItemsProductDetail)
    branchEvents.trackAddToCart({ customerAccount, lineItem })
  }

  const handlePress = async () => {
    if (onCartAddSuccess) {
      onCartAddSuccess()
    }
    if (onAddToBag) {
      onAddToBag(productData)
    } else if (hasAttributeOptions() && scrollToDropdown) {
      scrollToDropdown()
      handleOptionAlert()
    } else {
      const lineItem = {
        productSku: formatProductSkuValue(productSku),
        quantity: 1,
        product_id,
        cartProductId,
        product_variant,
        productData
      }

      await dispatch(cart.actions.addProductBySku(lineItem))

      handleEventLog(lineItem)

      if (isGiftView) {
        await dispatch(cart.actions.addedToCartItems([]))
      }
    }
  }

  const handleNotifyPress = () => setIsModalVisible(!isModalVisible)

  return (
    <Container style={[{ opacity: isPending ? 0.7 : 1 }, containerStyle]}>
      <ProductAddToCartButton
        onPress={handlePress}
        disabled={isPending || disabled}
        isCartLineItem={cartLineItem && !optimized}
        productSku={productSku}
        isModalVisible={isModalVisible}
        onNotifyPress={isListingView && productType === 'configurable' ? handlePress : handleNotifyPress}
        isListingView={isListingView}
        productUrl={productData?.product_url || productData?.url}
        isCarouselItem={isCarouselItem}
        productVariant={product_variant}
        productData={productData || {}}
      />
    </Container>
  )
}

export default ProductAddToCart
