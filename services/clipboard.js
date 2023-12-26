import Clipboard from '@react-native-clipboard/clipboard'

const copyToClipboard = text => {
  Clipboard.setString(text)
}

const fetchCopiedText = async () => {
  const text = await Clipboard.getString()
  return text
}

export default {
  copyToClipboard,
  fetchCopiedText
}
