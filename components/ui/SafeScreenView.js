import React, { forwardRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native'
import { useSafeInsets } from '../../utils/dimensions'

const SafeScreenView = (
  {
    children,
    scroll,
    flex,
    style = {},
    contentContainerStyle = {},
    headerComponent,
    footerComponent,
    edges = ['right', 'bottom', 'left'],
    ...rest
  },
  ref
) => {
  const { top } = useSafeInsets()
  let component
  let paddingTop = 0

  if (scroll) {
    if (flex === 1) {
      contentContainerStyle.flexGrow = 1
    }
    component = (
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={contentContainerStyle}
        edges={edges}
        {...rest}
        ref={ref}
      >
        {children}
      </ScrollView>
    )
  } else {
    component = children
  }

  if (edges?.includes('top')) {
    paddingTop = top
  }

  return (
    <SafeAreaView style={[{ flex, paddingTop }, style]} edges={edges?.filter(name => name !== 'top')} {...rest}>
      {headerComponent}
      {component}
      {footerComponent}
    </SafeAreaView>
  )
}

export default forwardRef(SafeScreenView)
