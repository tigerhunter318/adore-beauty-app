import React from 'react'
import RichTextImageCardVerticalCard from './RichTextImageCardVerticalCard'
import Container from '../ui/Container'
import CustomButton from '../ui/CustomButton'
import useUrlNavigation from '../../navigation/utils/useUrlNavigation'

const RichTextImageCardVertical = ({ content }) => {
  const urlNavigation = useUrlNavigation()

  if (!content) return null
  const { cards, ctaButton } = content

  return (
    <Container mt={1}>
      {cards?.map((card, key) => (
        <RichTextImageCardVerticalCard key={`key-${key}`} content={card} />
      ))}
      {ctaButton && (
        <Container ph={2} pb={2} mt={1} center>
          <CustomButton
            background={ctaButton.buttonColour || 'white'}
            color={ctaButton.textColour}
            fontSize={14}
            onPress={() => urlNavigation.navigate(ctaButton.url)}
            width={300}
            pv={1.5}
          >
            {ctaButton.title}
          </CustomButton>
        </Container>
      )}
    </Container>
  )
}

export default RichTextImageCardVertical
