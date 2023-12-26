import React from 'react'
import { StyleSheet } from 'react-native'
import Container from '../ui/Container'
import Type from '../ui/Type'
import theme from '../../constants/theme'

const styles = StyleSheet.create({
  progressBar: {
    height: 20,
    paddingHorizontal: 4,
    paddingVertical: 3
  },
  innerBar: {
    height: 12
  },
  mark: {
    width: 1,
    height: 7
  }
})

const AccountRewardsProgressBar = ({ value, level }) => (
  <Container mt={3} pb={4.4}>
    <Container center>
      <Type heading bold size={14} lineHeight={18} letterSpacing={0.51}>
        Spend Progress
      </Type>
    </Container>
    <Container ml={1.6} mr={1.6} mt={2} style={styles.progressBar} border borderRadius={10} background={theme.white}>
      <Container style={[styles.innerBar, { width: value }]} backgroundColor={theme.black} border borderRadius={6} />
    </Container>
    <Container ml={1.6} mr={1.6} rows justify="space-between">
      <Container>
        <Container style={styles.mark} backgroundColor={theme.black} ml={1} />
        <Type size={12} semiBold letterSpacing={0.44} mt={1}>
          Level {level}
        </Type>
      </Container>
      <Container center>
        <Container style={styles.mark} backgroundColor={theme.black} />
        <Type size={12} semiBold letterSpacing={0.44} mt={1}>
          50%
        </Type>
      </Container>
      <Container align="flex-end">
        <Container style={styles.mark} backgroundColor={theme.black} mr={1} />
        <Type size={12} semiBold letterSpacing={0.44} mt={1}>
          Level {level + 1}
        </Type>
      </Container>
    </Container>
  </Container>
)

export default AccountRewardsProgressBar
