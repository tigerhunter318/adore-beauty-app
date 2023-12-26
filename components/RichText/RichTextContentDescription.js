import React from 'react'
import { StyleSheet, View } from 'react-native'
import HTMLView from 'react-native-htmlview'
import DOMSerializer from 'dom-serializer'
import { useNavigation } from '@react-navigation/core'
import Container from '../ui/Container'
import Type from '../ui/Type'
import AdoreSvgIcon from '../ui/AdoreSvgIcon'
import Separator from '../ui/Separator'
import ResponsiveImage from '../ui/ResponsiveImage'
import { vw } from '../../utils/dimensions'
import theme from '../../constants/theme'
import { sanitizeContent } from '../../utils/format'
import useUrlNavigation from '../../navigation/utils/useUrlNavigation'
import CustomWebView from '../ui/CustomWebView'

const htmlStyles = StyleSheet.create({
  p: {
    fontSize: 13,
    lineHeight: 24,
    color: theme.lightBlack,
    letterSpacing: 0.1,
    paddingHorizontal: 20,
    marginBottom: 5
  },
  h1: {
    fontSize: 32,
    lineHeight: 32,
    paddingHorizontal: 20
  },
  h2: {
    fontSize: 28,
    lineHeight: 32,
    paddingHorizontal: 20
  },
  h3: {
    fontSize: 23,
    lineHeight: 24,
    fontWeight: '700',
    paddingHorizontal: 20
  },
  strong: {
    fontWeight: '700'
  },
  a: {
    flex: 1,
    textDecorationLine: 'underline'
  }
})

const insideHtmlStyles = StyleSheet.create({
  p: {
    fontSize: 13,
    lineHeight: 24,
    color: theme.lightBlack,
    letterSpacing: 0.1,
    marginBottom: 16
  },
  h1: {
    fontSize: 32,
    lineHeight: 32
  },
  h2: {
    fontSize: 28,
    lineHeight: 32
  },
  h3: {
    fontSize: 23,
    lineHeight: 24,
    fontWeight: '700'
  },
  strong: {
    fontWeight: '700'
  },
  a: {
    flex: 1,
    textDecorationLine: 'underline'
  },
  hr: {
    borderWidth: 0.5,
    borderColor: theme.borderColor,
    marginVertical: 5
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
  blockquote: {
    letterSpacing: 1.5,
    lineHeight: 28
  }
})

const RichTextContentDescription = ({
  content,
  isNested = false,
  color = theme.lightBlack,
  center = false,
  align = 'justify'
}) => {
  const navigation = useNavigation()
  const urlNavigation = useUrlNavigation()

  const handleProductClick = productId =>
    navigation.push('ProductQuickView', {
      product_id: productId
    })

  const handleLinkClick = href => urlNavigation.push(href)

  const renderNode = (node, index) => {
    if (node.name === 'p' && node.children.length > 0) {
      if (node.children[0].name === 'video') {
        const videoURL = node.children[0].attribs.src
        return (
          <View key={index} style={styles.videoContainer}>
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

      if (
        node.children[1] &&
        node.children[1].name === 'img' &&
        node.children[1].attribs.class === '--hide-above-small'
      ) {
        return (
          <Container mt={2} key={index} ph={2}>
            <ResponsiveImage src={node.children[1].attribs['data-src']} width={vw()} height={270} useAspectRatio />
          </Container>
        )
      }
    }
    if (node.name === 'ul') {
      return node.children.map((item, keyIndex) => (
        <Container rows mb={1.5} ph={2} key={`keyIndex-${keyIndex}`}>
          <Container style={{ marginRight: 12, paddingTop: 5 }}>
            <AdoreSvgIcon name="check-item" width={18} color={theme.darkGray} height={18} />
          </Container>
          <Container flex={1}>
            <HTMLView
              value={DOMSerializer(item.children)}
              addLineBreaks={false}
              stylesheet={insideHtmlStyles}
              renderNode={renderNode}
            />
          </Container>
        </Container>
      ))
    }
    if (node.name === 'ol') {
      return node.children.map((item, keyIndex) => (
        <Container rows mt={1.5} ph={2} key={`keyIndex-${keyIndex}`}>
          <Type
            size={16}
            style={{
              marginRight: 12,
              textAlign: 'right',
              width: 22,
              paddingTop: 5
            }}
          >
            {keyIndex + 1}.
          </Type>
          <HTMLView
            value={DOMSerializer(item.children)}
            addLineBreaks={false}
            stylesheet={insideHtmlStyles}
            renderNode={renderNode}
          />
        </Container>
      ))
    }

    if (node.name === 'a' && node.attribs['data-product-id']) {
      return (
        <Type underline size={16} onPress={() => handleProductClick(node.attribs['data-product-id'])} key={index}>
          {node.children[0].data}
        </Type>
      )
    }

    if (node.name === 'a') {
      if (node.children?.[0]?.name === 'u') {
        return (
          <Type underline size={14} onPress={() => handleLinkClick(node?.attribs?.href)} key={index}>
            {node.children?.[0]?.children?.[0]?.data}
          </Type>
        )
      }

      return (
        <Type underline size={14} onPress={() => handleLinkClick(node?.attribs?.href)} key={index}>
          {node.children[0].data}
        </Type>
      )
    }

    if (node.name === 'u') {
      return (
        <Type underline style={htmlStyles.p}>
          {node.children[0].data}
        </Type>
      )
    }

    if (node.name === 'blockquote') {
      return (
        <Container key={`blockquote-${index}`}>
          <Separator withQuote={false} styles={{ marginTop: 20, marginBottom: 20 }} />
          {node.children.map((item, keyIndex) => (
            <Type
              bold
              center
              size={14}
              key={`blockquote-content-${keyIndex}`}
              style={styles.blockquote}
              color={theme.lightBlack}
            >
              {item.children[0].data}
            </Type>
          ))}
          <Container center>
            <Separator styles={{ marginTop: 15, marginBottom: 30, width: '70%' }} />
          </Container>
        </Container>
      )
    }

    if (node.name === 'hr') {
      return <Container key={`blockquote-${index}`} style={insideHtmlStyles.hr} />
    }

    if (node.data && node.type === 'text') {
      return (
        <Type
          key={`none-tag-content-${index}`}
          style={{
            ...htmlStyles.p,
            paddingHorizontal: 0,
            textAlign: align
          }}
        >
          {node.data}
        </Type>
      )
    }
  }

  const nestedHtmlStyles = StyleSheet.create({
    p: {
      fontSize: 16,
      lineHeight: 24,
      color,
      letterSpacing: 0.1,
      paddingHorizontal: 0,
      textAlign: center ? 'center' : 'left'
    },
    h1: {
      fontSize: 32,
      lineHeight: 32
    },
    h2: {
      fontSize: 28,
      lineHeight: 32
    },
    h3: {
      fontSize: 23,
      lineHeight: 24,
      fontWeight: '700',
      color
    },
    strong: {
      fontWeight: '700'
    },
    a: {
      flex: 1,
      textDecorationLine: 'underline'
    }
  })

  return (
    <Container>
      <HTMLView
        value={sanitizeContent(content)}
        addLineBreaks={false}
        stylesheet={isNested ? nestedHtmlStyles : htmlStyles}
        renderNode={renderNode}
      />
    </Container>
  )
}

export default RichTextContentDescription
