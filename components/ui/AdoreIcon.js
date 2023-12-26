import { createIconSet } from 'react-native-vector-icons'
import glyphMap from '../../assets/fonts/adore-font-icon-map.json'

const glyphMapDecimal = Object.keys(glyphMap).reduce(
  (acc, curr) => ({
    ...acc,
    [curr]: parseInt(glyphMap[curr].substr(1), 16)
  }),
  {}
)
/*
<AdoreIcon name="account" />
 */
export default createIconSet(glyphMapDecimal, 'adore-font-icon', 'adore-font-icon.ttf')
