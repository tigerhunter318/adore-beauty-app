import gql from 'graphql-tag'

const LuxuryBrandsQuery = gql`
  query app_LuxuryBrandsQuery {
    brands: categories(
      where: { is_brand_category: { _eq: true }, products: { product: { is_luxury: { _eq: true } } } }
    ) {
      name
      metadata {
        url_path
      }
    }
  }
`

export default LuxuryBrandsQuery
