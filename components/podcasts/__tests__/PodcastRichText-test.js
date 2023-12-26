import React from 'react'
import renderer from 'react-test-renderer'
import theme from '../../../constants/theme'
import PodcastRichText from '../PodcastRichText'

/* eslint-disable global-require */

jest.mock('../PodcastPlayerContext.tsx', () => ({
  usePodcastPlayerContext: () => ({})
}))

it(`PodcastRichText renders for a program`, () => {
  const mockProgram = require('./__mocks__/beauty-iq-uncensored.json')
  const { DescriptionHtml: content } = mockProgram || {}
  const tree = renderer.create(<PodcastRichText ignoreLinks content={content} color={theme.lightBlack} />).toJSON()

  expect(tree).toMatchSnapshot()
})

it(`PodcastRichText renders for an episode`, () => {
  const mockEpisode = require('./__mocks__/ep-135-everything-you-need-to-know-about-rosacea.json')
  const { content } = mockEpisode
  const tree = renderer
    .create(<PodcastRichText content={content} color={theme.black} styleProps={{ p: { color: theme.lightBlack } }} />)
    .toJSON()

  expect(tree).toMatchSnapshot()
})
