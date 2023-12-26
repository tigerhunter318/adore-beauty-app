import React from 'react'
import { StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

const styleSheet = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  splitor: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: '#404040'
  },
  quote: {
    width: 43,
    height: 11,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

const Separator = ({ withQuote = true, styles }) => (
  <View style={[styleSheet.container, styles]}>
    <View style={styleSheet.splitor} />
    {withQuote && (
      <View style={styleSheet.quote}>
        <Icon name="quote-left" size={11} color="black" />
      </View>
    )}
    <View style={styleSheet.splitor} />
  </View>
)

export default Separator
