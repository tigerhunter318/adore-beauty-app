import React from 'react'
import { TouchableOpacity } from 'react-native'
import { isIos } from '../../utils/device'
import { vw } from '../../utils/dimensions'
import Type from '../ui/Type'
import theme from '../../constants/theme'
import Container from '../ui/Container'

const styles = {
  container: {
    width: vw(50) - 15,
    height: 93,
    margin: 5,
    justifyContent: 'center'
  },
  text: {
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 14
  },
  shadow: {
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  }
}

type ButtonCategoryProps = {
  item: { name: string }
  index: number
  onPress: () => void
}

const ButtonCategory = ({ index, item: { name }, onPress }: ButtonCategoryProps) => {
  let backgroundColor = index % 4 === 1 ? theme.lighterPeach : theme.lightPink
  if (index % 2 === 0) {
    backgroundColor = index % 4 === 0 ? theme.lightPink : theme.lighterPeach
  }
  return (
    <TouchableOpacity onPress={onPress} testID="ButtonCategory">
      <Container style={[styles.container, { backgroundColor }, isIos() ? styles.shadow : '']}>
        <Type bold style={[styles.text]}>
          {name}
        </Type>
      </Container>
    </TouchableOpacity>
  )
}

export default ButtonCategory
