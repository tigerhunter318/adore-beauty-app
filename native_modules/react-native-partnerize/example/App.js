import React, {useEffect, useState} from 'react'
import {Button, StyleSheet, Text, View} from 'react-native'
import ReactNativePartnerize from 'react-native-partnerize'
import prepareConversionInput from './prepareConversionResult.json'

/* eslint-disable no-console */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
})

const conversionDeeplinkUrl =
  'https://adorebeauty.prf.hn/click/camref:1101ldc22/destination:https://staging.adorebeauty.com.au/estee-lauder/estee-lauder-double-wear-makeup.html'
const otherDeeplinkUrl = 'https://staging.adorebeauty.com.au/estee-lauder/estee-lauder-double-wear-makeup.html'

const testPayload = {
  // products: [
  //   {
  //     value: 59.99,
  //     category: 'Shoes',
  //     quantity: 5,
  //     sku: 'TSH-PLN-MED',
  //     metadata: {
  //       brand: 'adidas',
  //       model: 'stan smith',
  //     },
  //   },
  //   {
  //     value: 74,
  //     category: 'Jeans',
  //     metadata: {
  //       brand: 'levis',
  //     },
  //   },
  // ],
  // conversionRef: 'order-10000000',
  metadata: {
    custom_field_1: 'test-one',
    custom_field_2: 'test two',
  },
}

const App = () => {
  const [loggingEnabledResponse, setLoggingEnabledResponse] = useState('')
  const [completeConversionResponse, setCompleteConversionResponse] = useState('')
  const [conversionClick, setConversionClick] = useState(null)

  const testStartConversion = async url => {
    try {
      const response = await ReactNativePartnerize.startConversion(url)
      setConversionClick(response)
      console.log('35', '', 'testStartConversion:success', response)
    } catch (error) {
      console.warn('35', '', 'testStartConversion', error.code, error.message, JSON.stringify(error))
    }
  }
  const testCompleteConversion = async clickRef => {
    try {
      // const payload = prepareConversionInput.result
      const result1 = await ReactNativePartnerize.completeConversion(testPayload, clickRef)
      setCompleteConversionResponse(result1)
    } catch (error) {
      // console.warn('testCompleteConversion:error', error.code, error.message, JSON.stringify(error))
      console.warn('testCompleteConversion:error', error.code, error.message)
    }
  }

  useEffect(() => {
    console.log('ReactNativePartnerize:', ReactNativePartnerize)
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>☆ReactNativePartnerize example☆</Text>
      <Text style={styles.welcome}>☆NATIVE CALLBACK MESSAGE☆</Text>
      <Button title={'Test Start Conversion'} onPress={() => testStartConversion(conversionDeeplinkUrl)} />
      <Button title={'Test Fail Start Conversion'} onPress={() => testStartConversion(otherDeeplinkUrl)} />
      <Text>clickRef : {conversionClick?.clickRef}</Text>
      {!!conversionClick?.clickRef && (
        <>
          <Button
            title={'Test Complete Conversion'}
            onPress={() => testCompleteConversion(conversionClick?.clickRef)}
          />
          <Button title={'Test Fail Complete Conversion'} onPress={() => testCompleteConversion('')} />
        </>
      )}

      <Text style={styles.instructions}>{JSON.stringify(loggingEnabledResponse)}</Text>
      <Text style={styles.instructions}>{JSON.stringify(completeConversionResponse)}</Text>
    </View>
  )
}

export default App
