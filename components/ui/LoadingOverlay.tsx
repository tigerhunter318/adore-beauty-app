import React from 'react'
import { StyleSheet } from 'react-native'
import Loading from './Loading'
import Container from './Container'

const styles = StyleSheet.create({
  container: {
    height: '100%',
    zIndex: 9
  },
  loadingSpinner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
})

type LoadingOverlayProps = {
  active: boolean
  containerStyle?: {}
  spinnerStyle?: {}
  backgroundColor?: string
  spinnerColor?: string
  spinnerSize?: number | 'small' | 'large' | undefined
  lipstick?: boolean
}

const LoadingOverlay = ({
  active,
  containerStyle,
  spinnerStyle,
  backgroundColor = 'rgba(255,255,255,.7)',
  spinnerColor = 'black',
  spinnerSize = 'small',
  lipstick = false
}: LoadingOverlayProps) => {
  if (!active) return null

  return (
    <Container background={backgroundColor} inset={0} style={[styles.container, containerStyle]}>
      <Loading
        color={spinnerColor}
        size={spinnerSize}
        style={[styles.loadingSpinner, spinnerStyle]}
        lipstick={lipstick}
      />
    </Container>
  )
}

export default LoadingOverlay
