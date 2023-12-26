import React, { useEffect } from 'react'
import { Dimensions, KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native'

const styleSheet = {
  container: {}
}

const ScreenInputView = ({ children, enabled = true, ...rest }) => (
  <KeyboardAvoidingView behavior="position" enabled={enabled} {...rest}>
    {children}
  </KeyboardAvoidingView>
)

export default ScreenInputView
