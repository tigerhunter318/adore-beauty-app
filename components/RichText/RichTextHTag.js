import React from 'react'
import { findNodeLinkDetails } from './utils/helpers'
import Type from '../ui/Type'
import { fontStyles } from '../../constants/fontStyles'
import RichTextATag from './RichTextATag'
import { isValidArray } from '../../utils/validation'

const RichTextHTagNode = ({ node, onLinkPress, onProductPress }) => {
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
      <Type semiBold italic={italic} bold={bold} underline={underline}>
        {data}
      </Type>
    )
  }

  if (type === 'tag' && children?.length > 0) {
    if (name === 'a') {
      const linkDetails = findNodeLinkDetails(node)
      const handleLinkPress = () => onLinkPress(linkDetails.linkUrl)

      if (linkDetails.hasLink && linkDetails.linkTitle && typeof onLinkPress === 'function') {
        return (
          <RichTextATag
            node={node}
            onRedirect={handleLinkPress}
            semiBold
            onProductPress={onProductPress}
            {...linkDetails}
          />
        )
      }
    }

    return (
      <RichTextHTagNode
        italic={italic}
        bold={bold}
        underline={underline}
        node={{ name, parent, attribs, type, data, ...children[0] }}
      />
    )
  }
  return null
}

const RichTextHTag = ({ node, name, isNested = false, styleProps, onLinkPress, onProductPress }) => {
  const { hasLink } = findNodeLinkDetails(node)
  const centerText = !hasLink && (name === 'h3' || name === 'h4' || name === 'h5')

  return (
    <Type
      center={centerText}
      style={[fontStyles[name], styleProps?.[name]?.style]}
      mt={isNested ? 0 : 2}
      mb={isNested ? 0 : 2}
      {...(styleProps?.[name] || {})}
      semiBold
    >
      {isValidArray(node?.children) &&
        node.children.map((textNode, index) => (
          <RichTextHTagNode
            node={textNode}
            key={`${textNode.type}-${index}`}
            onLinkPress={onLinkPress}
            onProductPress={onProductPress}
          />
        ))}
    </Type>
  )
}

export default RichTextHTag
