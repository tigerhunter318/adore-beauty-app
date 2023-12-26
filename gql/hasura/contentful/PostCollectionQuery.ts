import gql from 'graphql-tag'

// TODO get the blog url
export const simpleBlogPostCollectionFragment = gql`
  fragment simpleBlogPostFields on SimpleBlogPostCollection {
    total
    items {
      title
      author {
        name
        image {
          url
        }
      }
      sys {
        id
      }
      heroImage {
        url
      }
      facebookImage {
        url
      }
      publishDate
      __typename
    }
    __typename
  }
`

const PostCollectionQuery = gql`
  ${simpleBlogPostCollectionFragment}
  query app_PostCollectionQueryQuery($limit: Int) {
    contentful {
      simpleBlogPostCollection(limit: $limit, order: publishDate_DESC) {
        ...simpleBlogPostFields
      }
    }
  }
`

export default PostCollectionQuery
