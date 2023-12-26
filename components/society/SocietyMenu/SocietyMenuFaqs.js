import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import Accordion from 'react-native-collapsible/Accordion'
import Container from '../../ui/Container'
import Type from '../../ui/Type'
import Icon from '../../ui/Icon'
import theme from '../../../constants/theme'
import { vw } from '../../../utils/dimensions'
import RichTextContent from '../../RichText/RichTextContent'

const styles = {
  sectionContainerStyle: {
    borderBottomWidth: 1,
    borderBottomColor: theme.borderColor,
    paddingTop: 18,
    paddingBottom: 18,
    height: 'auto'
  }
}

const SocietyMenuFaqs = ({ cards }) => {
  const [activeSections, setActiveSections] = useState([])

  const renderHeader = (section, index, isActive) => (
    <Container rows align justify="space-between">
      <Type style={{ width: vw(70) }} letterSpacing={1.2} size={15}>
        {section?.title}
      </Type>
      <Icon type="ion" name={isActive ? 'ios-remove' : 'ios-add'} size={22} color={theme.black} />
    </Container>
  )

  const renderContent = ({ content: data }, index, isActive) => (
    <Container mt={1} pt={2} mr={2}>
      <ScrollView>
        <RichTextContent isNested color={theme.textGreyDark} content={data} />
      </ScrollView>
    </Container>
  )

  const updateSections = activeSecs => {
    setActiveSections(activeSecs)
  }

  return (
    cards && (
      <Container
        style={{
          borderTopWidth: 1,
          borderColor: theme.borderColor,
          width: vw(100)
        }}
        center
      >
        <Container
          style={{
            width: vw(87.2)
          }}
        >
          <Accordion
            sections={cards}
            activeSections={activeSections}
            renderHeader={renderHeader}
            renderContent={renderContent}
            onChange={updateSections}
            underlayColor={theme.textGrey}
            sectionContainerStyle={styles.sectionContainerStyle}
          />
        </Container>
      </Container>
    )
  )
}

export default SocietyMenuFaqs
