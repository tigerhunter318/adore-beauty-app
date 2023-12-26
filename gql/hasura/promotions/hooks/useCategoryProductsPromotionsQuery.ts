import { useEffect, useState } from 'react'
import { isValidArray, isValidObject } from '../../../../utils/validation'
import { getPromotionsData } from '../../../../components/promotions/utils/helpers'
import { now } from '../../../../utils/date'
import useHasuraQuery from '../../utils/useHasuraQuery'
import { formatUrlPathQueryVariables } from '../../utils/format'
import useScreenQuery from '../../../useScreenQuery'
import CategoryPromotionsQuery from '../CategoryPromotionsQuery'
import { promoQueryTimeStamp } from '../../utils/timestamp'

const useCategoryProductsPromotionsQuery = ({
  url,
  isBrandCategory,
  skip
}: {
  url: string
  isBrandCategory: boolean
  skip: boolean
}) => {
  const [offers, setOffers] = useState([])
  const display_locations = isBrandCategory
    ? { _contains: { brand_listing_page: true } }
    : { _contains: { category_listing_page: true } }

  const where = formatUrlPathQueryVariables(url)
  // TODO MOB-1182 fix query re-fetching when filter bar open
  const { data, loading } = useScreenQuery(CategoryPromotionsQuery, {
    variables: { where, display_locations, queryDate: promoQueryTimeStamp() },
    useQueryHook: useHasuraQuery,
    formatResponse: res => res?.['categories']?.[0]?.promotions,
    skip
  })

  const handleFetchedData = () => {
    if (isValidArray(data)) {
      setOffers(getPromotionsData([{ promotions: data }]))
    }
  }

  useEffect(handleFetchedData, [data])

  return { loading, offers }
}

export default useCategoryProductsPromotionsQuery
