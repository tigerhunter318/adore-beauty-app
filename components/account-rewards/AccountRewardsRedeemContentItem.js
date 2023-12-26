import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { StyleSheet } from 'react-native'
import Container from '../ui/Container'
import Type from '../ui/Type'
import Button from '../ui/Button'
import ResponsiveImage from '../ui/ResponsiveImage'
import { formatDate } from '../../utils/date'
import Clipboard from '../../services/clipboard'
import useUrlNavigation from '../../navigation/utils/useUrlNavigation'
import Toast from '../../services/toast'
import theme from '../../constants/theme'
import customer from '../../store/modules/customer'

const styles = StyleSheet.create({
  container: {
    paddingVertical: 17,
    paddingHorizontal: 15
  },
  imageFrame: {
    width: 26,
    height: 26
  },
  copiedBtn: {
    backgroundColor: theme.black,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20
  }
})

const AccountRewardsRedeemContentItem = ({ data }) => {
  const dispatch = useDispatch()
  const [copied, setCopied] = useState(false)
  const [isRedeeming, setIsRedeeming] = useState(false)
  const [loadingLinkUrl, setLoadingLinkUrl] = useState()
  const urlNavigation = useUrlNavigation()

  const handleRedeem = async () => {
    if (data.code) {
      Toast.show('Code copied', {
        duration: 1500,
        onShow: () => {
          Clipboard.copyToClipboard(data?.code)
          setCopied(true)
        }
      })
    } else if (!data?.is_redeemed) {
      setIsRedeeming(true)

      const res = await dispatch(customer.actions.redeemVoucher(data.id))

      if (res?.code) {
        Toast.show('Code copied', {
          duration: 1500,
          onShow: () => {
            Clipboard.copyToClipboard(res?.code)
            setCopied(true)
          }
        })
      }

      setIsRedeeming(false)
    }
  }

  const handleBrandExclusionApply = async () => {
    const externalUrl = data?.action_external_link_url
    if (externalUrl && externalUrl !== loadingLinkUrl) {
      setLoadingLinkUrl(externalUrl)
      await urlNavigation.push(externalUrl)
      setLoadingLinkUrl()
    }
  }

  const getCode = () => data.code || 'No Code Required'

  return (
    <Container rows style={[styles.container]} border={theme.borderColor} mt={1.5}>
      <Container pr={1.6}>
        <ResponsiveImage src={data?.full_icon_path} displayWidth useAspectRatio styles={{ image: styles.imageFrame }} />
      </Container>
      <Container flex={1}>
        <Container rows>
          <Container flex={1} pr={1}>
            <Type size={11} bold lineHeight={14} letterSpacing={1.1} color={theme.black}>
              {data?.text}
            </Type>
            <Container mt={0.3}>
              <Type heading semiBold size={11} lineHeight={19} letterSpacing={1}>
                {data?.title}
              </Type>
            </Container>
          </Container>
        </Container>
        <Container pt={0.5}>
          {copied ? (
            <Container style={styles.copiedBtn} center>
              <Type heading size={10} lineHeight={10} letterSpacing={0.91} color={theme.white}>
                Code
              </Type>
              <Type bold heading size={12} lineHeight={18} letterSpacing={1.09} color={theme.white}>
                {getCode()}
              </Type>
            </Container>
          ) : (
            <Button
              onPress={handleRedeem}
              activeOpacity={0.5}
              styles={{
                container: {
                  borderRadius: 2,
                  backgroundColor: copied ? theme.black : theme.orange,
                  borderWidth: 1,
                  borderColor: theme.orange,
                  opacity: isRedeeming ? 0.5 : 1
                }
              }}
              containerStyle={{ paddingLeft: 15, paddingRight: 15, borderRadius: 0 }}
              loading={isRedeeming}
              loadingProps={{ color: theme.white }}
            >
              <Type bold heading size={12} lineHeight={18} letterSpacing={1.09} color={theme.white}>
                Redeem
              </Type>
            </Button>
          )}
        </Container>
        <Container mt={1}>
          <Container>
            <Type size={10} lineHeight={13} letterSpacing={1} color={theme.lighterBlack}>
              {`Expires ${formatDate(data?.valid_until, 'DD/MM/YYYY')}`}.
            </Type>
          </Container>
          <Container mt={0.5} onPress={handleBrandExclusionApply}>
            <Type size={10} lineHeight={13} letterSpacing={1} color={theme.lighterBlack} underline>
              {data?.action_external_link_text}
            </Type>
          </Container>
        </Container>
      </Container>
    </Container>
  )
}

export default AccountRewardsRedeemContentItem
