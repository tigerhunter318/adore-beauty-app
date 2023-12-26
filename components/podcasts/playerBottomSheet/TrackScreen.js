import React from 'react'
import Container from '../../ui/Container'
import TrackScreenContent from './TrackScreenContent'
import TrackScreenPlayer from './TrackScreenPlayer'

const TrackScreen = () => (
  <Container style={{ height: '100%' }}>
    <TrackScreenContent />
    <TrackScreenPlayer />
  </Container>
)

export default TrackScreen
