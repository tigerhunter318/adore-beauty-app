import React from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import theme from '../../constants/theme'
import { useSafeInsets } from '../../utils/dimensions'
import ArticleNotFound from '../error/ArticleNotFound'
import RichTextBlocks from '../RichText/RichTextBlocks'
import RichTextContent from '../RichText/RichTextContent'

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.white,
    paddingHorizontal: 20
  },
  image: {
    width: 180,
    height: 200
  }
})

const CMSContent = ({ content, postContent }) => {
  const { bottom } = useSafeInsets()

  if (postContent?.length) {
    return (
      <ScrollView style={styles.container}>
        <RichTextBlocks styles={{ paddingBottom: bottom }} imageProps={styles.image} items={postContent} />
      </ScrollView>
    )
  }

  if (content) {
    return (
      <ScrollView style={styles.container}>
        <RichTextContent imageProps={styles.image} content={content} />
      </ScrollView>
    )
  }

  return <ArticleNotFound />
}

export default CMSContent
