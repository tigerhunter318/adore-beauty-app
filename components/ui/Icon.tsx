// @ts-nocheck
import React from 'react'
import { TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Fontisto from 'react-native-vector-icons/Fontisto'
import AdoreIcon from './AdoreIcon'
import AdoreSvgIcon from './AdoreSvgIcon'

const IconComponent = ({ type, name, color, size, ...props }) => {
  switch (type.toLowerCase()) {
    case 'ion':
      return <Ionicons name={name} size={size} color={color} {...props} />
    case 'evil':
      return <EvilIcons name={name} size={size} color={color} {...props} />
    case 'materialcommunityicons':
      return <MaterialCommunityIcons name={name} size={size} color={color} {...props} />
    case 'material':
      return <MaterialIcons name={name} size={size} color={color} {...props} />
    case 'fontisto':
      return <Fontisto name={name} size={size} color={color} {...props} />
    case 'adore':
      return <AdoreIcon name={name} size={size} color={color} {...props} />
    case 'adoresvg':
      return <AdoreSvgIcon name={name} color={color} width={size} height={size} />
    case 'fontawesome':
      return <FontAwesome5 name={name} size={size} color={color} {...props} />
    case 'simplelineicons':
      return <SimpleLineIcons name={name} size={size} color={color} {...props} />
    default:
      return null
  }
}
type IconProps = { type?: any; name?: any; color?: any; size?: any; onPress?: any; style?: any; [p: string]: any }
// type="ion" name="ios-arrow-back"
const Icon = ({
  type = 'ion',
  name = 'ios-arrow-forward',
  color = '#000000',
  size = 26,
  onPress,
  style,
  ...props
}: IconProps) => {
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress}>
        <IconComponent name={name} size={size} type={type} color={color} {...props} />
      </TouchableOpacity>
    )
  }

  return <IconComponent name={name} size={size} type={type} color={color} style={style} {...props} />
}

export default Icon
