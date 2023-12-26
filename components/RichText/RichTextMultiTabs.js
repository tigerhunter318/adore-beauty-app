import React from 'react'
import { fontStyles } from '../../constants/fontStyles'
import Container from '../ui/Container'
import MultiTabs from '../ui/MultiTabs'
import Type from '../ui/Type'
import RichTextMultiTabsAccordion from './RichTextMultiTabsAccordion'

const RichTextMultiTabs = ({ content }) => {
  const { displayTitle, title, tabs } = content || {}
  const tabsData = tabs?.map(tab => tab?.content)
  const tabsTiles = tabsData?.map(tab => tab?.title)

  const renderTabContent = selectedTab => {
    const tabContent = tabsData?.find(tab => tab.title === selectedTab)?.cards || tabsData?.[0]?.cards

    if (tabContent) {
      return <RichTextMultiTabsAccordion content={tabContent} selectedTab={selectedTab} />
    }
  }

  return (
    <Container pb={2}>
      {displayTitle && !!title && (
        <Type style={fontStyles.h3} semiBold center pt={2} pb={4}>
          {title}
        </Type>
      )}
      <MultiTabs tabsTiles={tabsTiles} renderTabContent={renderTabContent} />
    </Container>
  )
}

export default RichTextMultiTabs
