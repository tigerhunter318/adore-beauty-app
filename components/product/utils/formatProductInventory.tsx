import envConfig from '../../../config/envConfig'
import { isValidArray, isValidObject } from '../../../utils/validation'

const inventoryReferences = [
  {
    qdos_stock_status: 'Waitlist',
    quantity: 0,
    type: 'notify_me'
  },
  {
    qdos_stock_status: 'Bin End',
    quantity: 0,
    type: 'sold_out'
  },
  {
    qdos_stock_status: 'Backorders',
    quantity: 0,
    type: 'pre_order'
  }
]

const formatHasuraInventory = (productData: {} | any, productVariant?: any): ProductInventory => {
  const { inventory = {}, attributeOptions = [] } = productData || {}
  const isGiftItem = isValidArray(productData?.gift_items) && productData?.price === 0
  const isCategoryParentProduct = productData?.class_type === 'variation'
  const isCategoryParentProductInStock =
    envConfig.countryCode === 'AU'
      ? productData?.has_variation_inventory_available_au
      : productData?.has_variation_inventory_available_nz
  const productVariantData =
    productVariant &&
    attributeOptions?.find((item: { option_id: number | string }) => item?.option_id === productVariant)
  let stockData = inventoryReferences.find(
    reference =>
      reference.qdos_stock_status === inventory.qdos_stock_status &&
      reference.quantity === inventory.quantity &&
      inventory.inventory_source === envConfig.countryCode
  )

  let isSalable =
    (productData?.inventory?.quantity && productData?.inventory?.quantity !== 0) || !!isCategoryParentProductInStock
  const quantity =
    productData?.qty ||
    productData?.inventory?.quantity ||
    productVariantData?.inventory?.quantity ||
    productData?.inventory_level

  if (productVariantData) {
    isSalable = productVariantData?.inventory?.quantity !== 0
    stockData = inventoryReferences.find(
      reference =>
        reference.qdos_stock_status === productVariantData?.inventory?.qdos_stock_status &&
        reference.quantity === productVariantData?.inventory?.quantity &&
        productVariantData?.inventory.inventory_source === envConfig.countryCode
    )
  }

  if (isGiftItem) {
    isSalable = productData?.inventory_level !== 0
  }

  const isEveryVariationOutOfStock =
    isValidArray(attributeOptions) &&
    attributeOptions?.every(option => option?.inventories?.[0]?.quantity === 0 || option?.inventory?.quantity === 0)
  const isEveryVariationSoldOut =
    isValidArray(attributeOptions) &&
    attributeOptions?.every(
      option =>
        (option?.inventories?.[0]?.quantity === 0 && option?.inventories?.[0]?.qdos_stock_status === 'Bin End') ||
        (option?.inventory?.quantity === 0 && option?.inventory?.qdos_stock_status === 'Bin End')
    )

  let isOutOfStock =
    stockData?.type === 'notify_me' ||
    isEveryVariationOutOfStock ||
    productData?.qty === 0 ||
    (inventory?.quantity === 0 &&
      inventory?.qdos_stock_status === null &&
      (isEveryVariationOutOfStock || !isValidArray(attributeOptions)))

  if (isCategoryParentProduct) {
    isOutOfStock = !isCategoryParentProductInStock
  }

  return {
    quantity: quantity || 0,
    isSalable,
    isOutOfStock: isOutOfStock && !isEveryVariationSoldOut,
    isSoldOut: stockData?.type === 'sold_out' || isEveryVariationSoldOut,
    isBackordersOutOfStock: stockData?.type === 'pre_order',
    isGiftlistItemOutOfStock: !!(!isSalable && isGiftItem)
  }
}

const formatInventory = (productData: {} | any, productVariant?: any): ProductInventory => {
  const {
    availability,
    inventory_level: inventoryLevel,
    inStock = true,
    attributeOptions,
    isSalable: isProductSalable = true,
    backorders,
    quantity,
    qty,
    productType
  } = productData || {}
  const productQuantity = Number(inventoryLevel || quantity || qty)
  const productVariantData = productVariant && attributeOptions?.find(item => item?.option_id === productVariant)
  const isGiftItem = isValidArray(productData?.gift_items) && productData?.price === 0
  let isSalable = productVariantData ? !!productVariantData?.isSalable : !!isProductSalable

  if (isGiftItem) {
    isSalable = !!inventoryLevel
  }

  const isInventoryUnavailable = availability && availability !== 'available'
  const isInventoryOutOfStock = productQuantity === 0 || !inStock
  const isOutOfStock = !!isInventoryOutOfStock || !!isInventoryUnavailable
  const isBackordersOutOfStock = !!(backorders === 'Backorders' && isSalable && isInventoryOutOfStock)
  const isSoldOut =
    !!(backorders === 'No Backorders' && !isSalable) || !!(backorders === 'Bin End' && !isSalable && !inStock)

  return {
    quantity: productQuantity || 0,
    isSalable,
    isOutOfStock:
      !!(
        isOutOfStock &&
        !isGiftItem &&
        productType &&
        productType !== 'configurable' &&
        !isBackordersOutOfStock &&
        !isSoldOut
      ) || !!(productType === 'configurable' && !inStock && !isSoldOut),
    isSoldOut,
    isBackordersOutOfStock,
    isGiftlistItemOutOfStock: !!(!isSalable && isGiftItem)
  }
}

type ProductInventory = {
  quantity: number
  isSalable: boolean
  isOutOfStock: boolean
  isSoldOut: boolean
  isBackordersOutOfStock: boolean
  isGiftlistItemOutOfStock: boolean
}

const formatProductInventory = (productData: {} | any, productVariant?: any): ProductInventory => {
  if (productData?.inventory) {
    return formatHasuraInventory(productData, productVariant)
  }

  return formatInventory(productData, productVariant)
}

export default formatProductInventory
