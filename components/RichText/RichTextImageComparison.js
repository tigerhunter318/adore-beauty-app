import React, { Fragment } from 'react'
import RichTextContent from './RichTextContent'
import Container from '../ui/Container'
import Type from '../ui/Type'
import ResponsiveImage from '../ui/ResponsiveImage'
import { groupArray } from '../../utils/array'
import { vw } from '../../utils/dimensions'
import theme from '../../constants/theme'

const styles = {
  pr10: {
    paddingRight: 5
  },
  pl10: {
    paddingLeft: 5
  },
  container: {
    width: '50%'
  }
}

const RichTextImageComparison = ({ content }) => {
  const groupedItems = groupCnt => groupArray(content.cards, groupCnt)
  const isTitleVisible = itemContent => `${itemContent.hideTitle || ''}`.toLowerCase() === 'no'

  return (
    <Container mt={1}>
      {groupedItems(2).map((group, key) => (
        <Fragment key={`title-group-${key}`}>
          <Container ph={2} pb={1} mt={1} rows>
            {group.map((card, cardKey) => (
              <Type
                key={`title-${cardKey}`}
                style={[styles.container, cardKey === 0 ? styles.pr10 : styles.pl10]}
                size={17}
                bold
                color={card.textColour ? card.textColour : theme.lightBlack}
              >
                {isTitleVisible(card) ? card.title : ''}
              </Type>
            ))}
          </Container>
          <Container ph={2} pb={2} mt={1} rows>
            {group.map((card, cardKey) => (
              <Container key={`image-${cardKey}`} style={[styles.container, cardKey === 0 ? styles.pr10 : styles.pl10]}>
                <ResponsiveImage src={card.image} width={vw(50) - 10} height={vw(50) - 10} />
                <Container mt={1}>
                  <RichTextContent
                    content={card.content}
                    color={`${card.textColour}`.length === 7 ? card.textColour : theme.black}
                    isNested
                  />
                </Container>
              </Container>
            ))}
          </Container>
        </Fragment>
      ))}
    </Container>
  )
}

export default RichTextImageComparison
