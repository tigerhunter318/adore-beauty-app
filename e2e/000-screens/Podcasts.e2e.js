/* eslint-disable no-undef */
import { expectToBeVisible, expectToExist, launchApp, tapChild, tapElement } from '../helpers'

/**
 * detox test --configuration ios.sim.debug --loglevel verbose e2e/000-screens/Podcasts.e2e.js
 *
 */

describe('Podcasts', () => {
  beforeEach(async () => {
    await launchApp()
    await expectToExist('TabBar.BeautyIQ')
    await tapElement('TabBar.BeautyIQ')
  })

  it('can see BeautyIQPodcastsScreen', async () => {
    await expectToBeVisible('BeautyIQTabBar.Podcasts')
    await tapElement('BeautyIQTabBar.Podcasts')
    await expectToBeVisible('BeautyIQPodcastsScreen')
  })
  // TODO fix timeout issues below with RN68
  /*
   Podcasts › can tap on Program and see BeautyIQPodcastProgram
    thrown: "Exceeded timeout of 180000 ms for a test.
    Use jest.setTimeout(newTimeout) to increase the timeout value, if this is a long-running test."
      29 [REDACTED]   })
      30 [REDACTED]
    > 31 [REDACTED]   it('can tap on Program and see BeautyIQPodcastProgram', async () => {
         [REDACTED]   ^
      32 [REDACTED]     await expectToBeVisible('BeautyIQTabBar.Podcasts')
      33 [REDACTED]     await tapElement('BeautyIQTabBar.Podcasts')
      34 [REDACTED]     await expectToBeVisible('BeautyIQPodcastsScreen.BeautyIQPodcastsList')
      at 000-screens/Podcasts.e2e.js:31:3
      at Object.<anonymous> (000-screens/Podcasts.e2e.js:9:1)
   */

  /*
  it('can tap on Episode and see BeautyIQPodcastEpisodeScreen', async () => {
    await expectToBeVisible('BeautyIQTabBar.Podcasts')
    await tapElement('BeautyIQTabBar.Podcasts')
    await expectToBeVisible('BeautyIQPodcastsScreen')
    await element(by.id('PodcastEpisodesList')).scroll(400, 'down', NaN, 0.5)
    await tapChild('PodcastEpisodesList', 'PodcastEpisodesListItem', 0)
    await expectToBeVisible('BeautyIQPodcastEpisodeScreen.Title')
  })

  it('can tap on Program and see BeautyIQPodcastProgram', async () => {
    await expectToBeVisible('BeautyIQTabBar.Podcasts')
    await tapElement('BeautyIQTabBar.Podcasts')
    await expectToBeVisible('BeautyIQPodcastsScreen.BeautyIQPodcastsList')
    await tapChild('BeautyIQPodcastsScreen.BeautyIQPodcastsList', 'BeautyIQPodcastsListItem', 0)
    await expectToBeVisible('BeautyIQPodcastProgram')
  })

   */
})
