import React from 'react'
import { StyleSheet } from 'react-native'
import Container from '../ui/Container'
import Button from '../ui/Button'
import useUrlNavigation from '../../navigation/utils/useUrlNavigation'

const styles = StyleSheet.create({
  containerStyle: {
    width: '100%'
  },
  textStyle: {
    paddingVertical: 5
  }
})

const RichTextButton = ({ content }) => {
  const urlNavigation = useUrlNavigation()
  const onButtonPress = async () => {
    await urlNavigation.push(content.url)
  }

  return (
    !!content && (
      <Container pv={1} rows justify>
        <Button
          onPress={onButtonPress}
          containerStyle={styles.containerStyle}
          textStyle={styles.textStyle}
          isPrimary={content.type && content.type.toLowerCase() === 'primary'}
        >
          {content.title}
        </Button>
      </Container>
    )
  )
}

export default RichTextButton
