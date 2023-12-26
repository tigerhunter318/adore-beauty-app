import React, { Component } from 'react'
import { View } from 'react-native'
import CustomWebView from './CustomWebView'
import Loading from './Loading'

// will receive height data from WebView
const parseMessage = data => {
  let pasedData = null
  try {
    pasedData = JSON.parse(data)
  } catch (ex) {
    pasedData = null
  }
  return pasedData
}

// script to inject into WebView
const script = `
  function getHeight(el) {
      var elHeight = el.scrollHeight;
      var docHeight = document.body.scrollHeight;
      var height;
      if (elHeight < docHeight && elHeight > 0) {
          height = elHeight;
      } else {
          height = docHeight;
      }
      return height;
  }

  var height = 0;
  var wrapper = document.body.firstChild;
  function updateSize() {
      var h = getHeight(wrapper);
      if (h !== height) {
          height = h;
          window.ReactNativeWebView.postMessage(JSON.stringify({"height": height}));
      }
  }

  window.addEventListener("message", function(e) {
      // Listen to all messages to trigger additional size checks.
      // Includes Iframely resize message, native pings from Twitter & et al
      
      // You can also try checking sizes periodically if you have issues
      // see https://github.com/react-native-community/react-native-webview/issues/154

      updateSize();
  });
  window.addEventListener("load", function(e) {
    updateSize();
  })
  updateSize()
`

// prevent webview scaling & add Iframely default styles and embed.js script as necessary
const head = `
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
<style>
.iframely-responsive {
  top: 0; left: 0; width: 100%; height: 0;
  position: relative; padding-bottom: 56.25%;
}
.iframely-responsive>* {
  top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;
}
</style>
`

// please load embed.js script off your custom CDN, if you use it
const embedJsScript =
  '<script async src="https://www.instagram.com/embed.js"></script><script src="https://cdn.embedly.com/widgets/platform.js"></script><script>window.instgrm.Embeds.process()</script>'

export default class EmbedWebView extends Component {
  constructor(props) {
    super(props)

    this.html = `<head>${head}${embedJsScript}</head><body>${this.props.html}</body>`
    this.state = {
      height: props.height
    }
  }

  onWebViewMessage = e => {
    const message = parseMessage(e.nativeEvent.data)
    if (message && message.height) {
      this.setState({
        height: message.height
      })
    }
  }

  render() {
    return (
      <View>
        <CustomWebView
          // 'useWebKit' adds support of postMessage for iOS WebView, available from the 0.57 release
          useWebKit
          scrollEnabled={false}
          onMessage={this.onWebViewMessage}
          source={{ html: this.html }}
          style={{ height: this.state.height || 0 }}
          startInLoadingState
          renderLoading={() => <Loading />}
          javaScriptEnabled
          injectedJavaScript={script}
          domStorageEnabled
          incognito
          // add more props as you deem necessary, e.g. allowsInlineMediaPlayback, mediaPlaybackRequiresUserAction
        />
      </View>
    )
  }
}
