import React from 'react'
import Type from './Type'
import Container from './Container'
import useUrlNavigation from '../../navigation/utils/useUrlNavigation'
import { getRemoteConfigJson } from '../../services/useRemoteConfig'
import { isValidArray } from '../../utils/validation'

const FooterHyperLinks = () => {
  const footerLinks = getRemoteConfigJson('footer_links')
  const urlNavigation = useUrlNavigation()
  if (!isValidArray(footerLinks)) {
    return null
  }

  return (
    <Container rows pt={1} pb={1} ph={2} style={{ flexWrap: 'wrap' }} align="center" justify="center">
      {footerLinks.map(item => (
        <Container key={item.text} onPress={item.url ? () => urlNavigation.push(item.url) : undefined}>
          <Type size={10} uppercase letterSpacing={1.14} lineHeight={16}>
            {item.text}
          </Type>
        </Container>
      ))}
    </Container>
  )
}

export default FooterHyperLinks
