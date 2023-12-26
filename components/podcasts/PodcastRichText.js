import React, { useState } from 'react'
import HTMLView from 'react-native-htmlview'
import { StyleSheet } from 'react-native'
import Container from '../ui/Container'
import Type from '../ui/Type'
import theme from '../../constants/theme'
import { sanitizeContent, trimHtmlSpaces } from '../../utils/format'
import { usePodcastPlayerContext } from './PodcastPlayerContext'
import { navigateUrlToScreen } from '../../navigation/utils/useUrlNavigation'
import resolveUrlToContent from '../../navigation/utils/resolveUrlToContent'
import { urlRegex } from '../../utils/validation'
import LoadingOverlay from '../ui/LoadingOverlay'

const styles = StyleSheet.create({
  p: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.lightBlack,
    letterSpacing: 0.1,
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 10
  },
  a: {
    textDecorationLine: 'underline'
  }
})

const PodcastRichText = ({
  content,
  color = theme.white,
  center = false,
  hasBoldLinks = false,
  styleProps = {},
  isModalScreen = false,
  ignoreLinks = false,
  ...rest
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const { bottomSheetRef, navigation, minimizePlayer } = usePodcastPlayerContext()

  const handleAudioPlayerMinimize = () => {
    if (bottomSheetRef?.current?.isOpen) {
      minimizePlayer()
    }
  }

  const handleRedirect = async url => {
    setIsLoading(true)

    if (isModalScreen) {
      handleAudioPlayerMinimize()
    }

    // TODO: Resolve navigation issue with CMS

    const response = await resolveUrlToContent(url)
    if (response?.type === 'cms') {
      navigation.navigate('CMS', { ...response })
      setIsLoading(false)
      return
    }

    await navigateUrlToScreen(navigation, url, 'navigate')
    setIsLoading(false)
  }

  const renderNode = (node, index) => {
    if (!node) return

    const { name, children, attribs, type, data } = node

    const childrenData = children?.[0]?.data

    if (name === 'p' && urlRegex.test(childrenData)) {
      const text = childrenData.split('http')?.[0]
      const link = childrenData.match(urlRegex)?.[0]

      return (
        <Type
          ph={2}
          key={`a-href-${index}`}
          style={[
            styles.p,
            {
              paddingHorizontal: 0,
              textAlign: center ? 'center' : 'left',
              color
            },
            styleProps?.p
          ]}
        >
          {text}{' '}
          <Type
            semiBold={hasBoldLinks}
            underline
            onPress={() => handleRedirect(link)}
            color={color}
            letterSpacing={0.1}
          >
            {link}
          </Type>
        </Type>
      )
    }

    if (name === 'strong' && childrenData) {
      return (
        <Type key={`strong-${index}`}>
          {node?.prev && ' '}
          <Type color={color} bold>
            {trimHtmlSpaces(childrenData)}
          </Type>
          {node?.next && ' '}
        </Type>
      )
    }

    if (name === 'a' && attribs.href) {
      if (childrenData) {
        const tag = childrenData.split('?')?.[0]

        if (!ignoreLinks) {
          return (
            <Type key={`a-href-${index}`}>
              {node?.prev && ' '}
              <Type
                semiBold={hasBoldLinks}
                underline
                color={color}
                letterSpacing={0.1}
                onPress={() => handleRedirect(attribs.href)}
              >
                {trimHtmlSpaces(tag)}
              </Type>
              {node?.next && ' '}
            </Type>
          )
        }

        return (
          <Type key={`a-href-${index}`}>
            {node?.prev && ' '}
            <Type
              style={[
                styles.p,
                {
                  paddingHorizontal: 0,
                  textAlign: center ? 'center' : 'left',
                  color
                },
                styleProps?.p
              ]}
              onPress={() => handleRedirect(attribs.href)}
            >
              {trimHtmlSpaces(tag)}
            </Type>
            {node?.next && ' '}
          </Type>
        )
      }
    }

    if (data && type === 'text' && data.trim().length > 0) {
      return (
        <Type
          key={`none-tag-content-${index}`}
          style={[
            styles.p,
            {
              paddingHorizontal: 0,
              textAlign: center ? 'center' : 'left',
              color
            },
            styleProps?.p
          ]}
        >
          {trimHtmlSpaces(data)}
        </Type>
      )
    }
  }

  return (
    <Container style={styleProps.container}>
      <HTMLView
        value={sanitizeContent(content)}
        addLineBreaks={false}
        stylesheet={styles}
        renderNode={renderNode}
        {...rest}
      />
      <LoadingOverlay active={isLoading} />
    </Container>
  )
}

export default PodcastRichText
