import React from 'react'
import ArticleShopProducts from '../../components/article/ArticleShopProducts'

const ArticleShopProductsScreen = ({ route }) => {
  const { data, title, authorName, authorUrl } = route.params
  return <ArticleShopProducts title={title} data={data} authorName={authorName} authorUrl={authorUrl} />
}

export default ArticleShopProductsScreen
