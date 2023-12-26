import React from 'react'
import Type from './Type'
import Container from './Container'
import { versionName } from '../../config/envConfig'

const VersionInfo = ({ style }) => (
  <Container style={[{ position: 'absolute', bottom: 10, left: 20 }, style]}>
    <Type size={11}>{versionName()}</Type>
  </Container>
)

export default VersionInfo
