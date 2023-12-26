import React from 'react'
import { View } from 'react-native'

import { toPascalCase } from '../../utils/case'
/* eslint-disable global-require */
const icons = {
  Account: require('../../assets/icons/account.svg').default,
  Afterpay: require('../../assets/icons/afterpay.svg').default,
  AfterpayLogo: require('../../assets/icons/afterpay-logo.svg').default,
  ArrowRight: require('../../assets/icons/arrow-right.svg').default,
  BagClear: require('../../assets/icons/bag-clear.svg').default,
  Bag: require('../../assets/icons/bag.svg').default,
  BagSolid: require('../../assets/icons/bag-solid.svg').default,
  CheckItem: require('../../assets/icons/check-item.svg').default,
  Dispatch: require('../../assets/icons/dispatch.svg').default,
  DispatchLight: require('../../assets/icons/dispatch-light.svg').default,
  HeartFull: require('../../assets/icons/heart-full.svg').default,
  Listen: require('../../assets/icons/listen.svg').default,
  Iq: require('../../assets/icons/iq.svg').default,
  List: require('../../assets/icons/list.svg').default,
  Mail: require('../../assets/icons/mail.svg').default,
  Email: require('../../assets/icons/email.svg').default,
  Makeup: require('../../assets/icons/makeup.svg').default,
  Speech: require('../../assets/icons/speech.svg').default,
  Tick: require('../../assets/icons/tick.svg').default,
  HalfStar: require('../../assets/icons/half-star.svg').default,
  Lock: require('../../assets/icons/lock.svg').default,
  Heart: require('../../assets/icons/heart.svg').default,
  Alert: require('../../assets/icons/alert.svg').default,
  Address: require('../../assets/icons/address.svg').default,
  Addressbook: require('../../assets/icons/address-book.svg').default,
  Diamond: require('../../assets/icons/diamond.svg').default,
  Search: require('../../assets/icons/search.svg').default,
  Google: require('../../assets/icons/btn_google_light_normal_ios.svg').default,
  GoogleBig: require('../../assets/icons/google.svg').default,
  Facebook: require('../../assets/icons/facebook.svg').default,
  FacebookLetter: require('../../assets/icons/facebook-f.svg').default,
  Smile: require('../../assets/icons/smile.svg').default,
  Sad: require('../../assets/icons/sad.svg').default,
  AngleDown: require('../../assets/icons/angle-down.svg').default,
  AngleUp: require('../../assets/icons/angle-up.svg').default,
  Close: require('../../assets/icons/close.svg').default,
  Filter: require('../../assets/icons/filter.svg').default,
  Share: require('../../assets/icons/share.svg').default,
  Write: require('../../assets/icons/write.svg').default,
  Retry: require('../../assets/icons/retry.svg').default,
  Society: require('../../assets/icons/adore-society.svg').default,
  ShareGift: require('../../assets/icons/share-gift-combine.svg').default,
  ZoomIn: require('../../assets/icons/zoom-in.svg').default,
  FacebookMessenger: require('../../assets/icons/fb-messenger.svg').default,
  ThreeDots: require('../../assets/icons/three-dots.svg').default,
  WhatsApp: require('../../assets/icons/whatsapp.svg').default,
  PreOrder: require('../../assets/icons/pre-order.svg').default,
  PreOrderBadge: require('../../assets/icons/pre-order-badge.svg').default,
  SoldOutBox: require('../../assets/icons/sold-out-box.svg').default,
  PasswordLock: require('../../assets/icons/password-lock.svg').default,
  TickCircle: require('../../assets/icons/tick-circle.svg').default,
  Findation: require('../../assets/icons/findation.svg').default,
  Returns: require('../../assets/icons/returns.svg').default,
  Gift: require('../../assets/icons/gift.svg').default,
  Star: require('../../assets/icons/star.svg').default,
  Ticket: require('../../assets/icons/ticket.svg').default,
  Shipping: require('../../assets/icons/shipping.svg').default,
  Birthday: require('../../assets/icons/birthday.svg').default,
  GiftCard: require('../../assets/icons/ab-giftcard.svg').default,
  GiftCardLogo: require('../../assets/icons/gift-card-logo.svg').default,
  GiftCardLogoWhite: require('../../assets/icons/gift-card-logo-white.svg').default
}

const AdoreSvgIcon = ({ name = 'ArrowRight', width = 20, height = 20, color = '#000000', ...rest }) => {
  const Svg = name.charAt(0) === name.toUpperCase().charAt(0) ? icons[name] : icons[toPascalCase(name)]

  if (Svg) {
    return <Svg {...rest} width={width} height={height} fill={color} />
  }
  console.warn('AdoreSvgIcon', 'not found', name)
  return <View />
}

export default AdoreSvgIcon
