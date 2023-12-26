import envConfig from '../../../config/envConfig'

export const productIsActiveCondition = { is_active: { _eq: true } }

export const productVisibleInCatalogOrSearchCondition = { _has_keys_all: ['Catalog', 'Search'] }

export const productInLocaleCondition = {
  catalogues: {
    catalogue: {
      locale: { _eq: envConfig.locale }
    }
  },
  product_prices: {
    price_book: { _contains: { name: envConfig.hasura.priceBookName } }
  }
}

/**
 * products in stock, NOT out of stock, NOT sold out
 */
export const productInStockCondition = {
  ...productIsActiveCondition,
  inventories: { stock_availability: { _eq: 'in_stock' } }
}

/**
 * products in stock, AND out of stock, NOT sold out
 */
export const productNotSoldOutCondition = {
  ...productIsActiveCondition,
  _not: {
    _and: [
      { qdos_stock_status: { _eq: 'Bin End' } }, // not sold out
      { inventories: { stock_availability: { _neq: 'in_stock' } } }
    ]
  }
}

export const simpleProductCondition = {
  class_type: { _eq: 'sku' },
  comestri_parent_id: { _is_null: true },
  ...productIsActiveCondition
}

export const parentProductCondition = {
  class_type: { _in: ['variation', 'product_kit'] },
  ...productIsActiveCondition
}

const variationProductCondition = {
  class_type: { _in: ['variation'] },
  ...productIsActiveCondition
}

const productKitProductCondition = {
  class_type: { _in: ['product_kit'] },
  ...productIsActiveCondition
}

type FormatProductConditionType = {
  condition?: any
  inventoryCondition?: any
  variationInventoryCondition?: any
  visibility?: any
}

export const formatProductConditionWithVariant = ({
  condition = {},
  inventoryCondition = {},
  visibility
}: FormatProductConditionType) => {
  const productCondition = condition || {}
  const productInventoryCondition = inventoryCondition || {}

  return {
    _or: [
      {
        ...simpleProductCondition,
        ...productCondition,
        ...productInventoryCondition,
        visibility
      },
      {
        ...productKitProductCondition,
        ...productCondition, // it's not possible to check for sold out as bundles don't contain qdos_stock_status
        visibility
      },
      {
        // parent product with variants in skus and any variant with stock condition
        ...variationProductCondition,
        visibility,
        variations: {
          ...productCondition,
          ...productInventoryCondition
        }
      }
    ]
  }
}
