import React from 'react'
import Type from '../Type'
import theme from '../../../constants/theme'
import Container from '../Container'

const styleSheet = {
  container: {
    height: 50,
    backgroundColor: theme.black
  },
  title: {
    color: theme.white,
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 1
  },
  icon: {
    fontSize: 22,
    color: theme.white
  },
  btn: {
    position: 'absolute',
    right: 0
  }
}

const Header = ({ title, onPress, closeLabel = 'Done' }) => (
  <Container style={styleSheet.container} justify center>
    <Container rows align center>
      <Type semiBold style={styleSheet.title}>
        {title || ''}
      </Type>
    </Container>
    <Container style={styleSheet.btn} onPress={onPress}>
      <Container pv={1} pr={1.5}>
        <Type semiBold color={theme.white}>
          {closeLabel}
        </Type>
      </Container>
    </Container>
  </Container>
)

export default Header
