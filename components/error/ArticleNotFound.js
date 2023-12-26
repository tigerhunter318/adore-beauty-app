import React, { useEffect } from 'react'
import Type from '../ui/Type'
import Container from '../ui/Container'
import CustomButton from '../ui/CustomButton'
import { vh, vw } from '../../utils/dimensions'
import remoteLog from '../../services/remoteLog'
import theme from '../../constants/theme'

const ArticleNotFound = ({ data, navigation }) => {
  useEffect(() => {
    remoteLog.logError('ArticleNotFound', data)
  }, [data])

  return (
    <Container pt={4} ph={1} height={vh(100)} backgroundColor={theme.white}>
      <Type bold size={18} center mb={1}>
        Article Issue
      </Type>
      <Type center>Sorry but we couldn't find what you're looking for.</Type>
      {navigation && (
        <Container mt={2} align="center">
          <CustomButton width={vw(60)} onPress={() => navigation.goBack()}>
            Back
          </CustomButton>
        </Container>
      )}
    </Container>
  )
}

export default ArticleNotFound
