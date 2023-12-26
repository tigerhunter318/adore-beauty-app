import gql from 'graphql-tag'
import { simpleBlogPostCollectionFragment } from './PostCollectionQuery'

const CategoryArticlesQuery = gql`
  ${simpleBlogPostCollectionFragment}
  query app_CategoryArticlesQuery(
    $categoryIds: [Int]
    $brandIds: [Int]
    $limit: Int
    $skipCategories: Boolean = false
    $skipBrands: Boolean = false
    $skip: Int = 0
  ) {
    contentful {
      adoreBeautyCategoriesCollection(where: { categoryId_in: $categoryIds }) @skip(if: $skipCategories) {
        items {
          linkedFrom {
            simpleBlogPostCollection(limit: $limit, skip: $skip) {
              ...simpleBlogPostFields
            }
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
      adoreBeautyBrandsCollection(where: { brandId_in: $brandIds }) @skip(if: $skipBrands) {
        items {
          linkedFrom {
            simpleBlogPostCollection(limit: $limit, skip: $skip) {
              ...simpleBlogPostFields
            }
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
  }
`

export default CategoryArticlesQuery
