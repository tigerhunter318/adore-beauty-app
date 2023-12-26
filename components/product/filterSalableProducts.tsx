export const filterSalableProducts = (products: any[], max = Infinity) =>
  products?.length > 0 &&
  products
    .filter(
      (item: { isSalable: boolean; inStock: boolean; price: number }) =>
        item.isSalable && item.inStock && item.price > 0
    )
    .slice(0, max)
