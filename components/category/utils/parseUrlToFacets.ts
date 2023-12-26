import { formatPageIdentifier, formatPagePath, parseQueryString } from '../../../utils/format'
import envConfig from '../../../config/envConfig'
import { isValidArray, isValidObject } from '../../../utils/validation'
import { hasuraQuery } from '../../../gql/hasura/utils/useHasuraQuery'
import SubCategoriesQuery from '../../../gql/hasura/categories/SubCategoriesQuery'
import { filterObjectByKeys } from '../../../utils/object'
import ProductFacetGroupsQuery from '../../../gql/hasura/categories/ProductFacetGroupsQuery'
import { formatUrlPathQueryVariables } from '../../../gql/hasura/utils/format'
import { formatCategoryProductsQuery } from '../../../gql/hasura/categories/CategoryProductsQuery'

const getSpecialCategorySortIndex = identifier =>
  envConfig.hasura.categorySortIndexes.find(item => item.identifier === identifier.replace('-', '_'))

export const parseUrlToFacets = async fullPath => {
  let [category] = fullPath.split('?')
  let facets: any = parseQueryString(fullPath, { decoder: str => (str ? str.split(',') : []) }) || {}
  let specialCategorySortIndex = getSpecialCategorySortIndex(formatPageIdentifier(fullPath))
  let order = specialCategorySortIndex || envConfig.hasura.categorySortIndexes[0]
  const manufacturerIds = facets?.manufacturer?.map(item => Number(item))

  if (/\?appScreenPath=/.test(fullPath)) {
    category = fullPath.split('?appScreenPath=')?.[1]?.split('url=')?.[1]
    facets = {}
  }

  if (specialCategorySortIndex) {
    category = ''
  }

  if (facets?.order) {
    let { identifier, dir } = parseQueryString(`?identifier=${decodeURIComponent(facets.order)}`)

    if (identifier === 'price') {
      if (dir) {
        identifier = `price_${dir}`
      } else {
        identifier = `price_asc`
      }
    }

    specialCategorySortIndex = getSpecialCategorySortIndex(identifier)

    if (specialCategorySortIndex) {
      order = specialCategorySortIndex
    }
  }

  if (isValidObject(facets)) {
    const pathQueryVariables = formatUrlPathQueryVariables(`/${formatPagePath(fullPath, true)}`)
    const availableFilters = await hasuraQuery({
      query: ProductFacetGroupsQuery,
      variables: {
        categoryCondition: pathQueryVariables,
        productCondition: {
          _and: [{ categories: { category: pathQueryVariables } }],
          ...formatCategoryProductsQuery({})
        }
      }
    })

    const facetsWhitelist = availableFilters?.data?.facets?.map(facet => facet.code)?.filter(x => x)
    facets = filterObjectByKeys(facets, facetsWhitelist, true)
  }

  if (manufacturerIds) {
    const { data } = await hasuraQuery({
      query: SubCategoriesQuery,
      variables: {
        categoryConditions: { comestri_category_id: { _in: manufacturerIds } }
      }
    })
    const brandIdentifiers = data?.subCategories?.map(cat => cat?.identifier)

    if (isValidArray(brandIdentifiers)) {
      facets.brand = brandIdentifiers
    }
  }

  return {
    category,
    facets,
    order
  }
}
