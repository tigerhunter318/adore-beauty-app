import { isValidObject } from '../../../../utils/validation'
import { getIn } from '../../../../utils/getIn'

export const formatContentfulArticle = (article: any) => {
  if (!isValidObject(article)) return null

  return {
    title: getIn(article, 'title'),
    image: getIn(article, 'heroImage.url'),
    facebookImage: getIn(article, 'facebookImage.url'),
    sysId: getIn(article, 'sys.id'),
    author: getIn(article, 'author.name'),
    authorImage: getIn(article, 'author.image.url'),
    publishDate: getIn(article, 'publishDate')
  }
}
export const formatContentfulData = (data: {
  items: any[]
  total?: number | any
}): { articlesResultCount: any; articles: any } => {
  const articles = data?.items?.map((article: {}) => formatContentfulArticle(article)).filter((x: any) => x) || []

  return {
    articlesResultCount: data?.total || 0,
    articles
  }
}
