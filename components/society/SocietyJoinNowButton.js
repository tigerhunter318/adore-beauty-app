import React from 'react'
import CustomButton from '../ui/CustomButton'
import theme from '../../constants/theme'

const SocietyJoinNowButton = ({
  onPress,
  name,
  disabled,
  mt = 0,
  mb = 0,
  width = '100%',
  maxWidth = 220,
  pb = 1.4,
  pt = 1.4,
  ph = 3.5,
  fontSize = 14,
  loading = false,
  ...rest
}) => (
  <CustomButton
    disabled={disabled}
    center
    bold
    loading={loading}
    color={theme.white}
    mb={mb}
    mt={mt}
    pb={pb}
    pt={pt}
    ph={ph}
    fontSize={fontSize}
    lineHeight={24}
    letterSpacing={1.5}
    background={theme.black}
    onPress={onPress}
    width={width}
    maxWidth={maxWidth}
    alignSelf="center"
    {...rest}
  >
    {name}
  </CustomButton>
)

export default SocietyJoinNowButton
