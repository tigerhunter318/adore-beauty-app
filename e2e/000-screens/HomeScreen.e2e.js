/* eslint-disable no-undef */
import {
  expectToBeVisible,
  expectToBeVisibleWhenScrolled,
  expectToExist,
  launchApp,
  tapChild,
  tapElement
} from '../helpers'

/**
 * detox test --configuration ios.sim.debug --loglevel verbose e2e/000-screens/HomeScreen.e2e.js
 */
describe('HomeScreen', () => {
  beforeEach(async () => {
    await launchApp()
    await expectToExist('TabBar.Home')
    await tapElement('TabBar.Home')
  })

  it('can see HomeScreen', async () => {
    await expectToBeVisible('HomeScreen')
  })

  it('can tap on PodcastLatestEpisodesWidgetItem and see BeautyIQPodcastEpisodeScreen', async () => {
    const scrollView = 'HomeScreen.ScrollView'
    await expectToBeVisibleWhenScrolled('HomeScreen.PodcastLatestEpisodesWidget', scrollView, 300, 'down', NaN, 0.7, 50)
    await tapChild('HomeScreen.PodcastLatestEpisodesWidget', 'PodcastLatestEpisodesWidget.Container')
    await expectToBeVisible('BeautyIQPodcastEpisodeScreen.Title')
  })
})
