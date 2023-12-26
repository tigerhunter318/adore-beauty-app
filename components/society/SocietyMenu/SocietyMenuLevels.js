import React from 'react'
import { StyleSheet } from 'react-native'
import theme from '../../../constants/theme'
import { isIos } from '../../../utils/device'
import { px, vw } from '../../../utils/dimensions'
import Container from '../../ui/Container'
import ResponsiveImage from '../../ui/ResponsiveImage'
import SocietyJoinNowButton from '../SocietyJoinNowButton'
import SocietyMenuLevelCard from './SocietyMenuLevelCard'

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.white,
    borderWidth: 1,
    borderColor: theme.borderColor,
    borderRadius: 6,
    paddingTop: 10,
    paddingBottom: 30,
    width: vw(85)
  },
  shadow: {
    shadowColor: theme.black,
    shadowOpacity: 0.1,
    shadowRadius: 20
  }
})

const SocietyMenuLevels = ({ cards, isSocietyMember, onPress, containerStyle = {} }) => {
  if (!cards) return null

  const renderCards = ({ image, content }, key) => (
    <Container mb={4} center key={key}>
      <Container align="center">
        <ResponsiveImage src={image} displayWidth={px(170)} displayHeight={px(120)} />
      </Container>
      <Container style={[styles.card, isIos() ? styles.shadow : '']}>
        <SocietyMenuLevelCard content={content} />
      </Container>
    </Container>
  )

  return (
    <Container style={containerStyle}>
      {cards?.map((card, key) => renderCards(card, key))}
      {!isSocietyMember && (
        <Container center>
          <SocietyJoinNowButton onPress={onPress} width={vw(82)} mb={2} name="Join now" />
        </Container>
      )}
    </Container>
  )
}

export default SocietyMenuLevels
