import React from 'react'
import Container from '../../ui/Container'
import Type from '../../ui/Type'
import Icon from '../../ui/Icon'
import { sanitizeContent } from '../../../utils/format'
import { vw } from '../../../utils/dimensions'
import theme from '../../../constants/theme'

const SocietyMenuLevelCard = ({ content }) => {
  const cleanContent = sanitizeContent(content)
    .match(/<li>([^<]*?)<\/li>|<li>([^<]*?)<strong>([^<]*?)<\/strong>([^<]*?)<\/li>|/g)
    .join('@@ ')
    .replace(/<(\/)?(strong)[^>]*>/g, '##')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .split('@@ ')
    .filter(x => x)

  return cleanContent.map((line, key) => {
    const boldText = /##(.*)##/g.exec(line)
    const minSpend = /(No|minimum|min)(.*)spend/gi.exec(line)
    const expiry = /(Expire)(?=s | )(.*)*/gi.exec(line)

    return (
      <Container rows width={vw(80)} mt={1} ph={2} key={key}>
        <Container style={{ marginRight: 12, paddingTop: 15 }}>
          <Icon size={10} name="check" style={{ color: theme.orange }} type="fontAwesome" />
        </Container>
        <Container pt={1}>
          {boldText ? (
            <Type letterSpacing={0.5}>
              <Type heading={boldText[1] === 'Free'} bold>
                {boldText[1]}
              </Type>
              {minSpend
                ? boldText.input.replace(boldText[0], '').replace(minSpend[0], '')
                : boldText.input.replace(boldText[0], '')}
            </Type>
          ) : (
            <Type letterSpacing={0.5} lineHeight={20}>
              {!expiry ? line : expiry.input.replace(expiry[0], '')}
              {expiry && <Type size={11}>{expiry[0]}</Type>}
            </Type>
          )}
          {minSpend && (
            <Type letterSpacing={0.5} pt={0.5} size={11}>
              {minSpend[0][0].toUpperCase() + minSpend[0].slice(1)}
            </Type>
          )}
        </Container>
      </Container>
    )
  })
}

export default SocietyMenuLevelCard
