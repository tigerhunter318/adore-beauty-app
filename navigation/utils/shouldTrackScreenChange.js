const screenViewChangeExclusions = [
  'product',
  'postscreen',
  'productquickview',
  'articles',
  'beautyiqpodcastepisode',
  'beautyiqpodcastprogram'
]

export const shouldTrackScreenChange = (currentRouteName, previousRouteName = '') =>
  previousRouteName !== currentRouteName && !screenViewChangeExclusions.includes(`${currentRouteName}`.toLowerCase())
