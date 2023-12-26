import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import theme from '../../constants/theme'
import Container from './Container'

type StarsProps = {
  stars: number
  total?: number
  size?: number
  styles?: {} | any
  color?: string
  onStarPress?: (starValue: number) => void
}

const Stars = ({ stars = 4, total = 5, size = 15, styles, color = theme.stars, onStarPress }: StarsProps) => {
  const numbers = Array.from(Array(total).keys())
  return (
    <Container rows style={styles}>
      {numbers.map(n => {
        const i = n + 1
        let name = i <= stars ? 'ios-star' : 'ios-star-outline'
        if (Math.ceil(stars) === i && stars !== i) {
          name = 'ios-star-half'
        }
        return (
          <Container key={`star-${i}`} onPress={onStarPress && (() => onStarPress(i))}>
            <Icon name={name} size={size} color={color} style={{ opacity: name === 'ios-star-outline' ? 0.5 : 1 }} />
          </Container>
        )
      })}
    </Container>
  )
}

export default Stars
