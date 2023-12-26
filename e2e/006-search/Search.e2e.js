/* eslint-disable no-undef */
import {
  expectToBeVisible,
  expectToBeVisibleWhenScrolled,
  launchApp,
  tapChild,
  tapElement,
  waitToExist,
  expectToHaveText,
  typeText
} from '../helpers'

const productScreen = 'ProductScreen'
const searchResultsScreen = 'SearchProducts.Hits'
const searchIcon = 'Header.SearchButton'
const suggestionsScreenSearchBox = 'SearchSuggestions.SearchBox'
const resultsScreenSearchBox = 'SearchResults.SearchBox'
const productScreenSearchBox = 'Product.SearchBox'
const searchTerm = 'ordinary'
const searchSuggestionsHits = 'SearchSuggestionsHits'
const searchSuggestionHit = 'SearchSuggestionsHits.Item'
const searchProductsCarouselItem = 'SearchProductsCarousel.Item'

/**
 * * detox build --configuration ios.sim.debug
 * * detox test --configuration ios.sim.debug e2e/006-search/Search.e2e.js
 */

describe('Search product carousel', () => {
  it('can launch app', async () => {
    await launchApp({ clearAsyncStorage: true })
  })
  it(`can launch the search screen by tapping on search icon`, async () => {
    await tapElement(searchIcon)
  })
  it(`can enter a search term and see suggested products carousel`, async () => {
    await typeText(suggestionsScreenSearchBox, searchTerm)
    await waitToExist(searchSuggestionsHits)
  })
  it(`can tap on suggested products carousel and open product screen`, async () => {
    await tapChild(searchSuggestionsHits, searchProductsCarouselItem, 0)
    await expectToBeVisible(productScreen)
  })
})

describe('Search results from search icon', () => {
  it('can launch app', async () => {
    await launchApp({ clearAsyncStorage: true })
  })
  it(`can launch the search screen by tapping on search icon`, async () => {
    await tapElement(searchIcon)
  })
  it(`can enter a search term`, async () => {
    await typeText(suggestionsScreenSearchBox, searchTerm)
    await waitToExist(searchSuggestionsHits)
  })
  it(`can tap on search suggestion and open search results screen`, async () => {
    await tapChild(searchSuggestionsHits, searchSuggestionHit, 0)
    await expectToBeVisible(searchResultsScreen)
    await expectToHaveText(resultsScreenSearchBox, searchTerm)
  })
  it(`can search clear input by tapping on "X" icon and return to suggestions screen`, async () => {
    await tapElement(`${resultsScreenSearchBox}.inputClearIcon`)
    await tapElement(searchSuggestionsHits)
    await expectToBeVisible(searchSuggestionsHits)
    await expectToHaveText(suggestionsScreenSearchBox, '')
  })
})

describe('Search results from search box on product screen', () => {
  it('can launch app', async () => {
    await launchApp({ clearAsyncStorage: true })
  })
  it(`can launch product screen from shop top products carousel`, async () => {
    await tapElement('TabBar.Shop')
    await expectToBeVisible('ShopScreen.ScrollView')
    await expectToBeVisibleWhenScrolled('ShopScreen.ShopBestSellers', 'ShopScreen.ScrollView', 500)
    await tapChild('ShopScreen.ShopBestSellers', 'ProductListItem.Image')
    await expectToBeVisible(productScreen)
  })
  it(`can launch the search screen from the product screen`, async () => {
    await tapElement(productScreenSearchBox)
    await waitToExist(suggestionsScreenSearchBox)
  })
  it(`can enter a search term and load the search results screen off that term`, async () => {
    await typeText(suggestionsScreenSearchBox, searchTerm)
    await waitToExist(searchSuggestionsHits)
    await tapChild(searchSuggestionsHits, searchSuggestionHit, 0)
    await expectToBeVisible(searchResultsScreen)
  })
  it(`can open a product screen by tapping on a product from search results`, async () => {
    await tapChild('SearchProducts.Hits', 'ProductListItem.Image')
    await waitToExist(productScreen)
  })
  it(`can return to suggestions screen with cleared search input by tapping on the search box.`, async () => {
    await tapElement(productScreenSearchBox)
    await tapElement(searchSuggestionsHits)
    await expectToBeVisible(searchSuggestionsHits)
    await expectToHaveText(suggestionsScreenSearchBox, '')
  })
})
