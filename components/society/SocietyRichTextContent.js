import React from 'react'
import RichTextContent from '../RichText/RichTextContent'

const styleProps = {
  h1: { bold: true, style: { textAlign: 'center', fontSize: 32 } },
  h2: { bold: true },
  p: { style: { fontSize: 13, textAlign: 'center', lineHeight: 16 } },
  strong: { style: { fontSize: 13, textAlign: 'center', lineHeight: 16 } }
}

const SocietyRichTextContent = ({ ...props }) => <RichTextContent styleProps={styleProps} {...props} />

export default SocietyRichTextContent
