import React from 'react'
import Type from '../ui/Type'
import { trimHtmlSpaces } from '../../utils/format'
import { fontStyles } from '../../constants/fontStyles'
import { isValidArray } from '../../utils/validation'
import theme from '../../constants/theme'

const RichTextATag = ({ node, linkUrl, linkTitle, onRedirect, onProductPress, semiBold = false, styleProps = {} }) => {
  const styles = [fontStyles.p, styleProps?.a?.style]
  const hasPressFunction = typeof onRedirect === 'function' || typeof onProductPress === 'function'
  const handleLinkPress = hasPressFunction
    ? () => {
        if (node?.attribs['data-product-id']) {
          onProductPress(node.attribs['data-product-id'])
        } else {
          onRedirect(linkUrl)
        }
      }
    : undefined

  return (
    <Type onPress={handleLinkPress}>
      {(isValidArray(node?.prev?.children?.[0]) || node?.prev?.children?.[0]?.data || node?.prev?.data) && ' '}
      <Type underline style={styles} color={theme.lightBlack} semiBold={semiBold}>
        {trimHtmlSpaces(linkTitle)}
      </Type>
      {node?.next && ' '}
    </Type>
  )
}

export default RichTextATag
