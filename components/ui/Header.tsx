// @ts-nocheck
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { isIos } from '../../utils/device'
import { gaEvents } from '../../services/ga'
import { useSafeInsets } from '../../utils/dimensions'
import Container from './Container'
import Type from './Type'
import theme from '../../constants/theme'
import HeaderLogo from '../home/HeaderLogo'
import Icon from './Icon'
import useGoBackToScreenPath from '../../navigation/utils/useGoBackToScreenPath'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    position: 'relative',
    marginBottom: 5
  },
  rightContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    position: 'absolute',
    right: 0
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    left: 0,
    position: 'absolute'
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50
  },
  center: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 50,
    marginRight: 50,
    flex: 1
  },
  title: {
    color: theme.white,
    fontSize: 17
  }
})

const NavBar = ({
  title,
  hasBack,
  hasSearch,
  onLeftPress = () => {},
  onRightPress = () => {},
  right,
  left,
  navigation,
  logoSource,
  center
}) => {
  const insets = useSafeInsets()
  let leftButton = left
  let centerComponent = center

  const onSearchBtnPress = () => {
    navigation.navigate('ProductStack', { screen: 'SearchSuggestions' })
    gaEvents.trackSearchTap()
  }

  if (title) {
    const isTitlePlainText = typeof title === 'string'
    if (isTitlePlainText) {
      centerComponent = (
        <Type style={styles.title} semiBold letterSpacing={0.5} heading numberOfLines={1} adjustsFontSizeToFit>
          {title}
        </Type>
      )
    } else {
      centerComponent = <>{title}</>
    }
  }

  if (hasBack) {
    leftButton = <Icon type="ion" name="ios-arrow-back" size={24} color="white" />
  }

  if (logoSource) {
    centerComponent = <HeaderLogo source={logoSource} />
  }

  return (
    <Container backgroundColor={theme.black} pt={isIos() ? insets.top / 10 : 1}>
      <Container style={styles.container}>
        <Container style={styles.left} onPress={leftButton && onLeftPress}>
          {leftButton}
        </Container>
        <Container style={styles.center}>{centerComponent}</Container>
        <Container style={styles.rightContainer}>
          {!!hasSearch && !right && (
            <>
              <Container style={styles.right} onPress={onSearchBtnPress} testID="Header.SearchButton">
                <Icon type="ion" name="ios-search" size={26} color={theme.white} />
              </Container>
            </>
          )}
          {!!right && (
            <Container style={styles.right} onPress={onRightPress}>
              {right}
            </Container>
          )}
        </Container>
      </Container>
    </Container>
  )
}

type HeaderProps = {
  title?: string | undefined
  hasBack?: any
  hasSearch?: any
  right?: any
  onRightPress?: any
  children?: any
  onBackPress?: any
  center?: any
}

const Header = ({
  title = null,
  hasBack = false,
  hasSearch = false,
  right,
  onRightPress,
  children,
  onBackPress,
  ...props
}: HeaderProps) => {
  const navigation = useNavigation()
  const route = useRoute()
  const screenHeaderTitle = route?.params?.screenHeaderTitle
  const screenHeaderLogoSource = route?.params?.screenHeaderLogoSource
  useGoBackToScreenPath()

  const handleLeftPress = evt => {
    if (hasBack) {
      if (onBackPress) {
        onBackPress(navigation, evt)
      } else {
        navigation.goBack()
      }
    }
  }

  return (
    <View>
      <NavBar
        title={screenHeaderTitle || title}
        leftIconColor={theme.white}
        right={right}
        hasBack={hasBack}
        hasSearch={hasSearch}
        onLeftPress={handleLeftPress}
        logoSource={screenHeaderLogoSource}
        onRightPress={evt => onRightPress(navigation, evt)}
        navigation={navigation}
        {...props}
      />
      {children}
    </View>
  )
}

export default Header
