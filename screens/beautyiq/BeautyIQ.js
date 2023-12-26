import React from 'react'
import { StyleSheet } from 'react-native'
import Container from '../../components/ui/Container'
import BeautyIQSubNavigation from '../../components/beautyiq/BeautyIQSubNavigation'
import { useScreenFocusEffect } from '../../hooks/useScreen'
import envConfig from '../../config/envConfig'
import { gaEvents } from '../../services/ga'
import TopLevelCategoryQuery from '../../gql/TopLevelCategoryQuery'
import { smartlook } from '../../services/smartlook'
import useScreenQuery from '../../gql/useScreenQuery'
import { composeModel } from '../../utils/composeModel'
import BeautyIQQuery from '../../gql/BeautyIQQuery'
import ContentLoading from '../../components/ui/ContentLoading'
import theme from '../../constants/theme'
import settings from '../../constants/settings'
import Type from '../../components/ui/Type'
import BeautyIqArticles from '../../components/beautyiq/BeautyIqArticles'
import { isValidArray } from '../../utils/validation'
import { vh } from '../../utils/dimensions'

const styleSheet = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
})

const BeautyIQ = ({ route }) => {
  const { params } = route

  const { data: categoryData, refetch: refetchCategories } = useScreenQuery(TopLevelCategoryQuery, {
    variables: { locale: envConfig.locale }
  })

  let type = 'beautyiq,guide,routines'
  let categorySlug = params?.slug ?? ''
  if (categorySlug.includes('/routines')) {
    categorySlug = categorySlug.replace('/routines', '').replace('c/', '')
    type = 'routines'
  }

  const variables = {
    locale: envConfig.locale,
    rows: 5,
    page: 1,
    categorySlug,
    type,
    model: composeModel()
  }

  const { initialComponent, data, fetchMore, refetch } = useScreenQuery(BeautyIQQuery, {
    variables,
    LoaderComponent: (
      <>
        <ContentLoading type="BeautyIQArticle" height={360} />
        <ContentLoading type="BeautyIQArticle" height={360} />
      </>
    )
  })

  const handleScreenFocused = () => {
    gaEvents.screenView('BeautyIQ', 'BeautyIQ')
    smartlook.trackNavigationEvent('BeautyIQ')
  }

  const articles = isValidArray(data?.beautyiq) ? data.beautyiq : []
  const hasNoResults = articles.length === 0

  useScreenFocusEffect(handleScreenFocused)

  return (
    <Container style={styleSheet.container} testID="BeautyIQScreen">
      <BeautyIQSubNavigation categories={categoryData} categorySlug={categorySlug} />
      {initialComponent || (
        <Container flex={1} background={theme.white}>
          <BeautyIqArticles
            scrollEventThrottle={settings.defaultScrollEventThrottle}
            articles={articles}
            onFetchMore={fetchMore}
            refetch={refetch}
            noTopPadding
            noResults={
              hasNoResults && (
                <Container style={{ height: vh(65) }} justify>
                  <Type size={16} ph={5} center>
                    Sorry, we couldn't find any results for "<Type bold>{categorySlug}</Type>"...
                  </Type>
                </Container>
              )
            }
          />
        </Container>
      )}
    </Container>
  )
}

export default BeautyIQ
