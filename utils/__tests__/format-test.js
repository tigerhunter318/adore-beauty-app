import {
  formatExternalUrl,
  formatFromJson,
  formatPageIdentifier,
  formatPagePath,
  objectValuesToString,
  parseQueryString,
  formatProductSkuValue,
  truncate,
  formatSlug,
  formatUrlPath,
  sanitizeContent,
  formatScreenPath,
  stripBrandFromProductName,
  formatBrandNameFromProductName,
  formatCurrency,
  formatProductUrlPath
} from '../format'
import {
  isAppBrowserUrl,
  isAppScreenUrl,
  isExternalBrowserUrl,
  isValidRichText,
  isWebsitePath,
  isWebsiteUrl
} from '../validation'

describe('format tests', () => {
  // formatPagePath
  it('format a url to a path', () => {
    expect(formatPagePath('https://www.adorebeauty.com.au/new-arrivals.html?dir=desc&order=news_from_date')).toBe(
      'new-arrivals.html?dir=desc&order=news_from_date'
    )
    expect(
      formatPagePath(
        'https://www.adorebeauty.com.au/the-ordinary/the-ordinary-natural-moisturizing-factors-ha-100ml.html?a1=b=1   '
      )
    ).toBe('the-ordinary/the-ordinary-natural-moisturizing-factors-ha-100ml.html?a1=b=1')
    expect(
      formatPagePath(
        'https://www.adorebeauty.com.au/the-ordinary/the-ordinary-natural-moisturizing-factors-ha-100ml.html?a1=b=1   ',
        true
      )
    ).toBe('the-ordinary/the-ordinary-natural-moisturizing-factors-ha-100ml.html')
    expect(formatPagePath('https://adorebeauty.com.au/skin-care/cosmeceuticals/bhas-salicylic-acid.html')).toBe(
      'skin-care/cosmeceuticals/bhas-salicylic-acid.html'
    )
    expect(
      formatPagePath('https://www.adorebeauty.com.au/beautyiq/skin-care/dermalogica-smart-response-serum-review/')
    ).toBe('beautyiq/skin-care/dermalogica-smart-response-serum-review/')
    expect(formatPagePath('/beautyiq/skin-care/dermalogica-smart-response-serum-review/')).toBe(
      'beautyiq/skin-care/dermalogica-smart-response-serum-review/'
    )
    expect(formatPagePath('https://www.adorebeauty.com.au/')).toBe('')
    expect(formatPagePath('https://www.adorebeauty.com.au')).toBe('')
  })

  // formatPageIdentifier
  it('format a string to a page identifier api variable', () => {
    expect(
      formatPageIdentifier(
        'https://www.adorebeauty.com.au/the-ordinary/the-ordinary-natural-moisturizing-factors-ha-100ml.html?a1=b=1',
        true
      )
    ).toBe('the-ordinary-natural-moisturizing-factors-ha-100ml')
    expect(formatPageIdentifier('/the-ordinary/the-ordinary-natural-moisturizing-factors-ha-100ml.html', true)).toBe(
      'the-ordinary-natural-moisturizing-factors-ha-100ml'
    )
    expect(formatPageIdentifier('https://www.adorebeauty.com.au/new-arrivals.html?dir=desc&order=news_from_date')).toBe(
      'new-arrivals'
    )
    expect(formatPageIdentifier('https://adorebeauty.com.au/skin-care/cosmeceuticals/bhas-salicylic-acid.html')).toBe(
      'skin-care/cosmeceuticals/bhas-salicylic-acid'
    )
    expect(formatPageIdentifier('/skin-care.html')).toBe('skin-care')
    expect(
      formatPageIdentifier('https://www.adorebeauty.com.au/skin-care/cosmeceuticals/bhas-salicylic-acid.html', true)
    ).toBe('bhas-salicylic-acid')
    expect(formatPageIdentifier('dermalogica/dermalogica-smart-response-serum.html?a1&b2=1', true)).toBe(
      'dermalogica-smart-response-serum'
    )
    expect(
      formatPageIdentifier(
        'https://www.adorebeauty.com.au/beautyiq/skin-care/dermalogica-smart-response-serum-review/',
        false
      )
    ).toBe('beautyiq/skin-care/dermalogica-smart-response-serum-review/')
    expect(formatPageIdentifier('beautyiq/skin-care/dermalogica-smart-response-serum-review?a1=2', false)).toBe(
      'beautyiq/skin-care/dermalogica-smart-response-serum-review'
    )
    expect(
      formatPageIdentifier(
        'https://www.adorebeauty.com.au/beautyiq/skin-care/dermalogica-smart-response-serum-review/',
        true
      )
    ).toBe('dermalogica-smart-response-serum-review')
    expect(formatPageIdentifier('ABCabc')).toBe('ABCabc')
    expect(formatPageIdentifier('/abc/ABCabc', true)).toBe('ABCabc')
    expect(formatPageIdentifier('a', true)).toBe('a')
    expect(formatPageIdentifier(1, true)).toBe(1)
    expect(formatPageIdentifier('', true)).toBe('')
    expect(formatPageIdentifier(null, true)).toBe(null)

    // formatExternalUrl
    expect(formatExternalUrl('shipping.html')).toBe('https://www.adorebeauty.com.au/shipping.html')
    expect(
      formatExternalUrl('https://www.adorebeauty.com.au/beautyiq/skin-care/dermalogica-smart-response-serum-review/')
    ).toBe('https://www.adorebeauty.com.au/beautyiq/skin-care/dermalogica-smart-response-serum-review/')
    expect(formatExternalUrl('/beautyiq/skin-care/dermalogica-smart-response-serum-review/')).toBe(
      'https://www.adorebeauty.com.au/beautyiq/skin-care/dermalogica-smart-response-serum-review/'
    )
    expect(formatExternalUrl('beautyiq/skin-care/dermalogica-smart-response-serum-review/')).toBe(
      'https://www.adorebeauty.com.au/beautyiq/skin-care/dermalogica-smart-response-serum-review/'
    )
    expect(formatExternalUrl('')).toBe('https://www.adorebeauty.com.au/')
    expect(formatExternalUrl('/')).toBe('https://www.adorebeauty.com.au/')
    expect(formatExternalUrl('?a1')).toBe('https://www.adorebeauty.com.au/?a1')
    expect(
      formatExternalUrl('https://support.adorebeauty.com.au/hc/en-us/articles/115006480807-Unable-To-Locate-Order')
    ).toBe('https://support.adorebeauty.com.au/hc/en-us/articles/115006480807-Unable-To-Locate-Order')
    expect(
      formatExternalUrl('https://support.adorebeauty.com.au/hc/en-us/articles/115006480807-Unable-To-Locate-Order?a=1')
    ).toBe('https://support.adorebeauty.com.au/hc/en-us/articles/115006480807-Unable-To-Locate-Order?a=1')

    expect(
      formatExternalUrl(
        'https://support.adorebeauty.com.au/hc/en-us/articles/115006480807-Unable-To-Locate-Order?a=1',
        true
      )
    ).toBe('https://support.adorebeauty.com.au/hc/en-us/articles/115006480807-Unable-To-Locate-Order')

    // images
    //
    //
    expect(
      formatExternalUrl(
        'https://images.ctfassets.net/pi28xy1s107o/5PU6mj7GOmx9TJQCwBXpCf/4def08f98dcc3a8caecaa21bff3f3d42/yads.jpg.png?w=100',
        true
      )
    ).toBe(
      'https://images.ctfassets.net/pi28xy1s107o/5PU6mj7GOmx9TJQCwBXpCf/4def08f98dcc3a8caecaa21bff3f3d42/yads.jpg.png'
    )

    expect(
      formatExternalUrl(
        'https://www.adorebeauty.com.au/media/product/75c/adore-beauty-goodie-bag-three-june-gift-with-purchase-by-gift-984.jpg?width=100',
        true
      )
    ).toBe(
      'https://www.adorebeauty.com.au/media/product/75c/adore-beauty-goodie-bag-three-june-gift-with-purchase-by-gift-984.jpg'
    )

    expect(formatExternalUrl(null)).toBe(null)

    expect(formatExternalUrl('trackplayer://notification.click')).toBe('trackplayer://notification.click')

    // isWebsiteUrl

    expect(isWebsiteUrl('https://www.adorebeauty.com.au')).toBe(true)
    expect(isWebsiteUrl('https://adorebeauty.com.au')).toBe(true)
    expect(isWebsiteUrl('https://staging.adorebeauty.com.au/skin-care.html')).toBe(true)
    expect(isWebsiteUrl('https://support.adorebeauty.com.au/hc/en-us/articles')).toBe(false)
    expect(isWebsiteUrl('shipping.html')).toBe(true)
    expect(isWebsiteUrl('https://adorebeauty.com.au/skin-care/cosmeceuticals/bhas-salicylic-acid.html')).toBe(true)
    expect(isWebsiteUrl('https://www.google.com/adorebeauty')).toBe(false)
    expect(isWebsiteUrl('trackplayer://notification.click')).toBe(false)
  })

  it('can not open blocked urls in app', () => {
    expect(isAppScreenUrl('https://www.google.com/adorebeauty')).toBe(false)
    expect(isAppScreenUrl('https://adorebeauty.com.au/skin-care/cosmeceuticals/bhas-salicylic-acid.html')).toBe(true)
    expect(
      isAppScreenUrl(
        'https://www.adorebeauty.com.au/beautyiq/videos/adorebeauty-live/?socialMediaLiveshopping=Facebook&fbclid=IwAR1vVCpzHB4LLP4_rYpTPkmgmfvrFOXtrhzGZJt26pG67wpALv9RZdAB7w8#liveshopping-7UoHweFuNL0UXpeA7bSM'
      )
    ).toBe(true)
    expect(
      isAppScreenUrl(
        'https://www.adorebeauty.com.au/beautyiq/videos/adorebeauty-live/?socialMediaLiveshopping=Facebook&fbclid=IwAR1vVCpzHB4LLP4_rYpTPkmgmfvrFOXtrhzGZJt26pG67wpALv9RZdAB7w8#liveshopping-7UoHweFuNL0UXpeA7bSM&browser=inapp'
      )
    ).toBe(false)
    expect(
      isAppScreenUrl(
        'https://www.adorebeauty.com.au/beautyiq/videos/adorebeauty-live/?socialMediaLiveshopping=Facebook&browser=external&fbclid=IwAR1vVCpzHB4LLP4_rYpTPkmgmfvrFOXtrhzGZJt26pG67wpALv9RZdAB7w8#liveshopping-7UoHweFuNL0UXpeA7bSM'
      )
    ).toBe(false)
    expect(
      isAppScreenUrl('https://adorebeauty.com.au/skin-care/cosmeceuticals/bhas-salicylic-acid.html?browser=inapp')
    ).toBe(false)
    expect(
      isExternalBrowserUrl(
        'https://adorebeauty.com.au/skin-care/cosmeceuticals/bhas-salicylic-acid.html?browser=external'
      )
    ).toBe(true)
    expect(
      isExternalBrowserUrl('https://adorebeauty.com.au/skin-care/cosmeceuticals/bhas-salicylic-acid.html?browser=inapp')
    ).toBe(false)
    expect(
      isAppBrowserUrl('https://adorebeauty.com.au/skin-care/cosmeceuticals/bhas-salicylic-acid.html?browser=inapp')
    ).toBe(true)
    expect(
      isAppBrowserUrl('https://adorebeauty.com.au/skin-care/cosmeceuticals/bhas-salicylic-acid.html?browser=')
    ).toBe(false)
    expect(isAppBrowserUrl('https://wwww.google.com')).toBe(true)
    expect(isExternalBrowserUrl('https://wwww.google.com')).toBe(false)
  })

  it('check the url is an adore website and starts with a current path', () => {
    expect(isWebsitePath('https://staging.adorebeauty.com.au/skin-care.html', 'skin-care')).toBe(true)
    expect(isWebsitePath('https://wwww.adorebeauty.com.au/skin-care.html', '.html')).toBe(false)
    expect(isWebsitePath('https://www.adorebeauty.com.au/results?a=1&c=d', 'results?a')).toBe(true)
    expect(isWebsitePath('https://www.adorebeauty.com.au/account/password', 'account/password')).toBe(true)
    expect(isWebsitePath('https://staging.adorebeauty.com.au/account/password', '/account/password')).toBe(true)
    expect(isWebsitePath('https://staging.adorebeauty.com.au/account/password', 'password')).toBe(false)
    expect(isWebsitePath('https://www.adorebeauty.com.au/account', 'account/password')).toBe(false)
    expect(
      isWebsitePath('https://www.adorebeauty.com.au/account/resetpassword?asdasd=asd=dassad', 'account/resetpassword')
    ).toBe(true)
    expect(isWebsitePath('https://www.adorebeauty.com.au/account/password', 'account')).toBe(false)
    expect(isWebsitePath('https://www.adorebeauty.com.au/?app=Shop/brand', '?app=Shop/brand')).toBe(true)

    //
    expect(isWebsitePath('https://www.adorebeauty.com.au/account/password', 'account')).toBe(false)
  })

  // isValidRichText

  it('check if CMS page contains embedded scripts', () => {
    expect(isValidRichText([{ content: { html: '<!-- Placement v2 -->' } }])).toBe(false)
    expect(isValidRichText([{ content: { html: '<script>' } }])).toBe(false)
    expect(isValidRichText([{ content: { html: '<h1>TEST</h1>' } }])).toBe(true)
  })

  // formatFromJson

  it('format Json to valid format', () => {
    expect(formatFromJson(JSON.stringify({ html: '<h1>TEST</h1>' }))).toEqual({
      html: '<h1>TEST</h1>'
    })
    expect(formatFromJson({ html: '<h1>TEST</h1>' })).toEqual({
      html: '<h1>TEST</h1>'
    })
    expect(formatFromJson(null)).toBe(null)
  })

  // truncate
  it('truncate a string', () => {
    const text =
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
    expect(truncate(text)).toBe(
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the…'
    )
    expect(truncate(text, 50)).toBe('Lorem Ipsum is simply dummy text of the printing…')
    expect(truncate(text, 10).length).toBe(10)
    expect(truncate('Lorem Ipsum is simply dummy text of the printing and typesetting industry.')).toBe(
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
    )
    expect(truncate(text, 10).length).toBe(10)
  })

  it('format url string string to object', () => {
    expect(parseQueryString('https://www.adorebeauty.com.au/results?foo=bar')).toEqual({ foo: 'bar' })
    expect(parseQueryString('https://www.adorebeauty.com.au/results?foo=bar&q=skin')).toEqual({ foo: 'bar', q: 'skin' })
    expect(parseQueryString('https://www.adorebeauty.com.au/results?q=estee%20lauder')).toEqual({ q: 'estee lauder' })
  })

  it('format skus values array to string', () => {
    expect(formatProductSkuValue(['foo', 'bar'])).toBe('foo')
    expect(formatProductSkuValue('foo')).toBe('foo')
  })

  it('format url string string to object', () => {
    const input = {
      foo: true,
      bar: 12,
      a: 'b'
    }
    const output = {
      foo: 'true',
      bar: '12',
      a: 'b'
    }
    expect(objectValuesToString(input)).toStrictEqual(output)
  })

  it('formatSlug and remove non alpha-numeric chars', () => {
    expect(formatSlug("{'foo':'bar'}")).toBe('foo-bar')
    expect(formatSlug('Amy Clark')).toBe('amy-clark')
    expect(formatSlug('Amy     Clark')).toBe('amy-clark')
    expect(formatSlug(`{"locale":"en-AU","rows":4,"type":"beautyiq,guide"}`)).toBe(
      'locale-en-au-rows-4-type-beautyiq-guide'
    )
    expect(formatSlug(`Skincare Routine for Less Than $150`)).toBe('skincare-routine-for-less-than-150')
  })

  const formatUrlPathTests = [
    {
      url: 'https://www.adorebeauty.com.au/beautyiq/skin-care/dermalogica-smart-response-serum-review/',
      toBe: '/beautyiq/skin-care/dermalogica-smart-response-serum-review/'
    },
    {
      url: 'beautyiq/skin-care/dermalogica-smart-response-serum-review/',
      toBe: '/beautyiq/skin-care/dermalogica-smart-response-serum-review/'
    },
    {
      url: '/beautyiq/skin-care/dermalogica-smart-response-serum-review/index.html?a=b',
      toBe: '/beautyiq/skin-care/dermalogica-smart-response-serum-review/index.html'
    },
    {
      url: '',
      toBe: `/`
    }
  ]

  formatUrlPathTests.forEach(({ url, toBe }) => {
    it(`can format a ${url} to a path with leading slash toBe ${toBe}`, () => expect(formatUrlPath(url)).toBe(toBe))
  })

  // * Sanitize Content

  const sanitizeContentTests = [
    {
      htmlString: `<div><h2 hide-for-app>test 1</center><center hide-for-app="">test 2</center><center>test 3</center><center hide-for-app>test 4</center></div>`,
      toBe: `<div>test 3</div>`
    },
    {
      htmlString: `<p><strong hide-for-app >What it is:</strong> <a href="https://www.adorebeauty.com.au/kiehls/kiehl-s-ultra-facial-cleanser.html" title="">Kiehl's Ultra Facial Cleanser</a> suits all skin types and makes your skin feel squeaky clean but not tight or parched.</p><br/><p>You need only a tiny pea-sized amount because the product emulsifies quickly in warm water.</p><p>The sugar-derived foaming agent carefully removes makeup and daily grime without stripping the skin\u2019s surface of natural oils.</p><p>Kiehl's Ultra Facial Cleanser is also enriched with<br/> Squalane, Apricot Kernel Oil,             Vitamin E, and Avocado Oil to nourish.</p><p><strong>Shop it here:</strong></p>`,
      toBe: `<p> <a href="https://www.adorebeauty.com.au/kiehls/kiehl-s-ultra-facial-cleanser.html" title="">Kiehl's Ultra Facial Cleanser</a> suits all skin types and makes your skin feel squeaky clean but not tight or parched.</p> <p>You need only a tiny pea-sized amount because the product emulsifies quickly in warm water.</p><p>The sugar-derived foaming agent carefully removes makeup and daily grime without stripping the skin\u2019s surface of natural oils.</p><p>Kiehl's Ultra Facial Cleanser is also enriched with Squalane, Apricot Kernel Oil, Vitamin E, and Avocado Oil to nourish.</p><p><strong>Shop it here:</strong></p>`
    },
    {
      htmlString: `<p class="hide-for-app">This is some more text.</p>`,
      toBe: ``
    },
    {
      htmlString: `<head><script async src="https://www.instagram.com/embed.js"></script><script src="https://cdn.embedly.com/widgets/platform.js"></script><script>window.instgrm.Embeds.process()</script></head><body><blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/CVpehWZhCYU/?utm_source=ig_embed&utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);; max-width:100% !important; min-width:auto !important;"><div style="padding:16px;"> <a href="https://www.instagram.com/p/CVpehWZhCYU/?utm_source=ig_embed&utm_campaign=loading" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank" data-card-key="542239e8d5144167ac6474a184f2d244"> <div style=" display: flex; flex-direction: row; align-items: center;"><a href="https://www.instagram.com/p/CVpehWZhCYU/?utm_source=ig_embed&utm_campaign=loading" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none;" target="_blank" data-card-key="542239e8d5144167ac6474a184f2d244">A post shared &tradeby BIODERMA Australia &nbsp (@biodermaaustralia)</a></p></div></blockquote></body>`,
      toBe: `<body><blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/CVpehWZhCYU/?utm_source=ig_embed&utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);; max-width:100% !important; min-width:auto !important;"><div style="padding:16px;"> <a href="https://www.instagram.com/p/CVpehWZhCYU/?utm_source=ig_embed&utm_campaign=loading" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank" data-card-key="542239e8d5144167ac6474a184f2d244"> <div style=" display: flex; flex-direction: row; align-items: center;"><a href="https://www.instagram.com/p/CVpehWZhCYU/?utm_source=ig_embed&utm_campaign=loading" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none;" target="_blank" data-card-key="542239e8d5144167ac6474a184f2d244">A post shared &tradeby BIODERMA Australia &nbsp (@biodermaaustralia)</a></p></div></blockquote></body>`
    },
    {
      htmlString: `<div style="padding:168.15% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/803282138?h=3803979cd9&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479%22"  frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Moroccanoil Perfectly Polished Flat Iron Soft Waves Tutorial"></iframe></div><script src="https://player.vimeo.com/api/player.js"</script>`,
      toBe: `<div style="padding:168.15% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/803282138?h=3803979cd9&badge=0&autopause=0&player_id=0&app_id=58479%22" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Moroccanoil Perfectly Polished Flat Iron Soft Waves Tutorial"></iframe></div><script src="https://player.vimeo.com/api/player.js"</script>`
    },
    {
      htmlString: `<iframe src="https://omny.fm/shows/beauty-iq-uncensored/ep-177-love-the-ordinary-this-ones-for-you/embed?style=Cover%22"  width="100%" height="180" allow="autoplay; clipboard-write" frameborder="0" title="Ep 177: Love The Ordinary? This One's For You"></iframe>`,
      toBe: `<iframe src="https://omny.fm/shows/beauty-iq-uncensored/ep-177-love-the-ordinary-this-ones-for-you/embed?style=Cover%22" width="100%" height="180" allow="autoplay; clipboard-write" frameborder="0" title="Ep 177: Love The Ordinary? This One's For You"></iframe>`
    },
    {
      htmlString: `<iframe width="100%" height="315" src="https://www.youtube.com/embed/DGGuh39YVZs?rel=0%22"  title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`,
      toBe: `<iframe width="100%" height="315" src="https://www.youtube.com/embed/DGGuh39YVZs?rel=0%22" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
    }
  ]

  sanitizeContentTests.forEach(({ htmlString, toBe }) => {
    it(`can format html strings removing blacklisted tags and html symbols`, () =>
      expect(sanitizeContent(htmlString)).toBe(toBe))
  })

  it('formatScreenPath and convert true / false strings to 1 0', () => {
    expect(
      formatScreenPath(
        'MainDrawer/Main/ProductStack/Product?inStock=true&is_consent_needed=false&productSku=MB185400&product_id=5232&q='
      )
    ).toBe('/MainDrawer/Main/ProductStack/Product?inStock=1&is_consent_needed=0&productSku=MB185400&product_id=5232&q=')

    expect(formatScreenPath('/Product?inStock=1&true=false')).toBe('/Product?inStock=1&true=0')

    expect(formatScreenPath()).toBe('/')

    expect(formatScreenPath('')).toBe('/')
  })

  const formatCurrencyTests = [
    {
      value: 0,
      toBe: '$0.00'
    },
    {
      value: '90',
      toBe: '$90.00'
    },
    {
      value: '78a',
      prefix: '',
      toBe: '78.00'
    },
    {
      value: undefined,
      toBe: undefined
    }
  ]

  formatCurrencyTests.forEach(({ value, prefix, toBe }) => {
    it(`can format value ${value} to ${toBe}`, () => expect(formatCurrency(value, prefix)).toBe(toBe))
  })
})

// jest --watch utils/__tests__/format-test.js
describe('stripBrandFromProductName tests', () => {
  /*eslint-disable*/
  const cases = [
    { brand: 'The Ordinary', title: 'The Ordinary Supersize Hyaluronic Acid 2% + B5 - 60ml', expected: 'Supersize Hyaluronic Acid 2% + B5 - 60ml' },
    { brand: "L'Oreal Paris", title: "L'oreal Paris Clinically Proven Lash Serum", expected: 'Clinically Proven Lash Serum' },
    { brand: 'Ella Bache', title: 'Ella Baché Ultra Nourishing Cream', expected: 'Ultra Nourishing Cream' },
    { brand: 'Estee Lauder', title: 'Estée Lauder Double Wear Pump', expected: 'Double Wear Pump' },
    { brand: 'Lancome', title: 'Lancôme Hypnôse Mascara 01 Noir', expected: 'Hypnôse Mascara 01 Noir' },
    { brand: 'Urban Apothecary London', title: 'Urban Apothecary Fig Tree Candle 300g', expected: 'Fig Tree Candle 300g' },
    { brand: {}, title: 'Brand Product Name', expected: 'Brand Product Name' },
    { brand: undefined, title: 'Brand Product Name', expected: 'Brand Product Name' },
    { brand: 'Brand', title: {}, expected: '' },
    { brand: 'Brand', title: null, expected: '' },
  ]
  /* eslint-enable */

  cases.forEach(({ brand, title, expected }) => {
    it(`can strip ${brand} from ${title}`, () => {
      expect(stripBrandFromProductName(brand, title)).toBe(expected)
    })
  })
})

describe('formatBrandFromProductName tests', () => {
  /*eslint-disable*/
  const cases = [
    { brand: 'The Ordinary', title: 'The Ordinary Supersize Hyaluronic Acid 2% + B5 - 60ml', expected: 'The Ordinary' },
    { brand: "L'Oreal Paris", title: "L'oreal Paris Clinically Proven Lash Serum", expected: 'L\'Oreal Paris' },
    { brand: 'Ella Bache', title: 'Ella Baché Ultra Nourishing Cream', expected: 'Ella Baché' },
    { brand: 'Estee Lauder', title: 'Estée Lauder Double Wear Pump', expected: 'Estée Lauder' },
    { brand: 'Lancome', title: 'Lancôme Hypnôse Mascara 01 Noir', expected: 'Lancôme' },
    { brand: 'Urban Apothecary London', title: 'Urban Apothecary Fig Tree Candle 300g', expected: 'Urban Apothecary London' },
    { brand: {}, title: 'Brand Product Name', expected: '' },
    { brand: undefined, title: 'Brand Product Name', expected: '' },
    { brand: 'Brand', title: '', expected: 'Brand' },
  ]
  /* eslint-enable */

  cases.forEach(({ brand, title, expected }) => {
    it(`can correct spelling of ${brand} from ${title}`, () => {
      expect(formatBrandNameFromProductName(brand, title)).toBe(expected)
    })
  })
})

describe('format Product Url tests', () => {
  /*eslint-disable*/
  const cases = [
    { url: 'https://www.adorebeauty.com.au/the-ordinary/the-ordinary-natural-moisturizing-factors-ha-100ml.html', expected: '/p/the-ordinary/the-ordinary-natural-moisturizing-factors-ha-100ml.html' },
    { url: 'https://www.adorebeauty.com.au/p/the-ordinary/the-ordinary-natural-moisturizing-factors-ha-100ml.html', expected: '/p/the-ordinary/the-ordinary-natural-moisturizing-factors-ha-100ml.html' },
    { url: 'https://www.adorebeauty.com.au/p/the-ordinary/the-ordinary-natural-moisturizing-factors-ha-100ml.html?foo=bar', expected: '/p/the-ordinary/the-ordinary-natural-moisturizing-factors-ha-100ml.html' },
    { url: '/the-ordinary/the-ordinary-natural-moisturizing-factors-ha-100ml.html', expected: '/p/the-ordinary/the-ordinary-natural-moisturizing-factors-ha-100ml.html' },
    { url: '/p/the-ordinary/the-ordinary-natural-moisturizing-factors-ha-100ml.html', expected: '/p/the-ordinary/the-ordinary-natural-moisturizing-factors-ha-100ml.html' },
  ]
  /* eslint-enable */

  cases.forEach(({ url, expected }) => {
    it(`can format a ${url} as a url path `, () => {
      expect(formatProductUrlPath(url)).toBe(expected)
    })
  })
})
