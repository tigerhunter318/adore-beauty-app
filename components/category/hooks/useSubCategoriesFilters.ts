import { formatUrlPathQueryVariables } from '../../../gql/hasura/utils/format'
import useScreenQuery, { ScreenQueryHookOptions } from '../../../gql/useScreenQuery'
import useHasuraQuery from '../../../gql/hasura/utils/useHasuraQuery'
import CategorySubCategoriesFiltersQuery from '../../../gql/hasura/categories/CategorySubCategoriesFiltersQuery'

type SubCategoriesFiltersOptions = ScreenQueryHookOptions & {
  url?: string
  skip?: boolean
  productConditions?: any
}
const useSubCategoriesFilters = ({ url, skip = true, productConditions, ...rest }: SubCategoriesFiltersOptions) => {
  const variables = {
    categoryConditions: formatUrlPathQueryVariables(url),
    productConditions
  }

  const { data, ...queryResult } = useScreenQuery(CategorySubCategoriesFiltersQuery, {
    useQueryHook: useHasuraQuery,
    formatResponse: response => response?.subCategories?.[0]?.children,
    variables,
    skip,
    ...rest
  })

  const subCategories = data?.map(option => ({
    name: option.name,
    label: option.name,
    code: option?.metadata?.url_path,
    id: option?.metadata?.url_path
  }))

  return { data, subCategories, ...queryResult }
}

export default useSubCategoriesFilters
