import getImageUrl, { matchComestriImage } from '../getImageUrl'

const cases = [
  {
    title: 'pim_media media image',
    src: 'https://www.adorebeauty.com.au/pim_media/000/427/557/Cloud-Nine-Promo-Image-3-Piece-Gift.png',
    match: '/pim_media/',
    result:
      'https://www.adorebeauty.com.au/pim_media/000/427/557/Cloud-Nine-Promo-Image-3-Piece-Gift.png?w=400&h=200&fmt=webp'
  },
  {
    title: 'aws pim_media media image',
    src:
      'https://s3-ap-southeast-2.amazonaws.com/fusionfactory.commerceconnect.adorebeauty.production/pim_media/000/427/557/Cloud-Nine-Promo-Image-3-Piece-Gift.png',
    match: '/pim_media/',
    result:
      'https://www.adorebeauty.com.au/pim_media/000/427/557/Cloud-Nine-Promo-Image-3-Piece-Gift.png?w=400&h=200&fmt=webp'
  },
  {
    title: 'irregular encoding',
    src:
      'https://www.adorebeauty.com.au/pim_media/000/284/242/ELEVEN_Australia_Repair_My_Hair_Nourishing_Shampoo_300ml_%2528ELE105%2529_Hero.png',
    match: '/pim_media/',
    result:
      'https://www.adorebeauty.com.au/pim_media/000/284/242/ELEVEN_Australia_Repair_My_Hair_Nourishing_Shampoo_300ml_%28ELE105%29_Hero.png?w=400&h=200&fmt=webp'
  },
  {
    title: 'url with query string',
    src:
      'https://s3-ap-southeast-2.amazonaws.com/fusionfactory.commerceconnect.adorebeauty.production/pim_media/000/428/064/IT-Cosmetics-Promo-Image-Confidence-in-an-Eye-Cream_-NEW_5ml.png?1675132290',
    match: '/pim_media/',
    result:
      'https://www.adorebeauty.com.au/pim_media/000/428/064/IT-Cosmetics-Promo-Image-Confidence-in-an-Eye-Cream_-NEW_5ml.png?w=400&h=200&fmt=webp'
  },
  //
  {
    title: 'aws pim_brand_logo media image',
    src:
      'https://s3-ap-southeast-2.amazonaws.com/fusionfactory.commerceconnect.adorebeauty.production/pim_brand_logo/000/000/058/LRP_Logo.png?1630981172',
    match: '/pim_brand_logo/',
    result: 'https://www.adorebeauty.com.au/pim_brand_logo/000/000/058/LRP_Logo.png?w=400&h=200&fmt=webp'
  },
  {
    title: 'contentful media image',
    src:
      'https://images.ctfassets.net/pi28xy1s107o/Xg4t0Nwr1fyo7aMPYMBnH/6890d83a2e6949c3911422f547714112/BIQ_hero_image__1440x1200___17_.png',
    match: undefined,
    result:
      'https://images.ctfassets.net/pi28xy1s107o/Xg4t0Nwr1fyo7aMPYMBnH/6890d83a2e6949c3911422f547714112/BIQ_hero_image__1440x1200___17_.png?fm=webp&w=400&h=200'
  },
  {
    title: 'contentful url with query string',
    src:
      'https://images.ctfassets.net/pi28xy1s107o/Xg4t0Nwr1fyo7aMPYMBnH/6890d83a2e6949c3911422f547714112/BIQ_hero_image__1440x1200___17_.png?a=b',
    match: undefined,
    result:
      'https://images.ctfassets.net/pi28xy1s107o/Xg4t0Nwr1fyo7aMPYMBnH/6890d83a2e6949c3911422f547714112/BIQ_hero_image__1440x1200___17_.png?fm=webp&w=400&h=200'
  },
  {
    title: 'old media image',
    src:
      'https://www.adorebeauty.com.au/media/catalog/product/a/e/aesop_resurrection_aromatique_hand_balm_tube_75ml_.png',
    match: undefined,
    result:
      'https://www.adorebeauty.com.au/media/catalog/product/a/e/aesop_resurrection_aromatique_hand_balm_tube_75ml_.png?w=400&h=200&fmt=webp'
  },
  {
    title: 'bigcommerce image',
    src:
      'https://cdn11.bigcommerce.com/s-61yxa1x1fw/products/6281/images/163582/Aesop_Resurrection_handwash__46296.1670400529.220.290.png',
    match: undefined,
    result:
      'https://cdn11.bigcommerce.com/s-61yxa1x1fw/products/6281/images/163582/Aesop_Resurrection_handwash__46296.1670400529.220.290.png?width=400'
  }
]

describe('get image urls tests', () => {
  cases.forEach(({ src, match, title }) => {
    it(`can match Comestri image pattern with ${title} `, () => {
      expect(matchComestriImage(src)).toBe(match)
    })
  })

  cases.forEach(({ src, result, title }) => {
    it(`can format ${title} type image`, () => {
      expect(getImageUrl({ src, width: 200, height: 100 })).toBe(result)
    })
  })
})
