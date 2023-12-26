import { isBrandUrl, isCategoryUrl } from '../../../utils/validation'
import { formatPageIdentifier } from '../../../utils/format'

export const formatBrandUrl = url => `/b/${formatPageIdentifier(url)}.html`

export const formatCategoryUrl = url => `/c/${formatPageIdentifier(url)}.html`

export const formatUrlPathQueryVariables = url => {
  if (!isCategoryUrl(url) && !isBrandUrl(url)) {
    return {
      metadata: {
        _or: [{ url_path: { _eq: formatCategoryUrl(url) } }, { url_path: { _eq: formatBrandUrl(url) } }]
      }
    }
  }

  return { metadata: { url_path: { _eq: url } } }
}

export const formatOrderBy = (sortBy: string) => {
  switch (sortBy) {
    case 'new':
      return { created_at: 'desc_nulls_last' }
    case 'top_rated':
      return { reviews_aggregate: { avg: { rating_value: 'desc_nulls_last' } } }
    default:
      return { product_sales_year: 'desc_nulls_last' }
  }
}
