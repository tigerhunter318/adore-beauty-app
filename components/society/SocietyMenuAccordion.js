import React, { useState } from 'react'
import Accordion from 'react-native-collapsible/Accordion'
import theme from '../../constants/theme'
import Container from '../ui/Container'
import Type from '../ui/Type'
import AdoreSvgIcon from '../ui/AdoreSvgIcon'

const styles = {
  containerStyle: {
    marginTop: 30,
    marginBottom: 30,
    borderTopWidth: 1,
    borderTopColor: theme.borderColor
  },
  sectionContainerStyle: {
    borderBottomWidth: 1,
    borderBottomColor: theme.borderColor
  }
}

const SocietyMenuAccordion = ({ sections, ...rest }) => {
  const [activeSections, setActiveSections] = useState([])

  const renderHeader = (section, index, isActive) => (
    <Container
      style={{
        paddingTop: 18,
        paddingBottom: 18
      }}
      rows
      align
      ph={2.5}
      justify="space-between"
    >
      <Type heading semiBold letterSpacing={1.5} size={13}>
        {section.title}
      </Type>
      <AdoreSvgIcon
        style={{
          transform: [{ rotate: isActive ? '180deg' : '0deg' }]
        }}
        name="angle-down"
        width={12}
        height={16}
      />
    </Container>
  )

  const renderContent = (section, index, isActive) => <Container center>{section.component}</Container>

  const updateSections = activeSecs => {
    setActiveSections(activeSecs)
  }

  return (
    <Container>
      <Accordion
        sections={sections}
        activeSections={activeSections}
        renderHeader={renderHeader}
        renderContent={renderContent}
        onChange={updateSections}
        underlayColor={theme.textGrey}
        containerStyle={styles.containerStyle}
        sectionContainerStyle={styles.sectionContainerStyle}
        {...rest}
      />
    </Container>
  )
}

export default SocietyMenuAccordion
