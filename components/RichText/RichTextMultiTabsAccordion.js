import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import Accordion from 'react-native-collapsible/Accordion'
import { vw } from '../../utils/dimensions'
import Container from '../ui/Container'
import Type from '../ui/Type'
import Icon from '../ui/Icon'
import theme from '../../constants/theme'
import RichTextContent from './RichTextContent'

const styles = {
  sectionContainerStyle: {
    borderBottomWidth: 1,
    borderBottomColor: theme.borderColor,
    paddingTop: 18,
    paddingBottom: 18,
    height: 'auto'
  }
}

const RichTextMultiTabsAccordion = ({ content, selectedTab }) => {
  const [activeTab, setActiveTab] = useState(null)
  const [activeSections, setActiveSections] = useState([])

  const renderHeader = (section, index, isActive) => (
    <Container rows align justify="space-between">
      <Type style={{ width: vw(70) }} letterSpacing={1.2} size={15}>
        {section?.title}
      </Type>
      <Icon type="ion" name={isActive ? 'ios-remove' : 'ios-add'} size={22} color={theme.black} />
    </Container>
  )

  const renderContent = ({ content: data }) => (
    <Container mt={1} pt={2} mr={2}>
      <ScrollView>
        <RichTextContent isNested color={theme.textGreyDark} content={data} />
      </ScrollView>
    </Container>
  )

  const handleTabChange = () => {
    if (activeTab !== selectedTab) {
      setActiveTab(selectedTab)
      setActiveSections([])
    }
  }

  useEffect(handleTabChange, [selectedTab])

  if (!content) return null

  return (
    <Container>
      <Accordion
        sections={content}
        activeSections={activeSections}
        renderHeader={renderHeader}
        renderContent={renderContent}
        onChange={setActiveSections}
        underlayColor={theme.textGrey}
        sectionContainerStyle={styles.sectionContainerStyle}
      />
    </Container>
  )
}

export default RichTextMultiTabsAccordion
