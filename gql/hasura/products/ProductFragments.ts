import gql from 'graphql-tag'

export const ProductFragments = gql`
  fragment productFields on products {
    id
    big_commerce_product_id
    magento_product_id
    comestri_product_id
    sku
    is_luxury
    name_raw
    qdos_stock_status
    class_type
    is_consent_required
  }

  fragment productMetadata on products {
    metadata {
      url_path
      comestri_url_key
    }
  }

  fragment productPrices on products {
    product_prices {
      amount
      price_book
    }
  }
  fragment productImage on products {
    images(where: { image: { tags: { _has_key: "image" } } }, limit: 1) {
      image {
        url_relative
      }
    }
  }
  fragment productGalleryImages on products {
    images(where: { image: { url_relative: { _nregex: "embed" } } }, limit: 20) {
      image {
        url_relative
        tags
        is_primary
      }
    }
  }
  fragment productInventories on products {
    has_variation_inventory_available_au
    has_variation_inventory_available_nz
    inventories {
      is_available
      quantity
      stock_availability
      inventory_source
    }
  }

  fragment productTopLevelCategory on products {
    categories(
      where: { category: { path_tree: { _matches: "au.default.*{1}" } } }
      order_by: { category: { comestri_parent_id: asc, sort_order: asc } }
      limit: 1
    ) {
      category {
        id
        name
        magento_category_id
        comestri_category_id
      }
    }
  }

  fragment productBrandCategory on products {
    brand_category: categories(where: { category: { is_brand_category: { _eq: true } } }, limit: 1) {
      category {
        name_raw
        identifier
        comestri_category_id
        magento_category_id
        images(where: { image: { tags: { _has_keys_any: ["brand_logo"] } } }) {
          image {
            url_relative
            tags
          }
        }
      }
    }
  }

  fragment productBrandName on products {
    brand_category: categories(where: { category: { is_brand_category: { _eq: true } } }, limit: 1) {
      category {
        name_raw
      }
    }
  }

  fragment productFacets on products {
    product_facets(where: { facet_group_option: { facet_group: { name: { _eq: "Choices" } } } }) {
      facet_group_option {
        name
      }
    }
  }
  fragment productReviewTotals on products {
    recommendation_total: reviews_aggregate(where: { recommend: { _in: ["definitely_yes", "likely"] } }) {
      aggregate {
        count
      }
    }
    review_total: reviews_aggregate {
      aggregate {
        count
        avg {
          rating_value
        }
      }
    }
  }

  fragment productReviewTotals on products {
    recommendation_total: reviews_aggregate(where: { recommend: { _in: ["definitely_yes", "likely"] } }) {
      aggregate {
        count
      }
    }
    review_total: reviews_aggregate {
      aggregate {
        count
        avg {
          rating_value
        }
      }
    }
  }

  fragment productReviewAverage on products {
    reviews_average: reviews_aggregate {
      aggregate {
        count
        avg {
          rating_value
        }
      }
    }
  }
`
