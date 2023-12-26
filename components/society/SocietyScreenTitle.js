import React from 'react'
import { SocietyLogoReverse } from './SocietyAssets'
import { px } from '../../utils/dimensions'

const SocietyScreenTitle = ({ width = 170, height = 25 }) => <SocietyLogoReverse width={px(width)} height={height} />

export default SocietyScreenTitle
