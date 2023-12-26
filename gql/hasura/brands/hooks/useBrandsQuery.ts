import { getIn } from '../../../../utils/getIn'
import useQueryPagination from '../../utils/useQueryPagination'
import useHasuraQuery from '../../utils/useHasuraQuery'
import { categoryProductsInventoryCondition } from '../../categories/CategoryProductsQuery'
import BrandsQuery from '../BrandsQuery'
import { productInLocaleCondition } from '../../products/ProductConditions'

const formatLetterRegex = (letter: string) => {
  switch (letter) {
    case 'show_all':
      return null
    case 'U-Z':
      return `^[UVWXYZ]`
    case '#':
      return `^[0-9]`
    default: {
      return `^${letter}`
    }
  }
}

const getQueryVariables = letter => {
  const letterRegex = formatLetterRegex(letter)

  return {
    condition: {
      is_active: { _eq: true },
      name: letterRegex ? { _iregex: letterRegex } : { _is_null: false },
      identifier: { _neq: 'gift' },
      is_brand_category: { _eq: true },
      products: {
        product: {
          ...categoryProductsInventoryCondition,
          ...productInLocaleCondition
        }
      }
    }
  }
}

const useBrandsQuery = ({
  selectedLetter,
  skip,
  limit = 24,
  target = 'categories',
  totalPath = 'categories_aggregate.aggregate.count'
}: any) => {
  const variables = getQueryVariables(selectedLetter)

  const formatResponse = data => {
    const brands = getIn(data, target)
    const brandsCount = getIn(data, totalPath) || 0

    return {
      brandsCount,
      brands: brands?.map(brand => {
        const image = brand?.images?.[0]?.image?.url_relative
        const logo = !/(Blank_logo)/.test(image) && image

        return {
          ...brand,
          logo,
          url_path: brand?.metadata?.url_path
        }
      })
    }
  }

  const mergeResults = (previousQueryResult, fetchMoreResult) => ({
    ...previousQueryResult,
    [target]: [...previousQueryResult?.[target], ...fetchMoreResult?.[target]]
  })

  return useQueryPagination(BrandsQuery, {
    useQueryHook: useHasuraQuery,
    formatResponse,
    mergeResults,
    hasMoreResults: (fetchMoreResult, { limit: resultsLimit }) => fetchMoreResult?.[target]?.length === resultsLimit,
    variables,
    target,
    limit,
    skip
  })
}

export default useBrandsQuery
