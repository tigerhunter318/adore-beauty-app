import React from 'react'
import theme from '../../constants/theme'
import { vw } from '../../utils/dimensions'
import Container from './Container'

const styleSheet = {
  container: {},
  hr: {
    height: 2,
    marginLeft: 'auto',
    marginRight: 'auto'
  }
}

const Hr = ({ full = undefined, backgroundColor = theme.borderColor, mt = 1, mb = 3, style = {}, ...rest }) => (
  <Container
    style={[styleSheet.hr, { backgroundColor }, { width: full ? '100%' : vw(90) }, style]}
    mt={mt}
    mb={mb}
    {...rest}
  />
)

export default Hr
