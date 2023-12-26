import React, { useContext, memo } from 'react'
import { StyleSheet, View } from 'react-native'
import AutoHeightImage from 'react-native-auto-height-image'
import FastImage from 'react-native-fast-image'
import { ViewportContext } from '../viewport/ViewportContext'
import { parseQueryString } from '../../utils/format'
import ViewportAwareImage from '../viewport/ViewportAwareImage'
import ViewportAware from '../viewport/ViewportAware'
import { isDev } from '../../utils/dev'
import ImageSize from '../../constants/ImageSize'
import getImageUrl from '../../utils/getImageUrl'

const styleSheet = StyleSheet.create({
  container: {},
  image: {
    width: '100%',
    height: 'auto'
  }
})

type ImageWithAutoHeightProps = {
  src?: string | any
  width: number
  scale: number
  lazyLoadImage: boolean
  style: {}
}

/**
 * load image, extract width and height from params
 * set the width, height is set once image loaded
 *
 * @param src
 * @param width Number
 */
const ImageWithAutoHeight = ({ src, width = 300, scale, lazyLoadImage, ...rest }: ImageWithAutoHeightProps) => {
  const { w, h } = parseQueryString(src)
  const srcWidth = parseInt(`${w || ImageSize.article.content.width}`)
  const srcHeight = parseInt(`${h || ImageSize.article.content.height}`)
  const uri = getImageUrl({ src, width: srcWidth, height: srcHeight, scale })

  if (lazyLoadImage) {
    return (
      <ViewportAware>
        {({ hasEnteredViewport }) => {
          if (hasEnteredViewport) {
            return <AutoHeightImage source={{ uri }} width={width} {...rest} />
          }
          return null
        }}
      </ViewportAware>
    )
  }
  return <AutoHeightImage source={{ uri }} width={width} {...rest} />
}

type ImageComponentProps = {
  src?: string | any
  url?: string | any
  width: number
  height: any
  scale: number
  strategy: string | any
  lazyLoadImage: boolean
  imageProps: {}
  style: {}
}

const ImageComponent = ({
  url,
  src,
  style,
  scale,
  strategy,
  width,
  height,
  lazyLoadImage,
  ...rest
}: ImageComponentProps) => {
  const uri = url || getImageUrl({ src, width, height, scale, strategy })

  if (lazyLoadImage) {
    return <ViewportAwareImage style={style} {...rest} source={{ uri, loadingUri: undefined }} />
  }
  return <FastImage source={{ uri }} resizeMode="contain" style={style} {...rest} />
}

type ResponsiveImageProps = {
  src?: string | any
  url?: string | any
  width: number
  height?: any
  scale?: number
  useAspectRatio?: boolean
  displayWidth?: number
  displayHeight?: number
  strategy?: string | any
  imageProps?: {}
  styles?: { image?: any; container?: any }
}

type imageStylesProps = {
  aspectRatio?: number
  width?: number
  height?: string | number
  imageWidth?: number
}

const ResponsiveImage = ({
  src,
  styles = {},
  width,
  height,
  scale = ImageSize.scale,
  useAspectRatio,
  imageProps = {},
  url,
  displayWidth,
  displayHeight,
  strategy
}: ResponsiveImageProps) => {
  const { lazyLoadImage } = useContext(ViewportContext)

  let imageStyles: imageStylesProps = {}

  if (useAspectRatio) {
    if (width && height && height !== 'auto') {
      imageStyles.aspectRatio = width / height
    } else if (isDev()) {
      console.warn('ResponsiveImage', 'useAspectRatio requires width & height')
    }
  } else if (useAspectRatio === false) {
    imageStyles.aspectRatio = undefined
  }

  if (displayWidth) {
    imageStyles.width = displayWidth
  }

  if (displayHeight) {
    imageStyles.height = displayHeight
  }

  if (styles?.image) {
    imageStyles = {
      ...imageStyles,
      ...styles.image
    }
    delete imageStyles.imageWidth
  }

  let imageComponent = null

  if (height === 'auto') {
    imageComponent = (
      <ImageWithAutoHeight
        lazyLoadImage={lazyLoadImage}
        src={src}
        width={width}
        style={[imageStyles]}
        scale={scale}
        {...imageProps}
      />
    )
  } else {
    imageComponent = (
      <ImageComponent
        style={[styleSheet.image, imageStyles]}
        url={url}
        scale={scale}
        src={src}
        width={width}
        height={height}
        strategy={strategy}
        lazyLoadImage={lazyLoadImage}
        imageProps={imageProps}
      />
    )
  }

  return <View style={[styleSheet.container, styles.container]}>{imageComponent}</View>
}

export default memo(ResponsiveImage)
