import React, { useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import theme from '../../constants/theme'
import AdoreSvgIcon from '../ui/AdoreSvgIcon'
import Container from '../ui/Container'
import Type, { DEFAULT_FONT } from '../ui/Type'
import Button from '../ui/Button'
import CustomModal from '../ui/CustomModal'
import SocialShareIcon from '../ui/SocialShareIcon'
import Clipboard from '../../services/clipboard'
import Toast from '../../services/toast'
import { gaEvents } from '../../services/ga'
import { emarsysEvents } from '../../services/emarsys/emarsysEvents'
import { share } from '../../utils/share'
import SocietyTermsAndConditions from '../society/SocietyTermsAndConditions'
import { now } from '../../utils/date'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    paddingVertical: 22
  },
  inner: {
    marginTop: 19,
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 18
  },
  titleContainer: {
    marginTop: 14,
    alignItems: 'center'
  },
  title: {
    textTransform: 'uppercase',
    fontSize: 20,
    letterSpacing: 2,
    lineHeight: 29
  },
  rewardTitle: {
    textTransform: 'uppercase',
    fontSize: 24,
    letterSpacing: 2.4,
    lineHeight: 29,
    paddingTop: 10,
    paddingBottom: 20
  },
  rewardDescription: {
    color: theme.lighterBlack,
    lineHeight: 26,
    letterSpacing: 0.5,
    textAlign: 'center'
  },
  referAFriend: {
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 1
  },
  borderStyle: {
    borderWidth: 1,
    borderColor: theme.darkGray,
    borderStyle: 'dashed',
    flexDirection: 'row',
    marginTop: 20
  },
  referralLinkContainer: {
    backgroundColor: theme.lightGrey,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flex: 1
  },
  copyButtonContainer: {
    paddingBottom: 8,
    paddingTop: 8
  },
  copyButton: {
    fontSize: 12,
    fontFamily: `${DEFAULT_FONT}-Bold`,
    letterSpacing: 1.09,
    lineHeight: 24
  },
  shareContainer: {
    marginTop: 27,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  shareText: {
    marginRight: 20,
    fontSize: 11,
    letterSpacing: 1.1,
    lineHeight: 14
  },
  termsAndConditions: {
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 16,
    letterSpacing: 0.71,
    color: theme.lighterBlack
  },
  modalContent: {
    marginTop: 50,
    paddingHorizontal: 20
  }
})

const contentType = 'refer_a_friend'

const socialPackages = [
  {
    name: 'Email',
    eventName: 'Email',
    urlScheme: 'mailto',
    dimension: {
      width: 22,
      height: 15
    }
  },
  {
    name: 'FacebookMessenger',
    eventName: 'Messenger',
    urlScheme: 'fb-messenger',
    dimension: {
      width: 21,
      height: 21
    }
  },
  {
    name: 'WhatsApp',
    eventName: 'Whatsapp',
    urlScheme: 'whatsapp',
    dimension: {
      width: 20,
      height: 20
    }
  }
]

const AccountRewardsReferral = ({ data, color }) => {
  const [copied, setCopied] = useState(false)
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false)

  if (!data) return null

  const {
    landing_page_url: url,
    referral_id: referralId,
    friend_title: friendTitle,
    friend_text: friendText,
    title,
    reward_text: rewardTitle,
    text: rewardDescription,
    consent_text: consentText,
    consent_link_text: termsAndConditionsLink
  } = data

  const referralLink = `${url}?referralId=${referralId}`

  const handleTermsLinkPress = () => setIsTermsModalVisible(!isTermsModalVisible)

  const handleCopyPress = () => {
    Toast.show('Link Copied', {
      duration: 1500,
      onShow: () => {
        Clipboard.copyToClipboard(referralLink)
        setCopied(true)
        gaEvents.shareEvent(contentType, 'copy_URL')
        emarsysEvents.trackCustomEvent('referAFriend', {
          interaction: JSON.stringify({
            'link-copied': now()
          })
        })
      }
    })
  }

  const getShareLink = urlScheme => {
    switch (urlScheme) {
      case 'mailto':
        return `mailto:?subject=${encodeURIComponent(friendTitle)}&body=${encodeURIComponent(
          `${friendText}
          ${referralLink}`
        )}`
      case 'fb-messenger':
        return `fb-messenger://share?link=${encodeURIComponent(referralLink)}`
      case 'whatsapp':
        return `whatsapp://send?text=${encodeURIComponent(`${friendText}\n${referralLink}`)}`
      default:
        return ''
    }
  }

  const handleExtraSocialShares = () => {
    share(
      contentType,
      referralId,
      `${friendText}
      ${referralLink}`
    )
    emarsysEvents.trackCustomEvent('referAFriend', {
      interaction: JSON.stringify({
        shareButtonPressed: now(),
        name: 'Other'
      })
    })
  }

  return (
    <Container style={styles.container}>
      <Type bold style={styles.referAFriend}>
        Refer a Friend:
      </Type>
      <Container border={theme.borderColor} style={styles.inner}>
        <Container center>
          <AdoreSvgIcon name="ShareGift" width={90} height={50} color={color} />
        </Container>
        <Container style={styles.titleContainer}>
          <Type light style={styles.title}>
            {title}
          </Type>
          <Type bold style={styles.rewardTitle}>
            {rewardTitle}
          </Type>
        </Container>
        <Type style={styles.rewardDescription}>{rewardDescription}</Type>
        <Container style={styles.borderStyle}>
          <Container style={styles.referralLinkContainer} onPress={handleCopyPress}>
            <Type size={12} numberOfLines={1}>
              {referralLink}
            </Type>
          </Container>
          <Button
            isSecondary
            onPress={handleCopyPress}
            containerStyle={styles.copyButtonContainer}
            textStyle={styles.copyButton}
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </Container>
        <Container style={styles.shareContainer}>
          <Type bold style={styles.shareText}>
            Or share with
          </Type>
          <Container rows align>
            {socialPackages.map(({ name, eventName, dimension: { width, height }, urlScheme }) => (
              <SocialShareIcon
                name={name}
                eventName={eventName}
                width={width}
                height={height}
                url={getShareLink(urlScheme)}
                contentType={contentType}
              />
            ))}
            <Container onPress={handleExtraSocialShares}>
              <AdoreSvgIcon name="ThreeDots" width={26} height={26} />
            </Container>
          </Container>
        </Container>
        <Type style={styles.termsAndConditions} mt={1}>
          {consentText}
        </Type>
        <Container onPress={handleTermsLinkPress}>
          <Type style={styles.termsAndConditions} underline>
            {termsAndConditionsLink}
          </Type>
          <CustomModal isVisible={isTermsModalVisible} onClose={handleTermsLinkPress}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <SocietyTermsAndConditions />
            </ScrollView>
          </CustomModal>
        </Container>
      </Container>
    </Container>
  )
}
export default AccountRewardsReferral
