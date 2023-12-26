import React, { useState } from 'react'
import Accordion from 'react-native-collapsible/Accordion'
import RichTextContent from './RichTextContent'
import Container from '../ui/Container'
import Type from '../ui/Type'
import Icon from '../ui/Icon'
import theme from '../../constants/theme'

const styles = {
  sectionContainerStyle: {
    borderBottomWidth: 2,
    borderBottomColor: theme.darkGray,
    paddingBottom: 20,
    marginBottom: 20
  }
}

const RichTextDropdown = ({ content }) => {
  const [activeSections, setActiveSections] = useState([])

  const _renderHeader = (section, index, isActive) => (
    <Container rows justify="space-between" align style={styles.containerStyle}>
      <Type size={20} bold>
        {section.title}
      </Type>
      <Icon type="ion" name={isActive ? 'ios-remove' : 'ios-add'} size={26} color={theme.black} />
    </Container>
  )

  const _renderContent = section => (
    <Container pt={2}>
      <RichTextContent content={section.content} isNested />
    </Container>
  )

  const _updateSections = activeSecs => {
    setActiveSections(activeSecs)
  }

  return content ? (
    <Container pv={2} ph={2}>
      <Accordion
        sections={content.cards}
        activeSections={activeSections}
        renderHeader={_renderHeader}
        renderContent={_renderContent}
        onChange={_updateSections}
        underlayColor={theme.textGrey}
        sectionContainerStyle={styles.sectionContainerStyle}
      />
    </Container>
  ) : null
}

export default RichTextDropdown
