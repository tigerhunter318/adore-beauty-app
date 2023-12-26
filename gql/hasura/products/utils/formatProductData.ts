import { getIn } from '../../../../utils/getIn'
import { formatCurrency, stripNonEnglishChars } from '../../../../utils/format'
import { isValidArray, isValidNumber, isValidObject } from '../../../../utils/validation'
import envConfig from '../../../../config/envConfig'
import { removeArrayDuplicates } from '../../../../utils/array'
import { compareAlpha } from '../../../../utils/sort'

const formatPriceData = (product: { product_prices: any[] }) => {
  if (!isValidObject(product)) return {}
  const priceBookName = envConfig.country === 'Australia' ? 'AUD List Price' : 'NZD List Price'
  const specialPriceBookName = envConfig.country === 'Australia' ? 'AUD Sale Price' : 'NZD Sale Price'

  const price = product.product_prices?.filter(
    (priceDetails: { price_book: { name: string } }) => priceDetails?.price_book?.name === priceBookName
  )?.[0]?.amount
  let specialPrice = product.product_prices?.filter(
    (priceDetails: { price_book: { name: string } }) => priceDetails?.price_book?.name === specialPriceBookName
  )?.[0]?.amount

  if (specialPrice === price) {
    specialPrice = undefined
  }

  return { price, specialPrice }
}
const sortAttributeOptionsData = options => {
  if (!isValidArray(options)) return []

  return options.slice(0).sort(compareAlpha('color'))
}
const formatImagesData = (images: []) => {
  const getImagePath = image => getIn(image, 'image.url_relative')

  let primaryImage = getImagePath(images?.find(({ image }: any) => image?.tags?.includes('image')))
  let swatchImage = getImagePath(images?.find(({ image }: any) => image?.tags?.includes('swatch')))
  // select a png image that has no tags
  let fallbackImage = images?.find(({ image }: any) => !image?.tags?.length && image?.url_relative?.includes('.png'))

  if (!fallbackImage) {
    // select first image
    const firstPng = images?.find(({ image }: any) => image?.url_relative?.includes('.png'))
    const firstImage = images?.find(({ image }: any) => !!image?.url_relative)
    fallbackImage = firstPng || firstImage
  }
  if (!primaryImage && fallbackImage) {
    primaryImage = getImagePath(fallbackImage)
  }
  if (!swatchImage && fallbackImage) {
    swatchImage = getImagePath(fallbackImage)
  }

  const galleryImages = images
    .slice(0)
    .sort((a: any, b: any) => (a.is_primary ? -1 : 1))
    .map(item => getImagePath(item))

  return { primaryImage, swatchImage, galleryImages }
}
const formatColorNameFromVariantName = (variationProduct: any, parentProduct: any) => {
  const parentName = stripNonEnglishChars(parentProduct.name_raw)
  return stripNonEnglishChars(variationProduct.name_raw)
    .replace(new RegExp(parentName, 'i'), '')
    .replace(`-`, '')
    .trim()
}
const formatAttributeOptionsData = (variationProduct: any, parentProduct: any) => {
  const { price, specialPrice } = formatPriceData(variationProduct)
  const { primaryImage, swatchImage } = formatImagesData(variationProduct.images)

  const name = variationProduct.name_raw || ''
  return {
    ...variationProduct,
    name,
    product_color: variationProduct.color,
    color: variationProduct.color || formatColorNameFromVariantName(variationProduct, parentProduct),
    product_id: variationProduct.id,
    option_id: variationProduct.id,
    image_url: swatchImage,
    main_image_url: primaryImage,
    isSalable:
      variationProduct.inventories?.[0]?.is_available && variationProduct.inventories?.[0]?.quantity > 0 ? 1 : 0,
    inStock: variationProduct.inventories?.[0]?.stock_availability === 'in_stock',
    productSku: variationProduct.sku,
    price: specialPrice || price,
    oldPrice: specialPrice ? price : specialPrice,
    specialPrice,
    inventory: {
      inventory_source: getIn(variationProduct, 'inventories.0.inventory_source'),
      qdos_stock_status: getIn(variationProduct, 'qdos_stock_status'),
      quantity: getIn(variationProduct, 'inventories.0.quantity') || 0
    }
  }
}

export const formatBrandImages = brandData => {
  const brandImages =
    brandData?.images?.reduce((acc, { image }) => {
      acc[image?.tags?.[0]] = image.url_relative
      return acc
    }, {}) || {}

  return {
    brand_logo_url: brandImages.brand_logo,
    brand_banner_url: brandImages.banner_image
  }
}

export const formatProductData = ({
  product,
  shouldFormatVariations = true
}: {
  product: any
  shouldFormatVariations: boolean
}) => {
  if (!isValidObject(product)) return null

  const { price, specialPrice } = formatPriceData(product)
  const variations = product.variations || []
  const choices = product.product_facets
    ?.map((facet: { facet_group_option: { name: string } }) => facet?.facet_group_option?.name)
    ?.filter((x: any) => x)
  const installments = isValidNumber(price) && formatCurrency(price / 4)
  const afterpayInstallments = `4 instalments of ${installments}`
  const attributeOptions = shouldFormatVariations
    ? variations?.map((variation: any) => formatAttributeOptionsData(variation, product))
    : variations
  const name = product.name_raw || ''
  const brandCategory = product.brand_category?.[0]?.category || {}
  const { primaryImage, swatchImage, galleryImages } = formatImagesData(product.images)
  const productImages = [primaryImage, swatchImage, ...galleryImages].filter(x => x) || []
  const brandImages = formatBrandImages(brandCategory)

  return {
    ...product,
    ...brandImages,
    name,
    product_id: product.id,
    product_url: product.metadata?.url_path,
    objectId: product.comestri_product_id,
    parentMainImageUrl: primaryImage,
    productImage: primaryImage || swatchImage, // || fallBackImages?.[0],
    productImages: removeArrayDuplicates(productImages),
    reviewAverage: product.reviews_average?.aggregate?.avg?.rating_value,
    reviewTotal: product.reviews_average?.aggregate?.count,
    has_special_price: !!specialPrice,
    productSku: product.sku,
    backorders: product.qdos_stock_status || 'Backorders',
    is_consent_needed: product.is_consent_required,
    productType: product.class_type === 'variation' ? 'configurable' : 'simple',
    isSalable: product.inventories?.[0]?.is_available && product.inventories?.[0]?.quantity > 0 ? 1 : 0,
    inStock: product.inventories?.[0]?.stock_availability === 'in_stock',
    category_name: product.categories?.[0]?.category?.name,
    category_id: product.categories?.[0]?.category.id,
    comestri_category_id: product.categories?.[0]?.category?.comestri_category_id,
    brand_comestri_category_id: product.brand_category?.[0]?.category?.comestri_category_id,
    brand_magento_category_id: product.brand_category?.[0]?.category?.magento_category_id,
    magento_category_id: product.categories?.[0]?.category?.magento_category_id,
    brand_name: brandCategory.name_raw,
    brand_identifier_s: brandCategory.identifier,
    price: specialPrice || price,
    oldPrice: specialPrice ? price : specialPrice,
    specialPrice,
    afterpayInstallments,
    attributeOptions: sortAttributeOptionsData(attributeOptions),
    choices,
    inventory: {
      inventory_source: getIn(product, 'inventories.0.inventory_source'),
      qdos_stock_status: getIn(product, 'qdos_stock_status'),
      quantity: getIn(product, 'inventories.0.quantity') || 0
    }
  }
}
