import React from 'react'
import Type from '../ui/Type'
import { fontStyles } from '../../constants/fontStyles'
import { findNodeLinkDetails } from './utils/helpers'
import RichTextATag from './RichTextATag'
import { trimHtmlSpaces } from '../../utils/format'
import { isValidArray } from '../../utils/validation'

const RichTextPTagNode = ({ node, onRedirect, onProductPress }) => {
  const { name, parent, attribs, type, data, children } = node || {}
  const italic = !!(
    parent?.attribs?.style?.includes('italic') ||
    attribs?.style?.includes('italic') ||
    parent?.name === 'em' ||
    name === 'em'
  )
  const bold = !!(
    parent?.attribs?.style?.includes('bold') ||
    attribs?.style?.includes('bold') ||
    parent?.name === 'strong' ||
    name === 'strong'
  )
  const underline = !!(
    parent?.attribs?.style?.includes('underline') ||
    attribs?.style?.includes('underline') ||
    attribs?.href
  )

  if (type === 'text' && data) {
    return (
      <Type italic={italic} bold={bold} underline={underline}>
        {data}
      </Type>
    )
  }

  if (type === 'tag' && children?.length > 0) {
    if (name === 'a') {
      const linkDetails = findNodeLinkDetails(node)

      if (linkDetails.hasLink && linkDetails.linkTitle) {
        return <RichTextATag node={node} onRedirect={onRedirect} onProductPress={onProductPress} {...linkDetails} />
      }
    }
    return <RichTextPTagNode italic={italic} bold={bold} underline={underline} node={children[0]} />
  }
  return null
}

const RichTextPTag = ({ node, content, center, color, styleProps, onRedirect, onProductPress }) => {
  const styles = [fontStyles.p, styleProps?.p?.style, { textAlign: center ? 'center' : 'left', color }]
  let contentData = trimHtmlSpaces(content)

  if (!contentData && !isValidArray(node)) return null

  if (isValidArray(node)) {
    contentData = node.map((textNode, index) => (
      <RichTextPTagNode
        node={textNode}
        onRedirect={onRedirect}
        onProductPress={onProductPress}
        key={`${textNode.type}-${index}`}
      />
    ))
  }

  return <Type style={styles}>{contentData}</Type>
}

export default RichTextPTag
