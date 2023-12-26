# react-native-partnerize

### creating using
`npx brodybits/create-react-native-module#add-swift-option react-native-swift-module --swift --generate-example`

## Getting started

`$ npm install react-native-partnerize --save`

### Mostly automatic installation

`$ react-native link react-native-partnerize`

## Usage
```javascript
import ReactNativePartnerize from 'react-native-partnerize';

// TODO: What to do with the module?
ReactNativePartnerize;
ReactNative.Partnerize.completeConversion([
  {
    price: 10.1,
    category: 'category',
    quantity: 2,
    sku: 'sku1'
  },
  {
    price: 10.1,
    category: 'category',
    quantity: 2,
    sku: 'sku2',
    metadata: { development_mode: 'yes' }
  }
])
```
