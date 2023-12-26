import React from 'react'
import RichTextImageManagedCopyCard from './RichTextImageManagedCopyCard'

const RichTextImageManagedCopy = ({ content }) =>
  content &&
  content.imageManagedCopy.map((card, key) => <RichTextImageManagedCopyCard key={`key-${key}`} content={card} />)

export default RichTextImageManagedCopy
