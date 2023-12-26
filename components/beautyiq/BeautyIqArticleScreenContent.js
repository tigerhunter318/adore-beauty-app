import React, { useEffect } from 'react'
import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import Container from '../ui/Container'
import Avatar from '../ui/Avatar'
import Type from '../ui/Type'
import ArticleCard from '../article/ArticleCard'
import RichTextBlocks from '../RichText/RichTextBlocks'
import RichTextContent from '../RichText/RichTextContent'
import theme from '../../constants/theme'
import { formatDate } from '../../utils/date'
import settings from '../../constants/settings'
import { ViewportProvider } from '../viewport/ViewportContext'
import { isValidArray } from '../../utils/validation'
import useRefreshControl from '../../hooks/useRefreshControl'

const styles = StyleSheet.create({
  contentContainer: {
    padding: 0,
    paddingBottom: 20,
    backgroundColor: theme.white
  },
  title: {
    paddingTop: 20,
    paddingHorizontal: 30,
    textAlign: 'center',
    fontSize: 25,
    lineHeight: 34,
    letterSpacing: 0.5,
    color: theme.lightBlack
  },
  subTitle: {
    paddingTop: 20,
    paddingHorizontal: 30,
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 23,
    letterSpacing: 0.3
  },
  avatarContainer: {
    marginLeft: 10,
    paddingTop: 20,
    paddingHorizontal: 10,
    flex: 1
  },
  similarContainer: {
    backgroundColor: theme.black,
    paddingHorizontal: 42,
    paddingVertical: 25,
    marginTop: 20,
    marginBottom: 30
  },
  similar: {
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 34,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: theme.white
  }
})

const PostScreenRelatedArticles = ({ related, onRelatedArticlePress }) => (
  <Container>
    <Container style={styles.similarContainer}>
      <Type bold style={styles.similar}>
        Similar
      </Type>
    </Container>
    <Container>
      {related.map(item => (
        <TouchableOpacity key={item.sysId} onPress={() => onRelatedArticlePress(item.sysId)}>
          <ArticleCard
            {...item}
            image={item.feature_image}
            title={item.name}
            containerProps={{ pb: 2, ph: 2 }}
            imageHeight="auto"
          />
        </TouchableOpacity>
      ))}
    </Container>
  </Container>
)

const BeautyIqArticleScreenContent = ({
  articleData,
  onScroll,
  onAvatarContainerLayout,
  onRelatedArticlePress,
  title,
  refetch = () => {},
  testID
}) => {
  const {
    postContent,
    content,
    related,
    isConsentNeeded,
    products,
    author_name: authorName,
    author_avatar: authorUrl,
    subTitle,
    publishDate
  } = articleData

  const { refreshControl } = useRefreshControl(refetch)

  return (
    <ViewportProvider lazyLoadImage>
      <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={settings.defaultScrollEventThrottle}
        contentContainerStyle={[styles.contentContainer]}
        refreshControl={refreshControl}
        testID={testID}
      >
        <Type bold style={styles.title} testID={`${testID}.Title`}>
          {title}
        </Type>
        <Type style={styles.subTitle}>{subTitle}</Type>
        <Container style={styles.avatarContainer} onLayout={onAvatarContainerLayout}>
          <Avatar name={authorName} url={authorUrl} publishDate={formatDate(publishDate)} />
        </Container>
        <Container mt={2} gutter>
          {isValidArray(postContent) ? (
            <RichTextBlocks items={postContent} products={products} isConsentNeeded={isConsentNeeded} />
          ) : (
            <RichTextContent content={content} />
          )}
        </Container>
        {isValidArray(related) && (
          <PostScreenRelatedArticles related={related} onRelatedArticlePress={onRelatedArticlePress} />
        )}
      </ScrollView>
    </ViewportProvider>
  )
}

export default BeautyIqArticleScreenContent
