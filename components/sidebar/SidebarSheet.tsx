import React from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  Layout,
  LightSpeedInLeft,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight
} from 'react-native-reanimated'
import { ViewItemsButton } from '../ui/ViewItemsButton'
import SafeScreenView from '../ui/SafeScreenView'

// const TestSidebarSheetContainer = () => {
//   return (<Container border={'red'} flexGrow={1} style={{position:'absolute', top:0, width:'100%', height:'100%'}}>
//     <Container border height={90}><Type>header</Type></Container>
//     <Container border={'blue'} flexGrow={1} overflow={'hidden'}>
//       <ScrollView style={{flex:1}}>
//         {[...Array(100)].map( (o, index) => <Type key={`i-${index}`}>content {index}</Type> )}
//       </ScrollView>
//     </Container>
//     <Container border height={80}><Type>footer</Type></Container>
//   </Container>)
// }

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
    flexGrow: 1,
    backgroundColor: 'white'
  }
})
type SidebarSheetProps = {
  children?: React.ReactNode
  isAnimated?: boolean
  style?: {}
  headerComponent?: React.ReactNode
  footerComponent?: React.ReactNode
}
const SidebarSheet = ({
  children,
  style = {},
  isAnimated,
  headerComponent,
  footerComponent,
  ...rest
}: SidebarSheetProps): JSX.Element => (
  <Animated.View
    style={[styles.container, style]}
    entering={isAnimated ? SlideInRight.duration(200) : undefined}
    exiting={isAnimated ? SlideOutRight.duration(200) : undefined}
    // layout={Layout.springify()}
    {...rest}
  >
    {headerComponent}
    {children}
    {footerComponent}
  </Animated.View>
)

export default SidebarSheet
