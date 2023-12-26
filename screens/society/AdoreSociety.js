import React, { memo, useEffect, useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux'
import Container from '../../components/ui/Container'
import { px, vw } from '../../utils/dimensions'
import SocietyMenuAccordion from '../../components/society/SocietyMenuAccordion'
import SocietyJoinNowButton from '../../components/society/SocietyJoinNowButton'
import Loading from '../../components/ui/Loading'
import theme from '../../constants/theme'
import { useActionState, useIsLoggedIn, useIsSocietyMember } from '../../store/utils/stateHook'
import SocietyJoinModal from '../../components/society/SocietyJoinModal'
import SocietyTermsAndConditions from '../../components/society/SocietyTermsAndConditions'
import cms from '../../store/modules/cms'
import RichTextContent from '../../components/RichText/RichTextContent'
import SocietyMenuFaqs from '../../components/society/SocietyMenu/SocietyMenuFaqs'
import SocietyMenuBenefits from '../../components/society/SocietyMenu/SocietyMenuBenefits'
import SocietyMenuLevels from '../../components/society/SocietyMenu/SocietyMenuLevels'
import searchObject from '../../utils/searchObject'
import { ViewportProvider } from '../../components/viewport/ViewportContext'
import { sanitizeContent } from '../../utils/format'
import { fontStyles } from '../../constants/fontStyles'
import { isValidArray } from '../../utils/validation'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
    position: 'relative'
  },
  scrollViewContainer: {
    flex: 1
  },
  image: {
    width: '100%',
    height: 150
  }
})

const welcomeHtmlStyles = StyleSheet.create({
  p: {
    paddingHorizontal: 0,
    marginTop: 0,
    marginBottom: 16,
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
    alignItems: 'center'
  },
  a: {
    paddingHorizontal: 0,
    marginTop: 0,
    marginBottom: 16,
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
    alignItems: 'center'
  },
  h5: {
    textAlign: 'center',
    paddingHorizontal: 0,
    marginBottom: 0,
    fontSize: 16,
    lineHeight: 22,
    borderWidth: 1
  }
})
const textStyle = {
  padding: 0,
  color: theme.black,
  textAlign: 'center'
}
const styleProps = {
  p: {
    style: {
      ...textStyle,
      fontSize: undefined, // use StyleSheet value
      lineHeight: undefined
    }
  },
  a: {
    style: {
      ...textStyle,
      ...welcomeHtmlStyles.a
    }
  },
  strong: {
    style: {
      ...textStyle
    }
  },
  h1: {
    style: {
      ...textStyle,
      ...fontStyles.h1,
      marginBottom: 10,
      marginTop: 10
    }
  },
  h2: {
    style: {
      ...textStyle,
      marginBottom: 10,
      marginTop: 0
    }
  },
  h5: {
    style: {
      ...textStyle,
      marginBottom: 10,
      marginTop: 0
    }
  }
}

const SocietyHtmlBlock = ({ content }) => (
  <Container style={{ maxWidth: 340, alignSelf: 'center' }}>
    <RichTextContent
      content={sanitizeContent(content)}
      htmlStyleSheet={welcomeHtmlStyles}
      styleProps={styleProps}
      imageContainerStyle={{
        padding: 0,
        margin: 0,
        marginTop: 0,
        marginBottom: 10,
        paddingHorizontal: 0,
        alignItems: 'center'
      }}
      imageProps={{ width: px(325), height: 'auto', useAspectRatio: false }}
      svgContainerStyle={{ padding: 0, margin: 0, marginTop: 10, marginBottom: 16 }}
      svgProps={{ width: px(325), height: px(44), fill: 'red' }}
    />
  </Container>
)

const getSectionBlocks = content => {
  const sections = {
    body: [],
    cards: [],
    footer: []
  }

  const firstCardIndex = content.findIndex(
    object => !!(object?.content?.title && object?.content?.cardStyle && object?.content?.cards)
  )
  const lastCardIndex = content.findLastIndex(
    object => !!(object?.content?.title && object?.content?.cardStyle && object?.content?.cards)
  )

  sections.body = content.filter((object, index) => index < firstCardIndex && object?.content?.html)
  sections.footer = content.filter((object, index) => index > lastCardIndex && object?.content?.html)

  return sections
}
const getContentCards = content => {
  const titles = []
  searchObject(content, (object, key, value) => {
    if (object?.content?.title && object?.content?.cardStyle && object?.content?.cards) {
      titles.push({
        ...object.content
      })
    }
  })
  return titles
}

const MenuSections = ({ content, onJoinNow, isSocietyMember }) => {
  const contentCards = getContentCards(content)
  const contentBlocks = {
    benefitComparison: cards => (
      <SocietyMenuLevels
        onPress={onJoinNow}
        isSocietyMember={isSocietyMember}
        cards={cards}
        containerStyle={{
          borderTopWidth: 1,
          borderColor: theme.borderColor,
          width: vw(100)
        }}
      />
    ),
    imageCardVertical: cards => <SocietyMenuBenefits cards={cards} />,
    dropDown: cards => <SocietyMenuFaqs cards={cards} />
  }
  const menuItems = []
  contentCards.forEach(item => {
    const key = item.cardStyle
    // console.log('122', '', '', item.title, item)
    const component = contentBlocks[key]
    if (component) {
      menuItems.push({
        title: item.title,
        component: component(item.cards)
      })
    }
  })
  menuItems.push({
    title: 'TERMS AND CONDITIONS',
    component: <SocietyTermsAndConditions />
  })
  return menuItems
}

const AdoreSociety = ({ navigation, route }) => {
  const [isModalVisible, setModalVisibility] = useState(false)
  const isPending = useActionState('cms.fetch.pending')
  const isSocietyMember = useIsSocietyMember()
  const isLoggedIn = useIsLoggedIn()
  const dispatch = useDispatch()
  const content = useActionState('cms.articles.adore-society.postContent')

  const handleMount = () => {
    dispatch(cms.actions.fetch('adore-society'))
  }
  useEffect(handleMount, [dispatch])

  if (!content) return null

  const handleJoinNow = () => {
    if (isLoggedIn) {
      setModalVisibility(true)
    } else {
      navigation.navigate('Login', { goBack: true })
    }
  }

  const handleCloseModal = () => setModalVisibility(false)

  const sectionBlocks = getSectionBlocks(content)
  const sections = MenuSections({ content, isSocietyMember, onJoinNow: handleJoinNow })

  return (
    <Container style={styles.container}>
      <ViewportProvider lazyLoadImage>
        <ScrollView
          style={styles.scrollViewContainer}
          contentContainerStyle={styles.contentContainer}
          scrollEventThrottle={8}
          testID="AdoreSocietyScreen"
        >
          {sectionBlocks?.body?.map((item, index) => (
            <SocietyHtmlBlock key={`html-body-${index}`} content={item?.content?.html} index={index} />
          ))}
          {!isSocietyMember && (
            <Container center>
              <SocietyJoinNowButton width={200} mt={2} onPress={handleJoinNow} name="join now" />
            </Container>
          )}
          {isPending && <Loading style={{ marginTop: 30 }} animating />}
          {content && sections?.length && <SocietyMenuAccordion sections={sections} renderChildrenCollapsed={false} />}
          {isValidArray(sectionBlocks?.footer) && (
            <Container style={{ maxWidth: 340, alignSelf: 'center' }} mb={3}>
              {sectionBlocks.footer.map((item, index) => (
                <SocietyHtmlBlock key={`html-footer-${index}`} content={item?.content?.html} index={index} />
              ))}
            </Container>
          )}
          <SocietyJoinModal navigation={navigation} isVisible={!!isModalVisible} onClose={handleCloseModal} />
        </ScrollView>
      </ViewportProvider>
    </Container>
  )
}

export default memo(AdoreSociety)
