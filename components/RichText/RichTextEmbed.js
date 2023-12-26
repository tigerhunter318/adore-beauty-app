import React from 'react'
import { StyleSheet, View } from 'react-native'
import HTMLView from 'react-native-htmlview'
import DOMSerializer from 'dom-serializer'
import Container from '../ui/Container'
import EmbedWebView from '../ui/EmbedWebView'
import Type from '../ui/Type'
import Icon from '../ui/Icon'
import theme from '../../constants/theme'
import { vw } from '../../utils/dimensions'
import { getIn } from '../../utils/getIn'
import PodcastRichTextWidget from '../podcasts/PodcastRichTextWidget'
import CustomWebView from '../ui/CustomWebView'
import { sanitizeContent } from '../../utils/format'

const htmlStyles = StyleSheet.create({
  p: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.lightBlack,
    letterSpacing: 0.1
  },
  h2: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 10
  },
  h3: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '700',
    color: theme.lightBlack
  },
  strong: {
    fontWeight: '700'
  },
  a: {
    flex: 1,
    textDecorationLine: 'underline'
  }
})

const styles = StyleSheet.create({
  videoContainer: {
    flex: 1,
    alignContent: 'center'
  },
  WebViewStyle: {
    height: 400,
    width: 300,
    alignSelf: 'center',
    alignContent: 'center',
    margin: 20
  },
  tiktokWebViewStyle: {
    height: 583,
    width: 'auto',
    marginTop: 40
  },
  blockquote: {
    letterSpacing: 1.5,
    lineHeight: 28
  }
})

const RichTextEmbedVideo = ({ node }) => {
  const videoURL = node?.children?.[0]?.attribs?.src

  if (!videoURL) return null

  return (
    <View style={styles.videoContainer}>
      <CustomWebView
        source={{
          html: `
        <video width="100%" height="100%" controls style="background-color: ${theme.black}">
          <source src="${videoURL}" type="video/mp4">
        </video>
        `
        }}
        style={styles.WebViewStyle}
      />
    </View>
  )
}

const RichTextEmbedTikTokVideo = ({ node }) => {
  const uri = getIn(node, 'attribs.cite')

  if (!uri) return null

  return (
    <Container mb={3}>
      <CustomWebView
        scrollEnabled={false}
        source={{ uri }}
        style={styles.tiktokWebViewStyle}
        mediaPlaybackRequiresUserAction
      />
    </Container>
  )
}

const RichTextEmbedBlockQuote = ({ node }) => (
  <Container>
    {node?.children?.map((item, keyIndex) => {
      if (!item?.children?.[0]?.data?.trim()) return null

      return (
        <Type bold size={23} center heading key={`blockquote-content-${keyIndex}`} style={styles.blockquote}>
          {item.children[0].data}
        </Type>
      )
    })}
  </Container>
)

export const RichTextEmbedWebview = ({ node, height }) => {
  const w = getIn(node, 'attribs.width')
  const h = getIn(node, 'attribs.height')
  let html = DOMSerializer(node)
  let viewHeight

  if (getIn(node, 'attribs.class') === 'instagram-media') {
    const instagramNode = {
      ...node,
      attribs: {
        ...node.attribs,
        style: `${node.attribs?.style}; max-width:100% !important; min-width:auto !important;`
      }
    }
    html = DOMSerializer(instagramNode)
  }
  if (w) {
    html = html.replace(w, '100%')
  }
  if (h) {
    viewHeight = parseInt(h.toString())
    const ratio = (vw() - 20) / w
    viewHeight = parseInt(viewHeight * ratio)
    html = html.replace(h, viewHeight)
  }

  return (
    <Container mb={2}>
      <EmbedWebView html={html} height={height || viewHeight} />
    </Container>
  )
}
const RichTextEmbedOrderedListItem = ({ item, keyIndex }) => (
  <Container ph={2} rows mt={1.5}>
    <Type size={16} style={{ marginRight: 12, textAlign: 'right', width: 22 }}>
      {keyIndex + 1}.
    </Type>
    <Type size={16}>{item.children[0].children[0].data}</Type>
  </Container>
)
const RichTextEmbedListItem = ({ item }) => (
  <Container ph={2} rows mt={1.5}>
    <Icon type="adore" name="check-item" size={18} color={theme.darkGray} style={{ marginRight: 12 }} />
    <Type size={16}>{item.children[0].children[0].data}</Type>
  </Container>
)

const NodeComponent = ({ node, nodeIndex }) => {
  const { name, children, attribs } = node

  if (name === 'p') {
    if (children?.length > 0 && children?.[0]?.name === 'video') {
      return <RichTextEmbedVideo node={node} />
    }
  }
  if (name === 'ul') {
    return children?.map((item, keyIndex) => <RichTextEmbedListItem item={item} key={`li-${nodeIndex}-${keyIndex}`} />)
  }
  if (name === 'ol') {
    return children?.map((item, keyIndex) => (
      <RichTextEmbedOrderedListItem item={item} keyIndex={keyIndex} key={`ol-${nodeIndex}-${keyIndex}`} />
    ))
  }

  if (name === 'blockquote') {
    if (attribs?.class === 'instagram-media') {
      return <RichTextEmbedWebview node={node} />
    }

    if (attribs?.class === 'tiktok-embed') {
      return <RichTextEmbedTikTokVideo node={node} />
    }

    return <RichTextEmbedBlockQuote node={node} />
  }

  if (name === 'a') {
    if (attribs?.class === 'embedly-card') {
      let height

      if (attribs?.href?.includes('omny.fm')) {
        height = 220
        return <PodcastRichTextWidget url={attribs.href} />
      }
      if (attribs?.href?.includes('media.giphy.com')) {
        height = 300
      } else {
        height = 500
      }
      return <RichTextEmbedWebview node={node} height={height} />
    }
  }

  if (name === 'iframe' || children?.[0]?.name === 'iframe') {
    if (attribs?.src?.includes('omny.fm')) {
      return (
        <Container pt={2}>
          <PodcastRichTextWidget url={attribs.src} />
        </Container>
      )
    }

    return <RichTextEmbedWebview node={node} />
  }

  return null
}

const RichTextEmbed = ({ content }) => {
  const renderNode = (node, index, siblings, parent, defaultRenderer) => {
    try {
      return <NodeComponent node={node} key={`${node && node.name}-${index}`} nodeIndex={index} />
    } catch (error) {
      console.warn('RichTextEmbed', 'renderNode', error)
    }
  }

  return (
    <Container>
      <HTMLView
        value={sanitizeContent(content.externalEmbed)}
        addLineBreaks={false}
        stylesheet={htmlStyles}
        renderNode={renderNode}
      />
    </Container>
  )
}

export default RichTextEmbed
