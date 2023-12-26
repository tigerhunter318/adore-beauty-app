import React from 'react'
import Container from '../ui/Container'
import Type from '../ui/Type'
import ResponsiveImage from '../ui/ResponsiveImage'
import CustomButton from '../ui/CustomButton'
import RichTextContent from './RichTextContent'
import useUrlNavigation from '../../navigation/utils/useUrlNavigation'

const RichTextImageCardVerticalCard = ({ content }) => {
  const urlNavigation = useUrlNavigation()

  if (!content) return null
  const { backgroundColour, image, textColour, title, ctaButton, content: richContent } = content

  return (
    <Container ph={2} justify center>
      <Container mb={2} background={backgroundColour} style={{ width: 236 }}>
        <ResponsiveImage src={image} width={236} height={236} useAspectRatio />
        <Container ph={2.5} pt={3} pb={2}>
          <Type bold size={18} color={`${textColour}`.trim().length === 7 ? textColour : '#000'} center>
            {title}
          </Type>
          <Container mt={1.3}>
            <RichTextContent
              content={richContent}
              color={`${textColour}`.trim().length === 7 ? textColour : '#000'}
              isNested
              center
            />
          </Container>
        </Container>
        {ctaButton && (
          <Container ph={1} pb={2}>
            <CustomButton
              background={ctaButton.buttonColour}
              color={ctaButton.textColour}
              fontSize={14}
              onPress={() => urlNavigation.navigate(ctaButton.url)}
            >
              {ctaButton.title}
            </CustomButton>
          </Container>
        )}
      </Container>
    </Container>
  )
}

export default RichTextImageCardVerticalCard
