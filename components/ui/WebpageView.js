import React from 'react'
import { isIos } from '../../utils/device'
import CustomWebView from './CustomWebView'

const WebpageView = ({ html, uri, onWebViewMessage, onLoad, postMessage, webviewRef }) => {
  const handleWebViewMessage = ({ nativeEvent }) => {
    //   console.log('12', '', 'onWebViewMessage', nativeEvent.data)
    if (nativeEvent && nativeEvent.data) {
      try {
        onWebViewMessage(JSON.parse(nativeEvent.data))
      } catch (error) {
        console.warn('WebpageView', 'handleWebViewMessage', error)
      }
    }
  }
  const source = isIos() && html ? html : { uri }

  return (
    <CustomWebView
      // source={html}
      ref={webviewRef}
      source={source}
      javaScriptEnabled
      domStorageEnabled
      originWhitelist={['*']}
      style={{ flex: 1 }}
      onMessage={handleWebViewMessage}
      keyboardDisplayRequiresUserAction={false}
      autoFocus
      onLoad={onLoad}
    />
  )
}

export default WebpageView
