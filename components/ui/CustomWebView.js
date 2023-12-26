import React from 'react'
import { WebView } from 'react-native-webview'

const CustomWebView = props => <WebView androidLayerType="hardware" {...props} />

export default CustomWebView
