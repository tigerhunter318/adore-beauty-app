import React from 'react'
import Container from '../ui/Container'
import Type from '../ui/Type'
import ResponsiveImage from '../ui/ResponsiveImage'
import RichTextContent from './RichTextContent'

const RichTextImageManagedCopyCard = ({ content }) => (
  <Container ph={2} pt={2} justify>
    <Container pb={1}>
      <Type bold center size={22}>
        {content.title}
      </Type>
    </Container>
    <Container pb={1}>
      <ResponsiveImage src={content.image} width={365} height={365} useAspectRatio />
    </Container>
    <RichTextContent content={content.imageCopy} isNested />
  </Container>
)

export default RichTextImageManagedCopyCard
