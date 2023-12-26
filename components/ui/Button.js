import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import Type, { DEFAULT_FONT } from './Type'
import { composeStyle } from '../../utils/style'
import Loading from './Loading'

const listThemeStyleSheet = {
  shadow: {
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  container: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 20,
    width: 'auto',
    backgroundColor: 'black'
  },
  containerActive: {
    backgroundColor: 'black'
  },
  text: {
    color: 'white'
  },
  labelActive: {
    color: 'white'
  }
}

const styleSheet = {
  // shadow: {
  //   shadowColor: 'black',
  //   shadowOffset: { width: 1, height: 1 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 2
  // },
  container: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    width: 'auto',
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerActive: {
    backgroundColor: 'black'
  },
  text: {
    textTransform: 'uppercase',
    color: 'white',
    textAlign: 'center'
  },
  labelActive: {
    color: 'white'
  }
}

const themeStyles = {
  primary: {
    container: {
      backgroundColor: 'white',
      borderRadius: 0,
      borderWidth: 0.5,
      borderColor: 'black'
    },
    disabledContainer: {
      borderColor: 'grey'
    },
    text: {
      color: 'black',
      fontSize: 14,
      fontFamily: `${DEFAULT_FONT}-Regular`
    },
    disabledText: {
      color: 'grey'
    },
    active: {
      container: {
        backgroundColor: 'black',
        borderColor: 'white'
      },
      text: {
        color: 'white'
      }
    }
  },
  secondary: {
    container: {
      backgroundColor: 'black'
    },
    text: {
      color: 'white',
      fontSize: 14,
      fontFamily: `${DEFAULT_FONT}-Regular`
    },
    active: {
      container: {
        backgroundColor: 'white',
        borderColor: 'black'
      },
      text: {
        color: 'black'
      }
    }
  },
  loadingSpinner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
}

const initialState = { active: false }

const Button = ({
  onPress = () => {},
  activeOpacity = 1,
  children,
  disabled = false,
  ionIcon = null,
  styles = {},
  textProps = {},
  containerStyle = {},
  textStyle = {},
  backgroundColor = null,
  color = null,
  left,
  right,
  size,
  isPrimary = false,
  isSecondary = false,
  delayPressIn = 0,
  loading,
  loadingStyles,
  loadingProps,
  ...props
}) => {
  const [state, setState] = useState(initialState)

  const handlePressIn = evt => {
    setState({ active: true })
  }

  const handlePressOut = evt => {
    setState({ active: false })
    onPress(evt)
  }

  const { active } = state

  const composedStyles = composeStyle(styleSheet, styles, active)

  let defaultTextProps = {}
  let defaultContainerStyle = {}
  let defaultTextStyle = {}
  if (size === 'large') {
    defaultTextProps = { ...defaultTextProps, size: 16, bold: true }
    defaultContainerStyle = { ...defaultContainerStyle, paddingTop: 15, paddingBottom: 15 }
  }
  if (backgroundColor) {
    defaultContainerStyle = { ...defaultContainerStyle, backgroundColor }
  }
  if (color) {
    defaultTextStyle = { ...defaultTextStyle, color }
  }

  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={activeOpacity}
      style={[
        composedStyles.container,
        active && styleSheet.shadow,
        defaultContainerStyle,
        containerStyle,
        isPrimary && themeStyles.primary.container,
        isPrimary && active && themeStyles.primary.active.container,
        isSecondary && themeStyles.secondary.container,
        isSecondary && active && themeStyles.secondary.active.container,
        disabled && themeStyles.primary.disabledContainer
      ]}
      // style={[styled.container, active && styleSheet.shadow]}
      // css={containerCss}
      delayPressIn
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...props}
    >
      {left}
      <Type
        style={[
          styleSheet.text,
          styles.text,
          defaultTextStyle,
          isPrimary && themeStyles.primary.text,
          isPrimary && active && themeStyles.primary.active.text,
          isSecondary && themeStyles.secondary.text,
          isSecondary && active && themeStyles.secondary.active.text,
          disabled && themeStyles.primary.disabledText,
          textStyle
        ]}
        {...defaultTextProps}
        {...textProps}
      >
        {children}
      </Type>
      {right}
      {loading && <Loading style={[themeStyles.loadingSpinner, loadingStyles]} {...loadingProps} />}
    </TouchableOpacity>
  )
}

export default Button
