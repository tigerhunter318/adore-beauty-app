import { findNestedNodeByPropertyKey, findNestedNodeByPropertyValue, findNodeLinkDetails } from '../helpers'

const tests = {
  findNestedNodeByPropertyValue: [
    {
      node: { attribs: {}, children: [{ data: ' a lot. ', type: 'text' }], name: 'em', type: 'tag' },
      property: 'name',
      value: 'strong',
      toEqual: null
    },
    {
      node: { attribs: {}, children: [{ data: 'really like', type: 'text' }], name: 'strong', type: 'tag' },
      property: 'name',
      value: 'strong',
      toEqual: { attribs: {}, children: [{ data: 'really like', type: 'text' }], name: 'strong', type: 'tag' }
    }
  ],
  findNestedNodeByPropertyKey: [
    {
      node: { attribs: {}, children: [{ data: ' a lot. ', type: 'text' }], name: 'em', type: 'tag' },
      key: 'name',
      toEqual: 'em'
    },
    {
      node: { attribs: {}, children: [{ data: 'until now', type: 'text' }], name: 'em', type: 'tag' },
      key: 'data',
      toEqual: 'until now'
    }
  ],
  findNodeLinkDetails: [
    {
      node: {
        type: 'tag',
        name: 'a',
        attribs: {
          href: 'https://www.adorebeauty.com.au/make-up/mascara/guide/best-mascaras-adore-beauty',
          title: ''
        },
        children: [
          {
            type: 'tag',
            name: 'strong',
            attribs: {},
            children: [
              {
                data: 'Bargain vs Bougie: The Difference Between Our 4 Best-Selling Mascaras',
                type: 'text'
              }
            ]
          }
        ],
        next: null,
        prev: {
          type: 'tag',
          name: 'strong',
          attribs: {},
          children: []
        },
        parent: null
      },
      toEqual: {
        hasLink: true,
        linkTitle: 'Bargain vs Bougie: The Difference Between Our 4 Best-Selling Mascaras',
        linkUrl: 'https://www.adorebeauty.com.au/make-up/mascara/guide/best-mascaras-adore-beauty'
      }
    },
    {
      node: {
        type: 'tag',
        name: 'a',
        attribs: {
          href: 'https://www.adorebeauty.com.au/beautyiq/hair/i-tried-olaplexs-new-bonding-oil-and-this-is-my-verdict/',
          title: ''
        },
        children: [
          {
            type: 'tag',
            name: 'strong',
            attribs: {},
            children: [
              {
                data: "I Tried Olaplex's New Bonding Oil & This Is My Verdict",
                type: 'text'
              }
            ]
          }
        ],
        next: null,
        prev: null,
        parent: null
      },
      toEqual: {
        linkUrl:
          'https://www.adorebeauty.com.au/beautyiq/hair/i-tried-olaplexs-new-bonding-oil-and-this-is-my-verdict/',
        linkTitle: "I Tried Olaplex's New Bonding Oil & This Is My Verdict",
        hasLink: true
      }
    },
    {
      node: {
        type: 'tag',
        name: 'h2',
        attribs: {},
        children: [
          {
            data: 'Which OLAPLEX Should I Use?',
            type: 'text'
          }
        ]
      },
      toEqual: {
        linkUrl: undefined,
        linkTitle: null,
        hasLink: false
      }
    }
  ]
}

describe('object tests', () => {
  it('finds the first matching property in a node based on the value', () => {
    tests.findNestedNodeByPropertyValue.forEach(({ node, property, value, toEqual }) =>
      expect(findNestedNodeByPropertyValue(node, property, value)).toEqual(toEqual)
    )
  })

  it('finds the first matching property in a node based on the key', () => {
    tests.findNestedNodeByPropertyKey.forEach(({ node, key, toEqual }) =>
      expect(findNestedNodeByPropertyKey(node, key)).toEqual(toEqual)
    )
  })

  it('finds link properties on node', () => {
    tests.findNodeLinkDetails.forEach(({ node, toEqual }) => expect(findNodeLinkDetails(node)).toEqual(toEqual))
  })
})
