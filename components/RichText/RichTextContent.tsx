import React, { useState } from 'react'
import { StyleSheet, View, Image } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import HTMLView from 'react-native-htmlview'
import DOMSerializer from 'dom-serializer'
import { SvgCssUri } from 'react-native-svg'
import { StackNavigationProp } from '@react-navigation/stack'
import Container from '../ui/Container'
import Type from '../ui/Type'
import AdoreSvgIcon from '../ui/AdoreSvgIcon'
import Separator from '../ui/Separator'
import ResponsiveImage from '../ui/ResponsiveImage'
import theme from '../../constants/theme'
import { formatExternalUrl, replaceHtmlTags, sanitizeContent, formatPagePath } from '../../utils/format'
import useUrlNavigation from '../../navigation/utils/useUrlNavigation'
import { vw } from '../../utils/dimensions'
import openInAppBrowser from '../../utils/openInAppBrowser'
import CustomWebView from '../ui/CustomWebView'
import RichTextHTag from './RichTextHTag'
import { findNestedNodeByPropertyKey, findNestedNodeByPropertyValue, findNodeLinkDetails } from './utils/helpers'
import ImageZoomModal from '../product-detail/ImageZoomModal'
import { ViewportProvider } from '../viewport/ViewportContext'
import RichTextPTag from './RichTextPTag'
import RichTextATag from './RichTextATag'
import { fontStyles } from '../../constants/fontStyles'
import CustomButton from '../ui/CustomButton'

const htmlStyles = StyleSheet.create({
  p: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.lightBlack,
    letterSpacing: 0.3,
    marginBottom: 16,
    marginTop: 10
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
    fontSize: 16,
    lineHeight: 24,
    color: theme.lightBlack,
    letterSpacing: 0.3,
    marginBottom: 16
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
  },
  svgContainer: {},
  imageContainer: {
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20
  }
})

type TableProps = { tbody: any; renderNode: any }

const Table = ({ tbody, renderNode }: TableProps) => (
  <>
    {tbody?.map(({ children: tr }: any, index: any) => (
      <Container ph={2} rows width={vw(100)} key={`tbody-${index}`}>
        {tr?.map(({ children: td }: any, i: number) => {
          const background = tr[0]?.attribs?.style
            ?.split(';')
            ?.filter((x: string | string[]) => x.includes('background-color'))
            ?.join('')
            ?.split(':')?.[1]
            ?.trim()

          let width = i === 0 ? '40%' : '60%'

          if (tr.length > 2) {
            width = `${100 / tr.length}%`
          }

          return (
            <Container
              center
              justify="center"
              ph={1}
              pv={1}
              key={`tr-${index}`}
              style={[
                {
                  width,
                  backgroundColor: i === 0 ? background : 'white'
                }
              ]}
            >
              <HTMLView
                value={DOMSerializer(td)}
                addLineBreaks={false}
                stylesheet={insideHtmlStyles}
                renderNode={renderNode}
              />
            </Container>
          )
        })}
      </Container>
    ))}
  </>
)

type RichTextContentProps = {
  content: string
  isNested?: boolean
  color?: string
  center?: boolean
  imageProps?: {} | any
  svgProps?: {} | any
  olIcon?: any
  styleProps?: {} | any
  htmlStyleSheet?: {} | any
  imageContainerStyle?: {} | any
  svgContainerStyle?: {} | any
  replaceTags?: [] | any
  onRedirectSuccess?: (url: string) => void
  canResolveLinks?: boolean
  debug?: any
}

const RichTextContent = ({
  content,
  isNested = false,
  color = theme.lightBlack,
  center = false,
  imageProps = { width: 700, height: 600 },
  svgProps = { width: vw(90), height: 220 },
  olIcon = null,
  styleProps = {},
  htmlStyleSheet,
  imageContainerStyle,
  svgContainerStyle,
  replaceTags = [],
  onRedirectSuccess,
  canResolveLinks = true,
  debug,
  ...rest
}: RichTextContentProps) => {
  const [imageZoom, setImageZoom] = useState({ component: null, props: {} })
  const navigation = useNavigation<StackNavigationProp<any>>()
  const urlNavigation = useUrlNavigation()

  const handleProductPress = (productId: any) => {
    navigation.push('ProductQuickView', {
      product_id: productId
    })
  }

  const handleRedirect = async (url: string) => {
    if (formatPagePath(url) === 'beautyiq/') {
      navigation.navigate('BeautyIQ')
    } else if (onRedirectSuccess) {
      onRedirectSuccess(url)
    } else if (canResolveLinks) {
      await urlNavigation.push(url)
    } else {
      await openInAppBrowser(formatExternalUrl(url))
    }
  }

  const handleModalClose = () => setImageZoom({ component: null, props: {} })

  const renderNode = (
    node: { prev?: any; next?: any; name?: any; children?: any; type?: any; data?: any },
    index: any
  ) => {
    if (!node) return

    const { name, children, type, data } = node

    // Added for MOB-810 / MOB-864 - Returns
    if (name === 'p' && children?.[0]?.children?.[0]?.attribs?.id === 'wufoo-s1k1d4wc0bbmdmd') {
      return (
        <CustomButton
          key={`${name}-${index}`}
          onPress={() => handleRedirect('https://adorebeauty.wufoo.com/forms/s1k1d4wc0bbmdmd')}
          pv={1.5}
          background={theme.white}
          borderColor={theme.black}
          borderWidth={0.5}
        >
          <Type heading color={theme.black} center>
            Submit Returns Form
          </Type>
        </CustomButton>
      )
    }

    if (data === 'undefined') return null

    // H1 | H2 | H3 | H4 | H5
    if ([...Array(6).keys()].some(tag => name === `h${tag}`)) {
      return (
        <RichTextHTag
          key={`${name}-${index}`}
          name={name}
          node={node}
          isNested={isNested}
          styleProps={styleProps}
          onLinkPress={handleRedirect}
          onProductPress={handleProductPress}
        />
      )
    }

    if (type === 'text' && data?.trim().length > 0) {
      return (
        <RichTextPTag
          key={`none-tag-content-${index}`}
          node={node}
          content={data}
          color={color}
          center={center}
          onRedirect={handleRedirect}
          onProductPress={handleProductPress}
          styleProps={styleProps}
        />
      )
    }

    if (name === 'ul' || children?.[0]?.name === 'ul') {
      let listData = children

      if (name !== 'ul') {
        listData = children?.[0]?.children
      }

      return (
        <Container pv={1} key={`ul-${index}`}>
          {listData?.map((item: { children: { children: any }[] }, keyIndex: any) => {
            const childrenData = item.children?.[0]?.children || item?.children

            return (
              <Container rows mb={1} pv={0.5} ph={2} key={`keyIndex-${keyIndex}`}>
                <Container style={{ top: 8, position: 'absolute' }}>
                  <AdoreSvgIcon name="check-item" width={18} color={theme.darkGray} height={18} />
                </Container>
                <Container ml={1} flex={1}>
                  <RichTextPTag
                    node={childrenData}
                    color={color}
                    center={center}
                    onRedirect={handleRedirect}
                    onProductPress={handleProductPress}
                    styleProps={styleProps}
                    content={undefined}
                  />
                </Container>
              </Container>
            )
          })}
        </Container>
      )
    }

    if (name === 'ol' || children?.[0]?.name === 'ol') {
      let listData = children

      if (name !== 'ol') {
        listData = children?.[0]?.children
      }

      return listData?.map((item: { children: {} | {}[] }, keyIndex: number) => (
        <Container rows mt={1.5} ph={2} key={`keyIndex-${keyIndex}`}>
          {olIcon ? (
            <Container style={{ marginRight: 12, paddingTop: 15 }}>
              <AdoreSvgIcon name={olIcon} width={18} height={18} />
            </Container>
          ) : (
            <Type
              size={16}
              style={{
                marginRight: 12,
                textAlign: 'right',
                width: 22,
                paddingTop: 5
              }}
              key={`ol-${index}-${keyIndex}`}
            >
              {keyIndex + 1}.
            </Type>
          )}
          <HTMLView
            value={DOMSerializer(item.children)}
            addLineBreaks={false}
            stylesheet={insideHtmlStyles}
            renderNode={renderNode}
          />
        </Container>
      ))
    }

    if (name === 'blockquote') {
      return (
        <Container key={`blockquote-${index}`}>
          <Separator withQuote={false} styles={{ marginTop: 20, marginBottom: 20 }} />
          {children?.map((item: { children: { data: any }[] }, keyIndex: any) => (
            <Type
              bold
              center
              size={14}
              key={`blockquote-content-${keyIndex}`}
              style={styles.blockquote}
              color={theme.lightBlack}
            >
              {item.children?.[0]?.data}
            </Type>
          ))}
          <Container center>
            <Separator styles={{ marginTop: 15, marginBottom: 30, width: '70%' }} />
          </Container>
        </Container>
      )
    }

    if (name === 'a' || children?.[0]?.name === 'a') {
      const nodeData = name === 'a' ? node : children[0]
      const linkDetails = findNodeLinkDetails(node)

      if (linkDetails?.hasLink && linkDetails.linkTitle) {
        return (
          <RichTextATag
            key={`a-${index}`}
            node={nodeData}
            onRedirect={handleRedirect}
            onProductPress={handleProductPress}
            styleProps={styleProps}
            {...linkDetails}
          />
        )
      }
    }

    if (name === 'strong') {
      const strongText = findNestedNodeByPropertyKey(node, 'data')

      if (strongText) {
        return (
          <Type mb={4} key={`strong-${index}`} style={[htmlStyles.strong, styleProps?.strong?.style, fontStyles.p]}>
            {node?.prev && ' '}
            <Type bold>{strongText}</Type>
            {node?.next && ' '}
          </Type>
        )
      }
    }

    if (name === 'em') {
      const emText = findNestedNodeByPropertyKey(node, 'data')
      const isBold = !!findNestedNodeByPropertyValue(node, 'name', 'strong')

      if (emText) {
        return (
          <Type italic bold={isBold} key={`em-${index}`} style={[styleProps?.em?.style, fontStyles.p]}>
            &nbsp;{`${emText}`.trim()}&nbsp;
          </Type>
        )
      }
    }

    if (name === 'p' && children?.[0]?.name === 'table') {
      if (children?.[0]?.children?.[0]?.name === 'tbody') {
        const tbody = children?.[0]?.children?.[0]?.children
        return <Table key={`table-${index}`} tbody={tbody} renderNode={renderNode} />
      }
    }

    if (name === 'table') {
      if (children?.[0]?.name === 'tbody') {
        const tbody = children?.[0]?.children
        return <Table key={`table-body-${index}`} tbody={tbody} renderNode={renderNode} />
      }
    }

    if (name === 'p' && children?.length > 0) {
      if (children?.[0]?.name === 'em') {
        return (
          <Type italic key={`em-${index}`} pv={1} style={[fontStyles.p, styleProps?.em?.style]}>
            {children?.[0]?.children?.[0]?.data}
          </Type>
        )
      }

      if (children?.[0]?.name === 'video') {
        const videoURL = children?.[0]?.attribs.src
        return (
          <View key={`video-${index}`} style={styles.videoContainer}>
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

      if (children?.[1]?.name === 'img') {
        let url = ''

        if (children[1].attribs.class === '--show-above-small') {
          url = children[1].attribs.src
        }

        if (children[1].attribs.class === '--hide-above-small') {
          url = children[1].attribs['data-src']
        }

        const isSVG = /.svg\b/.test(url)

        if (isSVG) {
          const uri = formatExternalUrl(url, true)

          return (
            <Container center justify style={[styles.svgContainer, svgContainerStyle]} key={`svg-${index}`}>
              <SvgCssUri fill="currentColor" uri={uri} {...svgProps} />
            </Container>
          )
        }

        const isAdoreSocietyImage = /loyalty/gi.test(url)

        const handleImagePress = () => {
          if (isAdoreSocietyImage) return null

          Image.getSize(url, (width, height) => {
            const imageHeight = (vw(100) / width) * height
            setImageZoom({
              // @ts-ignore
              component: (
                <ViewportProvider lazyLoadImage={false} debugImage={undefined}>
                  <ResponsiveImage src={url} width={vw(100)} height="auto" />
                </ViewportProvider>
              ),
              props: {
                imageHeight
              }
            })
          })
        }

        if (url) {
          return (
            <Container
              key={`image-${index}`}
              style={[styles.imageContainer, imageContainerStyle]}
              onPress={handleImagePress}
              center
            >
              <ResponsiveImage src={url} width={vw(90)} height="auto" />
              <Container
                onPress={handleImagePress}
                style={{
                  position: 'absolute',
                  bottom: 10,
                  right: 5
                }}
              >
                {!isAdoreSocietyImage && (
                  <AdoreSvgIcon name="ZoomIn" width={38} height={24} color={theme.black60} align />
                )}
              </Container>
            </Container>
          )
        }
      }
    }

    if (name === 'hr') {
      return <Container key={`hr-${index}`} style={insideHtmlStyles.hr} />
    }

    if (name === 'div' && !!children?.length) {
      return (
        <HTMLView
          value={DOMSerializer(children)}
          addLineBreaks={false}
          stylesheet={insideHtmlStyles}
          renderNode={renderNode}
        />
      )
    }

    const textChildren = children?.filter(
      (item: { type: string; name: string }) => item.type === 'text' || item.name === 'strong'
    )

    if (!textChildren?.length) {
      return null // prevent rendering of empty <Text> tags
    }
  }

  let stylesheet = htmlStyles

  if (isNested) {
    const nestedHtmlStyles = StyleSheet.create({
      p: {
        fontSize: 16,
        lineHeight: 24,
        color,
        letterSpacing: 0.3,
        paddingHorizontal: 0,
        textAlign: center ? 'center' : 'left'
      },
      strong: {
        fontWeight: '700'
      },
      a: {
        flex: 1,
        textDecorationLine: 'underline'
      }
    })
    // @ts-ignore
    stylesheet = nestedHtmlStyles
  } else if (htmlStyleSheet) {
    stylesheet = StyleSheet.flatten(StyleSheet.compose(htmlStyles, htmlStyleSheet))
  }

  const html = replaceHtmlTags(sanitizeContent(content), replaceTags)

  return (
    <Container>
      <HTMLView value={html} addLineBreaks={false} stylesheet={stylesheet} renderNode={renderNode} {...rest} />
      <ImageZoomModal
        imageZoomComponent={imageZoom.component}
        onClose={handleModalClose}
        {...imageZoom.props}
        paddingTop={0}
      />
    </Container>
  )
}

export default RichTextContent
