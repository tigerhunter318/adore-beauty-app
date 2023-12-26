import { formatFromJson } from '../../../../utils/format'
/* eslint-disable global-require */
const articles = {
  'alterna-air-dry-balm-review': require('./alterna-air-dry-balm-review.json'),
  'what-is-a-serum': require('./what-is-a-serum.json')
}

export const getArticleContent = (indexOrType = 0, name = 'alterna-air-dry-balm-review') => {
  const data = articles[name]
  let content = data.postContent[indexOrType]?.content
  if (!content) {
    content = data.postContent.find(item => item.type === indexOrType)?.content
  }
  return formatFromJson(content)
}
