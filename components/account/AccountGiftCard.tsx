import React from 'react'
import theme from '../../constants/theme'
import { formatCurrency } from '../../utils/format'
import { formatDate, isBeforeTimestamp } from '../../utils/date'
import Container from '../ui/Container'
import AdoreSvgIcon from '../ui/AdoreSvgIcon'
import Type from '../ui/Type'
import Clipboard from '../../services/clipboard'
import Toast from '../../services/toast'
import { isValidObject } from '../../utils/validation'

const AccountGiftCard = ({ data, isBlackTheme = true }) => {
  if (!isValidObject(data) || data.balance === 0) return null

  const bgColor = isBlackTheme ? theme.black : theme.white
  const fontColor = isBlackTheme ? theme.white : theme.black
  const isStartDateVisible = !isBeforeTimestamp(data.start_date) && data.status === 'disabled'

  const handleCopyPress = () => {
    if (data.code) {
      Toast.show('Code copied', {
        duration: 1500,
        onShow: () => {
          Clipboard.copyToClipboard(data.code)
        }
      })
    }
  }

  return (
    <Container
      background={bgColor}
      ph={1.8}
      pt={2.7}
      pb={1.6}
      borderRadius={16}
      border={isBlackTheme ? 'transparent' : theme.borderColor}
    >
      <Container rows justify="space-between">
        <Container rows align="flex-start">
          <Type semiBold color={fontColor} lineHeight={24} size={16} letterSpacing={1.6}>
            $
          </Type>
          <Type semiBold color={fontColor} lineHeight={28} size={24} letterSpacing={1.09}>
            {formatCurrency(data.balance || 0, '')}
          </Type>
        </Container>
        <AdoreSvgIcon name={isBlackTheme ? 'GiftCardLogoWhite' : 'GiftCardLogo'} height={34} width={110} />
      </Container>
      <Container rows mt={3.4} justify="space-between" center>
        <Type color={fontColor} lineHeight={24} letterSpacing={1}>
          {data.code}
        </Type>
        {isStartDateVisible ? (
          <Container
            background={theme.darkGrayWithOpacity}
            borderRadius={2}
            ph={1.2}
            pb={0.05}
            border={isBlackTheme ? 'transparent' : theme.borderColor}
          >
            <Type heading semiBold size={11} letterSpacing={1} lineHeight={24} color={theme.white}>
              not yet active
            </Type>
          </Container>
        ) : (
          <Container
            onPress={handleCopyPress}
            background={theme.white}
            borderRadius={2}
            ph={1.2}
            pb={0.05}
            border={isBlackTheme ? 'transparent' : theme.borderColor}
          >
            <Type heading semiBold size={11} letterSpacing={1} lineHeight={24} color={theme.black}>
              copy code
            </Type>
          </Container>
        )}
      </Container>
      <Container rows mt={2.9} justify={isStartDateVisible ? 'space-between' : 'flex-end'} center>
        {isStartDateVisible && (
          <Container>
            <Type heading semiBold color={fontColor} size={12} lineHeight={24} letterSpacing={0.86}>
              Valid From
            </Type>
            <Type heading color={fontColor} lineHeight={24} letterSpacing={1}>
              {formatDate(new Date(data.start_date * 1000), 'DD - MM - YYYY')}
            </Type>
          </Container>
        )}
        <Container>
          <Type heading semiBold color={fontColor} size={12} lineHeight={24} letterSpacing={0.86}>
            Expires
          </Type>
          <Type heading color={fontColor} lineHeight={24} letterSpacing={1}>
            {formatDate(new Date(data.expiry_date * 1000), 'DD - MM - YYYY')}
          </Type>
        </Container>
      </Container>
    </Container>
  )
}

export default AccountGiftCard
