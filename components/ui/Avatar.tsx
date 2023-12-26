import React from 'react'
import Container from './Container'
import ResponsiveImage from './ResponsiveImage'
import Type from './Type'
import theme from '../../constants/theme'
import AdoreSvgIcon from './AdoreSvgIcon'
import ImageSize from '../../constants/ImageSize'

const styles = {
  name: {
    lineHeight: 15,
    letterSpacing: 0.9,
    marginLeft: 11
  }
}

type AvatarProps = {
  url?: string
  name?: string
  background?: string
  publishDate?: string
  hasRoundEdges?: boolean
  hasText?: boolean
  size?: number
}

const Avatar = ({
  url,
  name,
  background,
  publishDate,
  hasRoundEdges = true,
  hasText = true,
  size = ImageSize.article.avatar.width
}: AvatarProps) => (
  <Container rows align>
    {url ? (
      <Container background={background}>
        <ResponsiveImage
          width={size}
          height={size}
          src={url}
          useAspectRatio
          styles={{
            image: {
              width: size,
              height: size,
              resizeMode: 'cover',
              borderRadius: hasRoundEdges ? size / 2 : 0
            }
          }}
        />
      </Container>
    ) : (
      <Container
        style={{
          width: size,
          height: size,
          overflow: 'hidden',
          borderRadius: hasRoundEdges ? size / 2 : 0
        }}
        background={theme.backgroundLightGrey}
        align
        justify
      >
        <AdoreSvgIcon name="Account" width={size} height={size} color={theme.lighterBlack} />
      </Container>
    )}
    {hasText && (
      <Container>
        {publishDate ? (
          <>
            {!!name && (
              <Type size={12} color={theme.lighterBlack} style={styles.name} numberOfLines={1}>
                by{' '}
                <Type semiBold letterSpacing={1}>
                  {name}
                </Type>
              </Type>
            )}
            <Type heading size={9} pt={0.2} color={theme.textGreyDark} style={styles.name}>
              {publishDate.replace(/-/gi, ' ')}
            </Type>
          </>
        ) : (
          <Type heading size={12} color={theme.lighterBlack} style={styles.name}>
            {name}
          </Type>
        )}
      </Container>
    )}
  </Container>
)

export default Avatar
