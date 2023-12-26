import { removeArrayDuplicates } from '../../../utils/array'
import { sanitizeContent } from '../../../utils/format'
import { getIn } from '../../../utils/getIn'
import { compareNumber } from '../../../utils/sort'
import { isValidArray, isValidObject } from '../../../utils/validation'

export const getPromotionsData = data => {
  if (!isValidArray(data)) return []

  return removeArrayDuplicates(
    data
      .flatMap(item => item.promotions)
      .map(({ promotion }) => promotion)
      .filter(x => x)
      .sort(compareNumber('sort_order'))
  )
}

export const formatPromotionDescription = description =>
  sanitizeContent(description?.replace(/(<([^>]+)>)/gi, ''))?.trim()

export const formatPromotionData = promotion => {
  if (!isValidObject(promotion)) return {}

  const rulePath = 'promotion_rules.0.promotion_rule_actions.0'
  const productPath = `${rulePath}.products.0.product`

  return {
    products: getIn(promotion, `${rulePath}.products`)?.map(({ product }) => product) || [],
    amount: getIn(promotion, `${rulePath}.amount`),
    isAddFreeItem: getIn(promotion, `${rulePath}.add_free_item`),
    brandLogo: getIn(promotion, `${productPath}.brands.0.brand.image_link`),
    image: getIn(promotion, `${productPath}.images.0.image.url_relative`),
    description: formatPromotionDescription(getIn(promotion, `${productPath}.description`)),
    code: getIn(promotion, 'promotion_code_settings.0.code'),
    name: getIn(promotion, 'name'),
    title: getIn(promotion, 'display_name'),
    message: getIn(promotion, 'message'),
    siteMessage: getIn(promotion, 'site_message'),
    redeemUrl: getIn(promotion, 'redeem_url')
  }
}
