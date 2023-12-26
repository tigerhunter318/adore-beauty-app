import React from 'react'
import { View } from 'react-native'
import ContentLoader, { Facebook, Rect, Circle } from 'react-content-loader/native'
import { vh, vw } from '../../utils/dimensions'
import Container from './Container'

const styleSheet = {
  container: {
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'center'
  }
}

const px = (val, width, baseWidth = 400) => (val * (width / baseWidth)).toString()

const ButtonList = ({ width = 400, height = 160, rows = 5, columns = 2 }) => (
  <ContentLoader height={height} width={width} speed={2} primaryColor="#f3f3f3" secondaryColor="#ecebeb" animate>
    <Rect x={px('10', width)} y="10" rx="10" ry="10" width={px('180', width)} height="20" />
    <Rect x={px('10', width)} y="40" rx="10" ry="10" width={px('180', width)} height="20" />
    <Rect x={px('10', width)} y="70" rx="10" ry="10" width={px('180', width)} height="20" />
    <Rect x={px('10', width)} y="100" rx="10" ry="10" width={px('180', width)} height="20" />
    <Rect x={px('10', width)} y="130" rx="10" ry="10" width={px('180', width)} height="20" />
    <Rect x={px('210', width)} y="10" rx="10" ry="10" width={px('180', width)} height="20" />
    <Rect x={px('210', width)} y="40" rx="10" ry="10" width={px('180', width)} height="20" />
    <Rect x={px('210', width)} y="70" rx="10" ry="10" width={px('180', width)} height="20" />
    <Rect x={px('210', width)} y="100" rx="10" ry="10" width={px('180', width)} height="20" />
    <Rect x={px('210', width)} y="130" rx="10" ry="10" width={px('180', width)} height="20" />
  </ContentLoader>
)

const ArticlesGridItem = ({ y = 10 }) => (
  <>
    {/* left column */}
    <Rect x={0} y={y} rx="0" ry="0" width={vw(44)} height="140" />
    <Rect x={0} y={y + 160} width={vw(44)} height="6" rx="3" />
    <Rect x={0} y={y + 185} width={vw(44)} height="6" rx="3" />
    <Rect x={0 + 0} y={y + 210} width={vw(44)} height="6" rx="3" />
    {/* right column */}
    <Rect x={vw(46)} y={y} rx="0" ry="0" width={vw(45)} height="140" />
    <Rect x={vw(46)} y={y + 160} width={vw(44)} height="6" rx="3" />
    <Rect x={vw(46)} y={y + 185} width={vw(44)} height="6" rx="3" />
    <Rect x={vw(46)} y={y + 210} width={vw(44)} height="6" rx="3" />
  </>
)

const ArticlesGrid = ({ width = 300, height = vh(100) }) => (
  <Container style={{ position: 'absolute', top: 10 }}>
    <ContentLoader height={height} width={width} speed={2} primaryColor="#f3f3f3" secondaryColor="#ecebeb" animate>
      <ArticlesGridItem y={20} />
      <ArticlesGridItem y={285} />
      <ArticlesGridItem y={570} />
    </ContentLoader>
  </Container>
)

const ProductGridItem = ({ y = 10 }) => (
  <>
    {/* left column */}
    <Rect x={0} y={y} rx="0" ry="0" width={vw(44)} height="140" />
    <Rect x={0} y={y + 160} width={vw(44)} height="6" rx="3" />
    <Rect x={0} y={y + 185} width={vw(44)} height="6" rx="3" />
    <Rect x={0 + 0} y={y + 210} width={vw(44)} height="6" rx="3" />
    <Rect x={0} y={y + 240} rx="0" ry="0" width={vw(22.5)} height="45" />
    <Rect x={vw(21.5)} y={y + 240} rx="0" ry="0" width={vw(22.5)} height="45" />
    {/* right column */}
    <Rect x={vw(46)} y={y} rx="0" ry="0" width={vw(45)} height="140" />
    <Rect x={vw(46)} y={y + 160} width={vw(44)} height="6" rx="3" />
    <Rect x={vw(46)} y={y + 185} width={vw(44)} height="6" rx="3" />
    <Rect x={vw(46)} y={y + 210} width={vw(44)} height="6" rx="3" />
    <Rect x={vw(46)} y={y + 240} rx="0" ry="0" width={vw(22.5)} height="45" />
    <Rect x={vw(67.5)} y={y + 240} rx="0" ry="0" width={vw(22.5)} height="45" />
  </>
)

const ProductGrid = ({ width = 300, height = vh(100) }) => (
  <Container style={{ position: 'absolute', top: 10 }}>
    <ContentLoader height={height} width={width} speed={2} primaryColor="#f3f3f3" secondaryColor="#ecebeb" animate>
      <Rect x="0" y="0" width="100%" height="38" rx="3" />
      <ProductGridItem y={60} />
      <ProductGridItem y={365} />
      <ProductGridItem y={680} />
    </ContentLoader>
  </Container>
)

const SearchProductGrid = ({ width = vw(100), height = vh(100) }) => (
  <ContentLoader height={height} width={width} speed={2} primaryColor="#f3f3f3" secondaryColor="#ecebeb" animate>
    <ProductGridItem y={0} />
    <ProductGridItem y={305} />
    <ProductGridItem y={610} />
  </ContentLoader>
)

const BrandBanner = ({ width = '100%', height = 83 }) => (
  <ContentLoader height={height} width={width} speed={2} primaryColor="#f3f3f3" secondaryColor="#ecebeb" animate>
    <Rect x="0" y="0" width="100%" height="65" rx="3" />
  </ContentLoader>
)

const ProductCarousel = ({ width = 300, height = 340, ...props }) => (
  <ContentLoader
    height={height}
    width={width}
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
    animate
    {...props}
  >
    <Rect x="15%" y="0" width="70%" height="20" rx="3" />
    <Rect x="0" y="55" width="100%" height={height} />
  </ContentLoader>
)

const ProductCarouselWithoutTitle = ({ width = 300, height = 340, ...props }) => (
  <ContentLoader
    height={height}
    width={width}
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
    animate
    {...props}
  >
    <Rect x="0" y="0" width="100%" height={height} />
  </ContentLoader>
)

const Article = ({ width, height = 200, ...props }) => (
  <ContentLoader viewBox={`0 0 ${width} ${height}`} width={width} height={height} {...props}>
    <Rect x="90" y="60" width="88" height="6" rx="3" />
    <Rect x="90" y="35" width="120" height="6" rx="3" />
    <Rect x="90" y="10" width="120" height="6" rx="3" />
    <Rect x="0" y="85" width="410" height="6" rx="3" />
    <Rect x="0" y="110" width="380" height="6" rx="3" />
    <Rect x="0" y="135" width="178" height="6" rx="3" />
    <Circle cx="35" cy="40" r="35" />
  </ContentLoader>
)

const BeautyIQArticle = ({ width, height = 200, ...props }) => (
  <ContentLoader viewBox={`0 0 ${width} ${height}`} width={width} height={height} {...props}>
    {/* image */}
    <Rect x="0" y="0" width="100%" height="285" />
    {/* text */}
    <Rect x="0" y="300" width="100%" height="6" rx="3" />
    <Rect x="0" y="315" width="25%" height="6" rx="3" />
    <Rect x="20%" y="315" width="80%" height="6" rx="3" />
    <Rect x="0" y="330" width="65%" height="6" rx="3" />
    <Rect x="68%" y="330" width="35%" height="6" rx="3" />
    <Rect x="0" y="345" width="40%" height="6" rx="3" />
  </ContentLoader>
)

const ProductMain = ({ width, height = 200, ...props }) => (
  <ContentLoader viewBox={`0 0 ${width} ${height}`} width={width} height={height} {...props}>
    {/* title */}
    <Rect x="0" y="15" width="65%" height="7" rx="3" />
    <Rect x="0" y="45" width="85%" height="7" rx="3" />
    <Rect x="0" y="70" width="40%" height="7" rx="3" />
    {/* reviews / share  */}

    <Rect x="0" y="115" width="25%" height="6" rx="3" />
    <Rect x="28%" y="115" width="29%" height="6" rx="3" />
    {/* image */}
    <Rect x="0" y="155" width="100%" height="320" />
    {/* Price */}
    <Rect x="0" y="520" width="25%" height="7" rx="3" />
    {/* Stock Message */}
    <Rect x="0" y="570" width="100%" height="55" rx="3" />
    {/* text */}
    <Rect x="0" y="650" width="100%" height="6" rx="3" />
    <Rect x="0" y="675" width="65%" height="6" rx="3" />
    <Rect x="68%" y="675" width="35%" height="6" rx="3" />
    <Rect x="0" y="700" width="40%" height="6" rx="3" />
  </ContentLoader>
)

const ProductQuickView = ({ width, height = 200, ...props }) => (
  <ContentLoader viewBox={`0 0 ${width} ${height}`} width={width} height={height} {...props}>
    {/* title */}
    <Rect x="0" y="15" width="55%" height="7" rx="3" />
    <Rect x="0" y="45" width="75%" height="7" rx="3" />
    <Rect x="0" y="70" width="30%" height="7" rx="3" />
    {/* reviews / share  */}

    <Rect x="0" y="115" width="25%" height="6" rx="3" />
    <Rect x="28%" y="115" width="29%" height="6" rx="3" />
    {/* image */}
    <Rect x="0" y="155" width="100%" height="320" />
    {/* Stock Message */}
    <Rect x="0" y="520" width="100%" height="55" rx="3" />
    <Rect x="20%" y="600" width="60%" height="10" rx="3" />
  </ContentLoader>
)

const Post = ({ width, height = 200, ...props }) => (
  <ContentLoader viewBox={`0 0 ${width} ${height}`} width={width} height={height} {...props}>
    {/* title */}
    <Rect x="15%" y="15" width="70%" height="7" rx="3" />
    <Rect x="5%" y="45" width="90%" height="7" rx="3" />
    <Rect x="10%" y="70" width="80%" height="7" rx="3" />
    <Rect x="5%" y="95" width="90%" height="7" rx="3" />
    <Rect x="20%" y="120" width="60%" height="7" rx="3" />
    {/* avatar  */}
    <Circle cx="21" cy="212" r="21" />
    <Rect x="53" y="202" width="150" height="6" rx="3" />
    <Rect x="53" y="218" width="65" height="5" rx="3" />
    {/* image */}
    <Rect x="0" y="275" width="100%" height="285" />
    {/* text */}
    <Rect x="0" y="590" width="100%" height="6" rx="3" />
    <Rect x="0" y="615" width="25%" height="6" rx="3" />
    <Rect x="23%" y="615" width="75%" height="6" rx="3" />
    <Rect x="0" y="640" width="65%" height="6" rx="3" />
    <Rect x="68%" y="640" width="35%" height="6" rx="3" />
    <Rect x="0" y="665" width="40%" height="6" rx="3" />
  </ContentLoader>
)

const RecommendedProducts = ({ width, height = 200, ...props }) => (
  <ContentLoader height={height} width={width} {...props}>
    <Rect x="0" y="0" width="33%" height={height} />
    <Rect x="33.5%" y="0" width="33%" height={height} />
    <Rect x="67%" y="0" width="34%" height={height} />
  </ContentLoader>
)

const Test = () => (
  <ContentLoader>
    <Rect x="10" y="10" rx="10" ry="10" width="180" height="20" />
  </ContentLoader>
)

const Promotions = ({ width, height = 315 }) => (
  <ContentLoader viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
    <Rect x="12%" y="0" width="76%" height={height} rx="3" />
  </ContentLoader>
)

const SearchSuggestions = ({ width, height = vh(100) }) => (
  <ContentLoader height={height} width={width} animate>
    <Rect x="0" y="0" width="33%" height="200" />
    <Rect x="33.5%" y="0" width="33%" height="200" />
    <Rect x="67%" y="0" width="34%" height="200" />
    <Rect x="0" y="253" width="25%" height="6" rx="3" />
    <Rect x="0" y="303" width="20%" height="6" rx="3" />
    <Rect x="0" y="338" width="40%" height="6" rx="3" />
    <Rect x="0" y="373" width="55%" height="6" rx="3" />
    <Rect x="0" y="408" width="35%" height="6" rx="3" />
    <Rect x="0" y="443" width="25%" height="6" rx="3" />
    <Rect x="0" y="508" width="15%" height="6" rx="3" />
    <Rect x="0" y="553" width="20%" height="6" rx="3" />
    <Rect x="0" y="588" width="40%" height="6" rx="3" />
    <Rect x="0" y="623" width="65%" height="6" rx="3" />
    <Rect x="0" y="648" width="35%" height="6" rx="3" />
    <Rect x="0" y="683" width="45%" height="6" rx="3" />
    <Rect x="0" y="718" width="25%" height="6" rx="3" />
  </ContentLoader>
)

const SearchSuggestionsHits = ({ width, height = 160 }) => (
  <ContentLoader height={height} width={width} animate>
    <Rect x="0" y="0" width="20%" height="6" rx="3" />
    <Rect x="0" y="35" width="40%" height="6" rx="3" />
    <Rect x="0" y="70" width="55%" height="6" rx="3" />
    <Rect x="0" y="105" width="35%" height="6" rx="3" />
    <Rect x="0" y="140" width="25%" height="6" rx="3" />
  </ContentLoader>
)

const ResultsCount = ({ width = '100%', height = 100 }) => (
  <ContentLoader
    height={height}
    width={width}
    speed={2}
    style={{ position: 'absolute' }}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
    animate
  >
    <Rect x="0" y="10" width="100%" height="38" rx="3" />
  </ContentLoader>
)

const ContentLoading = ({ type = 'Facebook', width = vw(90), styles = {}, ...props }) => {
  let component = <Facebook width={width} height={20} />

  switch (type) {
    case 'ButtonList':
      component = <ButtonList width={width} {...props} />
      break
    case 'Test':
      component = <Test width={width} {...props} />
      break
    case 'Promotions':
      component = <Promotions width={width} {...props} />
      break
    case 'ArticlesGrid':
      component = <ArticlesGrid width={width} {...props} />
      break
    case 'ProductGrid':
      component = <ProductGrid width={width} {...props} />
      break
    case 'SearchProductGrid':
      component = <SearchProductGrid width={width} {...props} />
      break
    case 'ProductMain':
      component = <ProductMain width={width} {...props} />
      break
    case 'ProductQuickView':
      component = <ProductQuickView width={width} {...props} />
      break
    case 'RecommendedProducts':
      component = <RecommendedProducts width={width} {...props} />
      break
    case 'ProductCarousel':
      component = <ProductCarousel width={width} {...props} />
      break
    case 'ProductCarouselWithoutTitle':
      component = <ProductCarouselWithoutTitle width={width} {...props} />
      break
    case 'Article':
      component = <Article width={width} {...props} />
      break
    case 'BrandBanner':
      component = <BrandBanner width={width} {...props} />
      break
    case 'Post':
      component = <Post width={width} {...props} />
      break
    case 'SearchSuggestions':
      component = <SearchSuggestions width={width} {...props} />
      break
    case 'SearchSuggestionsHits':
      component = <SearchSuggestionsHits width={width} {...props} />
      break
    case 'ResultsCount':
      component = <ResultsCount width={width} {...props} />
      break
    case 'BeautyIQArticle':
      component = <BeautyIQArticle width={width} {...props} />
      break
    default:
      component = <Facebook width={width} />
  }
  return <View style={[styleSheet.container, styles.container]}>{component}</View>
}

export default ContentLoading
