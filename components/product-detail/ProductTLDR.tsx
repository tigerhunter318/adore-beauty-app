import React from 'react'
import { StyleSheet } from 'react-native'
import { isValidArray, isValidNumber } from '../../utils/validation'
import ReviewSummary from '../product-review/ReviewSummary'
import Type from '../ui/Type'
import Container from '../ui/Container'
import Separator from '../ui/Separator'
import Colors from '../../constants/Colors'
import AdoreSvgIcon from '../ui/AdoreSvgIcon'
import RichTextContentDescription from '../RichText/RichTextContentDescription'

const styles = StyleSheet.create({
  shortDescription: {
    paddingHorizontal: 0,
    paddingVertical: 21
  },
  customersReview: {
    backgroundColor: Colors.lightPeachColor
  },
  category: {
    marginBottom: 7
  },
  categoryList: {
    flex: 1
  },
  categoryText: {
    marginLeft: 9,
    lineHeight: 24,
    letterSpacing: 0.09
  },
  reviewContainer: {
    backgroundColor: Colors.tabIconSelected,
    borderRadius: 3,
    marginRight: 10,
    paddingHorizontal: 5,
    paddingVertical: 7
  }
})

type ProductTLDRProps = {
  data: {} | any
  onReviewPress: () => void
}

const ProductTLDR = ({ data = {}, onReviewPress }: ProductTLDRProps) => (
  <Container pt={1}>
    <Container mb={1.9} mt={2.4} style={{ borderColor: Colors.tabIconSelected, borderWidth: 1 }}>
      <Container style={{ borderBottomColor: Colors.tabIconSelected, borderBottomWidth: 1 }}>
        <Type
          heading
          bold
          center
          size={14}
          color={Colors.tabIconSelected}
          style={{
            lineHeight: 24,
            paddingVertical: 8,
            letterSpacing: 1.5
          }}
        >
          Is this for you?
        </Type>
      </Container>
      <Container style={styles.shortDescription} ph={2.1} size={13} color={Colors.darkGray} pb={0}>
        <RichTextContentDescription content={data.short_description} />
      </Container>
      <Container ph={2.1} mt={1}>
        <Container style={styles.categoryList}>
          {isValidArray(data.choices) &&
            data.choices.map((item: any, index: any) => (
              <Container rows align style={styles.category} key={`choices_${index}`}>
                <AdoreSvgIcon name="check-item" width={16} height={16} color={Colors.mediumGray} />
                <Type color={Colors.darkGray} size={13} style={styles.categoryText}>
                  {item}
                </Type>
              </Container>
            ))}
        </Container>
      </Container>
      <Container style={styles.customersReview} mt={2}>
        <Type
          heading
          bold
          center
          size={14}
          color={Colors.tabIconSelected}
          style={{
            lineHeight: 20,
            paddingVertical: 18,
            letterSpacing: 1.5
          }}
        >
          What customers say
        </Type>
        <Separator styles={undefined} />
        <Container ph={1.4} pv={1.8}>
          <Container style={{ flex: 1 }} center>
            {isValidNumber(data.recommendPercentage) && data.recommendPercentage > 0 && (
              <Container rows style={{ backgroundColor: Colors.peachColor }} ph={1} pv={0.6} mt={0.3}>
                <Type heading bold size={11}>
                  {data.recommendPercentageText ? `${data.recommendPercentageText} - ` : ''}
                  {data.recommendPercentage}%
                </Type>
                <Type size={11}> recommend</Type>
              </Container>
            )}
            {data?.reviewTotal > 0 ? (
              <Container>
                <Container rows align mt={1}>
                  <Container style={styles.reviewContainer}>
                    <Type bold color={Colors.white} style={{ minWidth: 20 }} center>
                      {data.reviewAverage}
                    </Type>
                  </Container>
                  <ReviewSummary {...data} onPress={onReviewPress} hasText={false} />
                </Container>
                <Container mt={1.2} onPress={onReviewPress}>
                  <Type letterSpacing={0.6} size={12} semiBold underline>
                    Read all reviews
                  </Type>
                </Container>
              </Container>
            ) : (
              <Type pt={data?.recommendPercentage > 0 ? 1 : 0} size={11}>
                Currently there are no reviews for this product.
              </Type>
            )}
          </Container>
        </Container>
      </Container>
    </Container>
  </Container>
)

export default ProductTLDR
