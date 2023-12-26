import React from 'react'
import RichTextColumns from './RichTextColumns'
import RichTextImageManagedCopy from './RichTextImageManagedCopy'
import RichTextImageCardVertical from './RichTextImageCardVertical'
import RichTextImageComparison from './RichTextImageComparison'
import RichTextDropdown from './RichTextDropdown'
import Container from '../ui/Container'

const RichTextCardsMultiple = ({ content }) => {
  const renderBlock = () => {
    switch (`${content.cardStyle}`.toLowerCase()) {
      case 'textcolumns':
        return <RichTextColumns content={content} />
      case 'imagecopy':
        return <RichTextImageManagedCopy content={content} />
      case 'imagecardvertical':
        return <RichTextImageCardVertical content={content} />
      case 'imagecomparison':
        return <RichTextImageComparison content={content} />
      case 'dropdown':
        return <RichTextDropdown content={content} />
      default:
        break
    }
  }

  return <Container>{renderBlock()}</Container>
}

export default RichTextCardsMultiple
