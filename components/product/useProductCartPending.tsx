import { useActionState } from '../../store/utils/stateHook'
import { formatProductSkuValue } from '../../utils/format'

export const useProductCartPending = (
  productSku?: string | any[],
  objectId?: string | number | undefined,
  product_id?: string | number | undefined
) => {
  const cartPending = useActionState('cart.request.pending')
  const cartFetchProduct = useActionState('cart.request.meta.payload')
  const cartActionLineItems = useActionState('cart.request.meta.payload.line_items')
  const productPending = useActionState('cart.productPending')
  const isFetchingProduct = cartFetchProduct && cartFetchProduct.productSku === formatProductSkuValue(productSku)

  const isAddingToCart =
    cartActionLineItems &&
    cartActionLineItems.find(
      (o: { productSku: any }) => formatProductSkuValue(o.productSku) === formatProductSkuValue(productSku)
    )

  const isPendingProduct =
    (product_id && product_id === productPending?.product_id) ||
    (objectId && objectId === productPending?.objectId) ||
    (productSku?.length && formatProductSkuValue(productSku) === formatProductSkuValue(productPending?.productSku))

  const isPending = cartPending && (isFetchingProduct || isAddingToCart || isPendingProduct)
  return isPending
}
