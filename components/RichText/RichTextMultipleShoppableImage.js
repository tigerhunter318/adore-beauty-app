import React from 'react'
import RichTextShoppableGroup from './RichTextShoppableGroup'
import Container from '../ui/Container'
import Type from '../ui/Type'
import ResponsiveImage from '../ui/ResponsiveImage'

import theme from '../../constants/theme'
import Layout from '../../constants/Layout'
import { vw } from '../../utils/dimensions'
import CustomWebView from '../ui/CustomWebView'

const styles = {
  title: {
    lineHeight: 30
  },
  description: {
    lineHeight: 21
  },
  WebViewStyle: {
    height: 400,
    width: vw() - 40,
    alignSelf: 'center',
    alignContent: 'center',
    margin: 20
  }
}

const RichTextMultipleShoppableImage = ({ content }) => {
  const { banner, title, description, productsAndGroup } = content

  const hasBannerVideo = banner && banner.toLowerCase().match(/(mp4|mov)$/)
  const hasBannerGif = banner && banner.toLowerCase().match(/(gif)$/)

  const renderBanner = () => {
    if (hasBannerVideo) {
      return (
        <Container center flex>
          <CustomWebView
            source={{
              html: `
              <video width="100%" height="100%" controls style="background-color: ${theme.black}">
                <source src="${banner}" type="video/mp4">
              </video>
              `
            }}
            style={styles.WebViewStyle}
          />
        </Container>
      )
    }

    if (hasBannerGif) {
      return (
        <ResponsiveImage
          src={banner}
          width={vw()}
          height={225}
          useAspectRatio
          styles={{
            container: {
              flexDirection: 'row',
              flex: 1,
              height: Layout.window.width / 2,
              overflow: 'hidden'
            },
            image: {
              width: '100%',
              height: 'auto'
            }
          }}
        />
      )
    }

    return (
      <ResponsiveImage
        src={banner}
        width={vw()}
        height={225}
        useAspectRatio
        styles={{
          container: {
            flexDirection: 'row',
            flex: 1,
            height: Layout.window.width / 2
          }
        }}
      />
    )
  }

  return (
    <Container mt={0}>
      {renderBanner()}
      <Container ph={2} mt={1.5}>
        <Container mt={6} mb={2}>
          <Type size={24} style={styles.title} color={theme.lightBlack} light>
            {title}
          </Type>
        </Container>
        <Container mb={2}>
          <Type size={14} style={styles.description} color={theme.lightBlack}>
            {description}
          </Type>
        </Container>
        <Container>
          {productsAndGroup?.map((item, key) => (
            <Container rows mb={2} key={`keyIndex-${key}`}>
              <Type pt={0.7} size={14} bold style={{ marginRight: 12, textAlign: 'right', width: 20 }}>
                {key + 1}.
              </Type>
              {item.type === 'shoppableGroup' && <RichTextShoppableGroup content={item.content} />}
            </Container>
          ))}
        </Container>
      </Container>
    </Container>
  )
}

export default RichTextMultipleShoppableImage
