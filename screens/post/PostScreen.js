import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { share } from '../../utils/share'
import { formatPagePath } from '../../utils/format'
import { createDynamicLink } from '../../services/branch/createDynamicLink'
import { useScreenFocusEffect } from '../../hooks/useScreen'
import { gaEvents } from '../../services/ga'
import { emarsysEvents } from '../../services/emarsys/emarsysEvents'
import { appReview } from '../../services/appReview'
import { useActionState } from '../../store/utils/stateHook'
import { isValidArray, isValidObject } from '../../utils/validation'
import { useSafeInsets, vh } from '../../utils/dimensions'
import Container from '../../components/ui/Container'
import ShareButton from '../../components/ui/ShareButton'
import ConsentForm from '../../components/consent/ConsentForm'
import theme from '../../constants/theme'
import useScrollDirection from '../../hooks/useScrollDirection'
import ArticleNotFound from '../../components/error/ArticleNotFound'
import ContentLoading from '../../components/ui/ContentLoading'
import BeautyIqArticleScreenContent from '../../components/beautyiq/BeautyIqArticleScreenContent'
import branchEvents from '../../services/branch/branchEvents'
import AnimatedBar from '../../components/ui/AnimatedBar'
import { ContentPageType, useContentPageQuery } from '../../gql/useContentPageQuery'
import useScreenQuery from '../../gql/useScreenQuery'
import { useScreenRouter } from '../../navigation/router/screenRouter'

const styles = StyleSheet.create({
  loadingContainer: {
    backgroundColor: theme.white,
    alignItems: 'center'
  },
  footerBar: {
    position: 'absolute',
    left: 0,
    bottom: -2,
    width: '100%'
  },
  shareButton: {
    position: 'absolute',
    zIndex: 10,
    right: 20.2
  }
})

const PostScreen = ({ navigation, route }) => {
  const [shareButtonStyle, setShareButtonStyle] = useState(null)
  const { handleScroll, direction } = useScrollDirection()
  const { bottom: safeBottomInset } = useSafeInsets()
  const isConsentGiven = useActionState('customer.isConsentGiven')
  const isVisible = direction ? direction !== 'down' : true
  const { getCurrentScreenPath } = useScreenRouter()

  const { loading, data, refetch, initialComponent } = useScreenQuery(ContentPageType.article, {
    useQueryHook: useContentPageQuery,
    variables: route.params,
    LoaderComponent: (
      <Container style={styles.loadingContainer}>
        <ContentLoading type="Post" height={vh(100)} />
      </Container>
    )
  })

  const richContent = data?.richContent?.[0]
  const articleData = richContent || {}
  const {
    isConsentNeeded,
    name,
    products,
    content_heading: contentHeading,
    top_heading: topHeading,
    author_name: authorName,
    author_avatar: authorUrl,
    sysId: articleSysId,
    url: articleUrl
  } = articleData
  const title = name || contentHeading || topHeading

  const handleShopArticleClick = () => {
    navigation.push('ArticleShopProducts', {
      data: products,
      title,
      authorName,
      authorUrl,
      parentScreenPath: getCurrentScreenPath()
    })
  }

  const handleSharePostPress = async () => {
    if (articleSysId) {
      const linkUrl = formatPagePath(articleUrl)
      const postDynamicLink = await createDynamicLink(linkUrl, {
        pageType: 'post',
        id: articleSysId
      })
      share('article', articleSysId, postDynamicLink)
    }
  }

  const handleAvatarContainerLayout = event => setShareButtonStyle({ top: event.nativeEvent.layout.y + 6 })

  const handleRelatedArticlePress = relatedItemSysId => {
    navigation.push('PostScreen', { sysId: relatedItemSysId })
  }

  const handleEmarsysScreenTracking = () =>
    emarsysEvents.trackScreen('BeautyIQ', articleData?.identifier, articleData?.type, articleData?.category_name)

  const handleLoadingChange = () => {
    if (!loading && richContent) {
      gaEvents.logContentView(richContent)
      gaEvents.screenView('BeautyIQ', richContent?.name)
      branchEvents.trackViewPost(richContent)

      if (!isConsentNeeded || isConsentGiven) {
        handleEmarsysScreenTracking()
      }
    }
  }

  useEffect(() => {
    appReview.rateAppFromArticle(articleSysId)
  }, [articleSysId])

  useScreenFocusEffect(handleLoadingChange, [loading, articleData])

  if (initialComponent) {
    return initialComponent
  }

  if (data && !isValidObject(articleData)) {
    return <ArticleNotFound data={route.params} navigation={navigation} />
  }

  if (isConsentNeeded && !isConsentGiven) {
    return <ConsentForm onAgree={handleEmarsysScreenTracking} />
  }
  return (
    <Container>
      <BeautyIqArticleScreenContent
        title={title}
        articleData={articleData}
        onScroll={handleScroll}
        onAvatarContainerLayout={handleAvatarContainerLayout}
        onRelatedArticlePress={handleRelatedArticlePress}
        refetch={refetch}
        testID="PostScreen"
      />
      {isValidArray(products) && (
        <Container style={[styles.footerBar]}>
          <AnimatedBar
            isVisible={isVisible}
            title={`Shop This Article (${products.length})`}
            onPress={handleShopArticleClick}
            contentHeight={safeBottomInset + 56}
          />
        </Container>
      )}
      {shareButtonStyle && (
        <ShareButton
          isVisible={isVisible}
          style={[styles.shareButton, shareButtonStyle]}
          onPress={handleSharePostPress}
        />
      )}
    </Container>
  )
}

export default PostScreen
