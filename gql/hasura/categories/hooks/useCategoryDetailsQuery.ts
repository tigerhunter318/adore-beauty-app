import useScreenQuery from '../../../useScreenQuery'
import { formatBrandImages } from '../../products/utils/formatProductData'
import { formatUrlPathQueryVariables } from '../../utils/format'
import useHasuraQuery from '../../utils/useHasuraQuery'
import CategoryDetailsQuery from '../CategoryDetailsQuery'

const useCategoryDetailsQuery = ({ url, skip }: { url: string; skip: boolean }) => {
  const formatResponse = response => {
    const brandImages = formatBrandImages(response?.brand_category?.[0])
    const {
      is_brand_category: isBrandCategory,
      name_raw: categoryName,
      magento_category_id: magentoId,
      comestri_category_id: comestriId,
      is_consent_required: isConsentRequired
    } = response?.categories?.[0] || {}

    return {
      isBrandCategory,
      categoryName,
      categoryId: magentoId || comestriId,
      brandLogo: brandImages.brand_logo_url,
      brandBanner: brandImages.brand_banner_url,
      isConsentRequired
    }
  }

  const conditions = formatUrlPathQueryVariables(url)

  const { data } = useScreenQuery(CategoryDetailsQuery, {
    variables: {
      conditions,
      brandConditions: {
        ...conditions,
        is_brand_category: { _eq: true }
      }
    },
    useQueryHook: useHasuraQuery,
    skip,
    formatResponse
  })

  return data || {}
}

export default useCategoryDetailsQuery
