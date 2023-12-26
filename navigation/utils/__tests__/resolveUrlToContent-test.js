import resolveUrlToContent from '../resolveUrlToContent'

const consoleInfoMock = jest.spyOn(console, 'info').mockImplementation()

/**
 * mock PageTypeQuery results
 */
jest.mock('../../../services/apollo/apollo', () => ({
  graphQuery: ({ variables }) => {
    const mockData = {
      // category PageTypeQuery result
      'skin-care': {
        data: {
          article: [],
          category: [
            { url: '/weleda/skin-care.html', url_key: 'skin-care' },
            { url: '/skin-care.html', url_key: 'skin-care' },
            { url: '/benefit-cosmetics/skin-care.html', url_key: 'skin-care' }
          ],
          product: []
        }
      },
      // product PageTypeQuery result
      'estee-lauder-double-wear-makeup': {
        data: {
          article: [],
          category: [],
          product: [
            {
              url: 'https://www.adorebeauty.com.au/estee-lauder/estee-lauder-double-wear-makeup.html',
              product_id: 541178,
              identifier: 'estee-lauder-double-wear-makeup'
            }
          ]
        }
      },
      // article PageTypeQuery result
      'skin-care/guide/best-skin-care-products-for-40-year-olds-australia': {
        data: {
          category: [],
          product: [],
          article: [
            {
              name: '10 Things I’ve Learnt About Skin Care For Mature Skin in My 40s',
              sysId: '6vxXFvH8apB33SoaXcUJjo',
              url: 'skin-care/guide/best-skin-care-products-for-40-year-olds-australia',
              url_path: '/beautyiq/skin-care/best-skin-care-products-for-40-year-olds-australia/'
            }
          ]
        }
      }
    }
    // console.log('mock graphQuery', variables.identifier, variables.url, mockData[variables.identifier] || mockData[variables.url])
    return mockData[variables.identifier] || mockData[variables.url]
  }
}))

describe('Test cases resolveUrlToContent', () => {
  const cases = [
    // {
    //   name: 'can resolve /p/ product url to content',
    //   url: 'https://www.adorebeauty.com.au/p/estee-lauder/estee-lauder-double-wear-makeup.html',
    //   expected: {
    //     identifier: 'estee-lauder-double-wear-makeup',
    //     url: 'estee-lauder/estee-lauder-double-wear-makeup.html',
    //     type: 'product'
    //   }
    // },
    {
      name: 'can resolve product url to content',
      url: 'https://www.adorebeauty.com.au/estee-lauder/estee-lauder-double-wear-makeup.html',
      expected: {
        identifier: 'estee-lauder-double-wear-makeup',
        type: 'product',
        product_id: 541178
      }
    },
    // {
    //   name: 'can resolve /c/ category url to content',
    //   url: 'https://www.adorebeauty.com.au/c/skin-care.html',
    //   expected: {
    //     identifier: 'skin-care',
    //     url: 'skin-care.html',
    //     type: 'category'
    //   }
    // },
    // {
    //   name: 'can resolve /b/ brand url to content',
    //   url: 'https://www.adorebeauty.com.au/b/estee-lauder.html',
    //   expected: {
    //     identifier: 'estee-lauder',
    //     url: 'estee-lauder.html',
    //     type: 'category',
    //     name: 'brand'
    //   }
    // },
    {
      name: 'can resolve non beauty url to content with beauty iq url',
      url: 'https://www.adorebeauty.com.au/skin-care/guide/best-skin-care-products-for-40-year-olds-australia',
      expected: {
        sysId: '6vxXFvH8apB33SoaXcUJjo',
        type: 'article',
        url: 'skin-care/guide/best-skin-care-products-for-40-year-olds-australia',
        url_path: '/beautyiq/skin-care/best-skin-care-products-for-40-year-olds-australia/'
      }
    }
    // {
    //   name: 'can resolve beauty url to content',
    //   url: 'https://www.adorebeauty.com.au/beautyiq/skin-care/best-skin-care-products-for-40-year-olds-australia/',
    //   expected: {
    //     type: 'article',
    //     url: 'beautyiq/skin-care/best-skin-care-products-for-40-year-olds-australia/'
    //   }
    // }
  ]
  cases.forEach(item => {
    const { name, url, expected } = item
    it(name, async () => {
      const response = await resolveUrlToContent(url, ['graph'])
      expect(response).toEqual(expect.objectContaining(expected))
    })
  })
})
