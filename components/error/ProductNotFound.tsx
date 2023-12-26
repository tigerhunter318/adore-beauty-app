import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import Type from '../ui/Type'
import Container from '../ui/Container'
import CustomButton from '../ui/CustomButton'
import { px, vh, vw } from '../../utils/dimensions'
import remoteLog from '../../services/remoteLog'
import { getRemoteConfigBoolean } from '../../services/useRemoteConfig'

type ProductNotFoundProps = {
  data: {}
  contentHeight?: number
  onRetry?: Function
  loading?: boolean
}
const ProductNotFound = ({ data, contentHeight = vh(80), onRetry, loading }: ProductNotFoundProps) => {
  const navigation = useNavigation()

  useEffect(() => {
    const logProductNotFound = getRemoteConfigBoolean('log_product_not_found')
    if (logProductNotFound) {
      remoteLog.logError('ProductNotFound', data)
    }
  }, [data])

  return (
    <Container
      style={{
        height: contentHeight,
        justifyContent: 'center'
      }}
      ph={2}
    >
      <Type bold size={18} center mb={1}>
        Product Issue
      </Type>
      <Type center>
        Sorry, it seems there is an issue with this product, we're looking into it and will have it fixed soon.
      </Type>

      {navigation && (
        <Container mt={2} center rows justify="center">
          <CustomButton width={px(100)} onPress={() => navigation.goBack()}>
            Back
          </CustomButton>
          {!!onRetry && (
            <Container ml={1}>
              <CustomButton width={px(100)} onPress={onRetry} background="white" loading={loading}>
                Retry
              </CustomButton>
            </Container>
          )}
        </Container>
      )}
    </Container>
  )
}

export default ProductNotFound
