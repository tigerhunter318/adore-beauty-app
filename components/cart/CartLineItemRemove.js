import React, { useState } from 'react'
import { Alert } from 'react-native'
import Icon from '../ui/Icon'
import Container from '../ui/Container'
import theme from '../../constants/theme'

const CartLineItemRemove = ({
  disabled,
  onRemovePress,
  message = 'Are you sure you want to remove this item?',
  iconStyle = {}
}) => {
  const handleRemove = () => {
    if (!disabled) {
      Alert.alert(
        message,
        null,
        [
          {
            text: 'No',
            onPress: () => {}
          },
          {
            text: 'Yes',
            onPress: onRemovePress
          }
        ],
        {
          cancelable: false
        }
      )
    }
  }

  return (
    <Container width={50} height={50} style={{ opacity: disabled ? 0.5 : 1 }} pl={2} onPress={handleRemove}>
      <Icon style={[{ top: -2, right: -5 }, iconStyle]} color={theme.black} name="close" type="material" size={20} />
    </Container>
  )
}

export default CartLineItemRemove
