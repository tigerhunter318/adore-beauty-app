import { formatPromotionData, formatPromotionDescription, getPromotionsData } from '../helpers'

const tests = {
  getPromotionsData: [
    {
      data: [
        {
          id: 351,
          promotions: [
            {
              promotion: {
                id: 92,
                message: 'test 1'
              }
            },
            {
              promotion: {
                id: 108,
                message: 'test 2'
              }
            },
            {
              promotion: {
                id: 108,
                message: 'test 2'
              }
            },
            {
              promotion: null
            }
          ]
        }
      ],
      toEqual: [
        {
          id: 92,
          message: 'test 1'
        },
        {
          id: 108,
          message: 'test 2'
        }
      ]
    }
  ],
  formatPromotionData: [
    {
      data: {
        redeem_url: '/new-arrivals.html?dir=desc&order=news_from_date',
        message: '<div>Choose your Beauty Bonus Gift!</div>',
        site_message: '<div>Choose your gift when you spend $99 or more sitewide*</div>',
        display_name: 'Choose your Beauty Bonus Gift!',
        id: 1981,
        promotion_code_settings: [
          {
            code: 'BONUS',
            __typename: 'promotion_code_settings'
          }
        ],
        promotion_rules: [
          {
            promotion_rule_actions: [
              {
                add_free_item: false,
                amount: 100,
                brands: [],
                categories: [],
                products: [
                  {
                    product: {
                      id: 18490,
                      name: 'Jane Iredale Lash Duo Gift With Purchase',
                      description: 'Jane Iredale Lash Duo Gift With Purchase',
                      comestri_product_id: 23718,
                      images: [
                        {
                          image: {
                            url_relative:
                              'https://www.adorebeauty.com.au/media/catalog/product/j/a/jane-iredale-lash-duo-gift-with-purchase-by-member-reward-605_1.png',
                            __typename: 'images'
                          },
                          __typename: 'imageables'
                        }
                      ],
                      brands: [
                        {
                          brand: {
                            image_link:
                              'https://www.adorebeauty.com.au/media/catalog/category/160_65_jane_iredale_logo_11.png',
                            comestri_brand_id: 85,
                            __typename: 'brands'
                          },
                          __typename: 'productables_brand_view'
                        }
                      ],
                      __typename: 'products'
                    },
                    __typename: 'promotion_action_product_view'
                  }
                ],
                __typename: 'promotion_rule_actions'
              }
            ],
            promotion_rule_conditions: [
              {
                categories: [
                  {
                    item_matcher_condition: 'NotItemMatcher',
                    category: null,
                    __typename: 'promotion_condition_category_view'
                  },
                  {
                    item_matcher_condition: 'NotItemMatcher',
                    category: {
                      comestri_category_id: 6782,
                      name: 'Gift Cards',
                      __typename: 'categories'
                    },
                    __typename: 'promotion_condition_category_view'
                  }
                ],
                __typename: 'promotion_rule_conditions'
              }
            ],
            __typename: 'promotion_rules'
          }
        ],
        __typename: 'promotions'
      },
      toEqual: {
        amount: 100,
        brandLogo: 'https://www.adorebeauty.com.au/media/catalog/category/160_65_jane_iredale_logo_11.png',
        code: 'BONUS',
        description: 'Jane Iredale Lash Duo Gift With Purchase',
        image:
          'https://www.adorebeauty.com.au/media/catalog/product/j/a/jane-iredale-lash-duo-gift-with-purchase-by-member-reward-605_1.png',
        isAddFreeItem: null,
        message: '<div>Choose your Beauty Bonus Gift!</div>',
        name: null,
        products: [
          {
            __typename: 'products',
            brands: [
              {
                __typename: 'productables_brand_view',
                brand: {
                  __typename: 'brands',
                  comestri_brand_id: 85,
                  image_link: 'https://www.adorebeauty.com.au/media/catalog/category/160_65_jane_iredale_logo_11.png'
                }
              }
            ],
            comestri_product_id: 23718,
            description: 'Jane Iredale Lash Duo Gift With Purchase',
            id: 18490,
            images: [
              {
                __typename: 'imageables',
                image: {
                  __typename: 'images',
                  url_relative:
                    'https://www.adorebeauty.com.au/media/catalog/product/j/a/jane-iredale-lash-duo-gift-with-purchase-by-member-reward-605_1.png'
                }
              }
            ],
            name: 'Jane Iredale Lash Duo Gift With Purchase'
          }
        ],
        redeemUrl: '/new-arrivals.html?dir=desc&order=news_from_date',
        siteMessage: '<div>Choose your gift when you spend $99 or more sitewide*</div>',
        title: 'Choose your Beauty Bonus Gift!'
      }
    }
  ],
  formatPromotionDescription: [
    {
      data: `<span id="docs-internal-guid-75ac98fc-7fff-ae72-8070-68f3c55fb6b1"><span style="font-size: 11pt; font-family: Montserrat, sans-serif; color: rgb(64, 64, 64); font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">One of the highest-rated acne treatments in Europe.</span></span>`,
      toEqual: 'One of the highest-rated acne treatments in Europe.'
    },
    {
      data: `<span id="docs-internal-guid-dfc39966-7fff-13c4-1e25-2f323e8f34ad"><p dir="ltr" style="line-height: 1.38; text-align: center; margin-top: 0pt; margin-bottom: 0pt; padding: 0pt 0pt 3pt;"><span style="font-size: 10.5pt; font-family: Montserrat, sans-serif; color: rgb(64, 64, 64); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Jeju Cherry Blossom Skin 15ml,</span></p><p dir="ltr" style="line-height: 1.38; text-align: center; margin-top: 0pt; margin-bottom: 0pt; padding: 0pt 0pt 3pt;"><span style="font-size: 10.5pt; font-family: Montserrat, sans-serif; color: rgb(64, 64, 64); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Jeju Cherry Blossom Lotion 15ml,</span></p><p dir="ltr" style="line-height: 1.38; text-align: center; margin-top: 0pt; margin-bottom: 3pt;"><span style="font-size: 10.5pt; font-family: Montserrat, sans-serif; color: rgb(64, 64, 64); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Jeju Cherry Blossom Tone-up Cream 10ml</span></p><div><span style="font-size: 10.5pt; font-family: Montserrat, sans-serif; color: rgb(64, 64, 64); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;"><br></span></div></span>`,
      toEqual: 'Jeju Cherry Blossom Skin 15ml,Jeju Cherry Blossom Lotion 15ml,Jeju Cherry Blossom Tone-up Cream 10ml'
    }
  ]
}

describe('promotions helpers tests', () => {
  it('extracts nested promotions data', () => {
    tests.getPromotionsData.forEach(({ data, toEqual }) => expect(getPromotionsData(data)).toEqual(toEqual))
  })

  it('formats promotion data', () => {
    tests.formatPromotionData.forEach(({ data, toEqual }) => expect(formatPromotionData(data)).toEqual(toEqual))
  })

  it('formats promotion description', () => {
    tests.formatPromotionDescription.forEach(({ data, toEqual }) =>
      expect(formatPromotionDescription(data)).toEqual(toEqual)
    )
  })
})
