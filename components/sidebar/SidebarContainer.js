import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import { View } from 'react-native'
import Header from '../ui/Header'
import { SidebarContext } from './SidebarContext'
import Container from '../ui/Container'

const styleSheet = {
  container: {
    height: '100%'
  },
  content: {
    flex: 1
  },
  footer: {
    height: 63 + 30
  },
  // TODO fix sidebar + sheet layout
  sheetContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  sheet: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white'
  }
}

const SidebarContainer = ({ navigation, ...props }) => {
  const {
    contextState: {
      title,
      contentComponent,
      right,
      onRightPress,
      onLeftPress,
      footerComponent,
      hasBack,
      headerComponent
    },
    containerComponent
  } = React.useContext(SidebarContext)

  if (containerComponent) {
    return containerComponent
  }

  let header = null
  if (!headerComponent) {
    const btnBack = <Icon name="ios-arrow-back" size={24} color="white" />
    const handleClose = () => {
      if (onLeftPress) {
        onLeftPress()
      } else {
        navigation.closeDrawer()
      }
    }
    header = (
      <Header
        left={hasBack && btnBack}
        title={title}
        onLeftPress={handleClose}
        navigation={navigation}
        right={right}
        onRightPress={onRightPress}
      />
    )
  }

  return (
    <View style={[styleSheet.sheet]}>
      {headerComponent || header}
      <Container style={[styleSheet.content]}>{contentComponent}</Container>
      {footerComponent}
    </View>
  )
}

export default SidebarContainer
