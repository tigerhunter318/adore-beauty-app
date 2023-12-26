import React from 'react'
import Container from '../ui/Container'
import Type from '../ui/Type'
import Button from '../ui/Button'
import ResponsiveImage from '../ui/ResponsiveImage'

import theme from '../../constants/theme'
import Layout from '../../constants/Layout'
import { vw } from '../../utils/dimensions'

const styles = {
  container: {
    height: Layout.window.width / 2,
    position: 'relative',
    overflow: 'hidden'
  },
  content: {
    position: 'absolute',
    bottom: 20,
    left: 20
  },
  title: {
    color: theme.white
  },
  subTitle: {
    color: theme.white,
    lineHeight: 22.5
  }
}

const RichTextShoppableImage = ({ content }) => {
  const isPrimaryButton = content.button && content.button.type && content.button.type.toLowerCase() === 'primary'
  return (
    <Container mb={2} mt={2} style={styles.container}>
      <ResponsiveImage
        src={content.banner}
        width={vw()}
        height={225}
        useAspectRatio
        styles={{
          container: {
            flexDirection: 'row',
            flex: 1,
            height: Layout.window.width / 2,
            overflow: 'hidden'
          }
        }}
      />
      <Container style={styles.content}>
        <Container mb={1}>
          <Type size={22} style={styles.title} bold>
            {content.title}
          </Type>
        </Container>
        <Container mb={1}>
          <Type size={18} style={styles.subTitle}>
            {content.subTitle}
          </Type>
        </Container>
        {content.button && (
          <Container mb={1}>
            <Button onPress={() => {}} size="large" isPrimary={isPrimaryButton} isSecondary={!isPrimaryButton}>
              {content.button.title}
            </Button>
          </Container>
        )}
      </Container>
    </Container>
  )
}

export default RichTextShoppableImage
