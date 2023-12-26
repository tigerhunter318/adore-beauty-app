import React from 'react'
import HTMLView from 'react-native-htmlview'
import theme from '../../constants/theme'
import { formatExternalUrl, sanitizeContent } from '../../utils/format'
import useUrlNavigation from '../../navigation/utils/useUrlNavigation'
import Type from '../ui/Type'
import openInAppBrowser from '../../utils/openInAppBrowser'

const styleSheet = {
  htmlStyles: {
    p: {
      fontSize: 14,
      lineHeight: 24,
      color: theme.lightBlack,
      letterSpacing: 0.1,
      marginBottom: 5
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
      textDecorationLine: 'underline'
    }
  }
}

const RichTextContentPlain = ({ content }) => {
  const urlNavigation = useUrlNavigation()
  const handleLinkClick = async href => urlNavigation.push(href)

  const renderNode = (node, index) => {
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
  }
  return (
    <HTMLView
      value={sanitizeContent(content.replace(/(\r\n|\n|\r)/gm, ''))}
      addLineBreaks={false}
      stylesheet={styleSheet.htmlStyles}
      renderNode={renderNode}
    />
  )
}

export default RichTextContentPlain
