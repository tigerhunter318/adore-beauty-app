import React from 'react'
import theme from '../../../constants/theme'
import { vw } from '../../../utils/dimensions'
import Container from '../../ui/Container'
import ResponsiveImage from '../../ui/ResponsiveImage'
import Type from '../../ui/Type'
import RichTextContent from '../../RichText/RichTextContent'

const SocietyMenuBenefits = ({ cards }) => {
  if (!cards) return null

  const SocietyBenefitsItem = ({ image, title, content }) => (
    <Container justify center>
      <Container center style={{ width: vw(70) }}>
        <Container style={{ width: 160 }}>
          <ResponsiveImage src={image} width={160} height={160} useAspectRatio />
        </Container>
        <Container center>
          <Type letterSpacing={0.5} bold pt={3} pb={2} size={16} center>
            {title}
          </Type>
          <RichTextContent isNested center content={content} />
        </Container>
      </Container>
    </Container>
  )

  return (
    <Container
      style={{
        marginBottom: 50,
        borderTopWidth: 1,
        borderColor: theme.borderColor,
        width: vw(100)
      }}
    >
      {cards?.map(({ image, title, content }, key) => (
        <SocietyBenefitsItem key={`key-${key}`} image={image} title={title} content={content} />
      ))}
    </Container>
  )
}

export default SocietyMenuBenefits
