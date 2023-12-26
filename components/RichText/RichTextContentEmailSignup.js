import React from 'react'
import { StyleSheet } from 'react-native'
import HTMLView from 'react-native-htmlview'
import Container from '../ui/Container'
import Type, { DEFAULT_FONT_FAMILY, DEFAULT_FONT } from '../ui/Type'
import theme from '../../constants/theme'
import { sanitizeContent } from '../../utils/format'

const htmlStyles = StyleSheet.create({
  h1: {
    fontSize: 32,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: '400',
    fontFamily: DEFAULT_FONT_FAMILY,
    letterSpacing: 3,
    marginBottom: 5
  },
  strong: {
    fontWeight: '700',
    fontFamily: `${DEFAULT_FONT}-Bold`
  },
  p: {
    fontSize: 12,
    lineHeight: 22
  },
  a: {
    color: theme.lightBlack,
    textDecorationLine: 'underline'
  }
})

const RichTextContentEmailSignup = ({ content, color, centerDescription }) => {
  const renderNode = (node, index) => {
    if (node.name === 'h1') {
      if (node.children[0].name === 'strong') {
        return (
          <Container center align key={`strong-${index}`}>
            <Type style={[htmlStyles.h1, htmlStyles.strong]} key={index} bold backgroundColor={color} ph={1}>
              {node.children[0].children[0].data}
            </Type>
          </Container>
        )
      }

      return (
        <Container center align key={`h1-${index}`}>
          <Type style={htmlStyles.h1} key={index} bold backgroundColor={color} ph={1}>
            {node.children[0].data}
          </Type>
        </Container>
      )
    }
  }

  const textAlign = centerDescription ? { p: { textAlign: 'center', fontSize: 12, lineHeight: 22 } } : {}
  return (
    <Container>
      <HTMLView
        value={sanitizeContent(content)}
        addLineBreaks={false}
        stylesheet={{ ...htmlStyles, ...textAlign }}
        renderNode={renderNode}
      />
    </Container>
  )
}

export default RichTextContentEmailSignup
