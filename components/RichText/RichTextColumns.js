import React from 'react'
import Container from '../ui/Container'
import Type from '../ui/Type'
import RichTextContent from './RichTextContent'

const RichTextColumns = ({ content }) =>
  content
    ? content.cards.map((card, key) => (
        <Container ph={2} pt={2} justify key={`key-${key}`}>
          <Container pb={1}>
            <Type bold size={16}>
              {card.title}
            </Type>
          </Container>
          <RichTextContent content={card.content} isNested />
        </Container>
      ))
    : null

export default RichTextColumns
