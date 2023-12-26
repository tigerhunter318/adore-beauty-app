import React, { memo } from 'react'
import { ScrollView } from 'react-native'
import CustomBottomSheet from '../ui/CustomBottomSheet'
import Container from '../ui/Container'
import RichTextContentPlain from '../RichText/RichTextContentPlain'

const TermsAndConditionsContent = ({ data }: { data: [] }) => (
  <ScrollView>
    <Container ph={2} pv={1.8}>
      {data.map(({ content }: any) => (
        <RichTextContentPlain content={content} />
      ))}
    </Container>
  </ScrollView>
)

const PromoTermsAndConditions = ({ isHeaderVisible, data }: { isHeaderVisible: boolean; data: any }) => (
  <CustomBottomSheet
    title="* terms & conditions"
    isHeaderVisible={isHeaderVisible}
    content={<TermsAndConditionsContent data={data} />}
  />
)

export default memo(PromoTermsAndConditions)
