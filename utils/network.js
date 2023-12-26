import publicIP from 'react-native-public-ip'

export const fetchIpAddress = async () => {
  const ipAddress = await publicIP()
  return ipAddress
}
