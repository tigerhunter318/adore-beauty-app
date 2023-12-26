import React from 'react'
// @ts-ignore
import ImagePlaceholderSvg from '../../assets/images/image-placeholder.svg'
import { px } from '../../utils/dimensions'

type ImagePlaceholderProps = { width?: number; displayWidth?: number }

const ImagePlaceholder = ({ width, displayWidth }: ImagePlaceholderProps) => (
  <ImagePlaceholderSvg width={displayWidth ?? px(width)} height={displayWidth ?? px(width)} />
)

export default ImagePlaceholder
