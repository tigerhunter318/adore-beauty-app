import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import Container from '../ui/Container'
import Type from '../ui/Type'

import theme from '../../constants/theme'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },

  contentContainer: {
    paddingVertical: 20
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.1,
    color: theme.lightBlack
  },
  label: {
    fontSize: 13,
    lineHeight: 24,
    letterSpacing: 0.9,
    color: theme.lightBlack,
    textTransform: 'uppercase',
    marginTop: 20,
    marginBottom: 10
  }
})

const ProductIngredients = ({ ingredients }: { ingredients: string }) => (
  <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
    <Container gutter>
      <Type style={styles.text} selectable>
        {ingredients}
      </Type>
      <Type style={styles.label}>notes:</Type>
      <Type style={styles.text}>
        At Adore Beauty, we believe in the right product for the right person. We want our product information to be
        useful to you, so we have done our best to provide you with the most up to date ingredients list.
      </Type>
      <Type style={styles.text}>
        Please note that from time to time, products are innovated without notice. For the most accurate information
        please consult the product box. If you spot an error, please let us know! We will update this ingredients list
        as soon as possible.
      </Type>
    </Container>
  </ScrollView>
)

export default ProductIngredients
