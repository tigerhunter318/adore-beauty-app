import React from 'react'
import { useCartQuantity } from '../../store/modules/cart'
import theme from '../../constants/theme'
import AdoreSvgIcon from './AdoreSvgIcon'
import Container from './Container'
import IconBadge from './IconBadge'

const Bag = () => {
  const badgeText = useCartQuantity()

  return (
    <Container pb={badgeText ? 0.5 : 0} mr={badgeText ? 0.7 : 0}>
      <AdoreSvgIcon name="BagSolid" width={24} height={23} color={theme.white} />
      {badgeText ? <IconBadge style={{ top: 10, borderColor: theme.black, borderWidth: 1 }} text={badgeText} /> : null}
    </Container>
  )
}

export default Bag
