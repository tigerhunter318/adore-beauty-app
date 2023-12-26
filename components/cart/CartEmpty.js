import React from 'react'
import Container from '../ui/Container'
import Type from '../ui/Type'
import theme from '../../constants/theme'
import { vh } from '../../utils/dimensions'
import { isIos } from '../../utils/device'
import Loading from '../ui/Loading'

const containerHeight = vh(100) / 2 + 30
const iw = 349
const ih = 375
const styleSheet = {
  container: {
    height: containerHeight,
    justifyContent: 'center',
    alignItems: 'center'
  },
  heading: {
    borderBottomWidth: 1,
    borderColor: theme.borderColor
  },
  image: {
    aspectRatio: iw / ih,
    width: '100%',
    height: 'auto'
  },
  shadow: {
    shadowColor: theme.black,
    shadowOffset: { width: 2, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5
  },
  quoteContainer: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2
  }
}
const CartEmpty = ({ navigation, isPending }) => {
  const handleQuotePress = () => {
    navigation.navigate('Shop')
  }

  if (isPending) {
    return <Loading lipstick screen />
  }

  return (
    <Container>
      <Container pv={3} style={styleSheet.heading}>
        <Type heading bold center size={16}>
          No Items in your bag
        </Type>
      </Container>
      <Container style={styleSheet.container}>
        <Container
          style={[styleSheet.quoteContainer, isIos() ? styleSheet.shadow : '']}
          background={theme.peach}
          rows
          align
          justify
          onPress={handleQuotePress}
        >
          <Type color={theme.white} bold size={20} lineHeight={20}>
            Let's{'\n'}Shop
          </Type>
        </Container>
      </Container>
    </Container>
  )
}

export default CartEmpty
