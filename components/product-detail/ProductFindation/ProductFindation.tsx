import React, { useState, useEffect, useCallback } from 'react'
import { ScrollView, Image } from 'react-native'
import { useDispatch } from 'react-redux'
import CustomModal from '../../ui/CustomModal'
import Container from '../../ui/Container'
import { px } from '../../../utils/dimensions'
import { isSmallDevice } from '../../../utils/device'
import { getAsyncStorageItem } from '../../../utils/asyncStorage'
import ProductFindationOption from './ProductFindationOption'
import ProductFindationResult from './ProductFindationResult'
import findation from '../../../store/modules/findation'
import { useActionState } from '../../../store/utils/stateHook'
import useForm from '../../form/useForm'
import LoadingOverlay from '../../ui/LoadingOverlay'
import theme from '../../../constants/theme'

const FindationImage = require('../../../assets/images/findation_button.png')

const style = {
  loadingContainer: {
    height: 450
  },
  spinnerContainerStyle: {
    flex: 1,
    justifyContent: 'center'
  }
}

const initialValue = {
  brand: null,
  product: null,
  shade: null
}

const ProductFindation = ({ data }: any) => {
  const dispatch = useDispatch()
  const [findationResult, setFindationResult] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isDataLoaded, setDataLoaded] = useState(false)
  const embedId = useActionState('findation.embedId')
  const form = useForm(initialValue)
  const productUrl = data?.product_url

  const handleFindationClick = () => {
    form.setValue(initialValue)
    dispatch(findation.actions.reset())
    setIsVisible(true)
  }

  const handleCloseModal = () => {
    setIsVisible(false)
  }

  const handleFindMyMatch = useCallback(async () => {
    const selectedShadeId = form.getValue('shade')?.id
    const res = await dispatch(
      findation.actions.searchMatchTarget({
        embed_id: embedId,
        shade_id: selectedShadeId,
        product_url: productUrl
      })
    )
    setFindationResult(res)
    setDataLoaded(true)
  }, [dispatch, embedId, form, productUrl])

  const handleBrandChange = (item: { id: number }) => {
    form.setValue({
      brand: item,
      product: null,
      shade: null
    })
    dispatch(findation.actions.fetchProducts(item.id))
  }

  const handleProductChange = (item: { id: number }) => {
    form.setValue({
      product: item,
      shade: null
    })
    dispatch(findation.actions.fetchShades(item.id))
  }

  const handleShadeChange = (item: any) => {
    form.setValue({
      shade: item
    })
  }

  const handleInitialLoading = useCallback(async () => {
    const findationResultData = await getAsyncStorageItem('findation')
    const shadeIds = findationResultData?.shadeIds
    if (findationResultData && shadeIds) {
      await dispatch(findation.actions.shadeIds(shadeIds || []))
      if (productUrl === findationResultData?.product_url) {
        setFindationResult(findationResultData)
        setDataLoaded(true)
      } else if (shadeIds.length > 0) {
        handleFindMyMatch()
      }
    } else {
      setFindationResult(null)
      setDataLoaded(true)
    }
  }, [dispatch, handleFindMyMatch, productUrl])

  const handleAddMoreShades = () => {
    form.setValue(initialValue)
    dispatch(findation.actions.reset())
    setFindationResult(null)
  }

  const handleFetchBrands = () => {
    dispatch(findation.actions.fetchBrands())
  }

  const onMount = () => {
    dispatch(findation.actions.fetchEmbedId(productUrl))
  }

  useEffect(onMount, [productUrl])
  useEffect(() => {
    if (isVisible && embedId && !isDataLoaded) {
      handleInitialLoading()
    }
  }, [isVisible, embedId, handleInitialLoading, isDataLoaded])

  if (!embedId) {
    return null
  }

  return (
    <Container pb={2}>
      <Container pt={1} pb={1} onPress={handleFindationClick}>
        <Image source={FindationImage} style={{ width: px(200), height: px(40) }} />
      </Container>
      <CustomModal
        isVisible={isVisible}
        onClose={handleCloseModal}
        containerStyle={{ marginTop: isSmallDevice() ? 0 : 30, marginBottom: 0, backgroundColor: 'white' }}
        contentStyle={{ flex: 0, paddingVertical: 20 }}
        flex={0}
      >
        <Container>
          {isDataLoaded ? (
            <ScrollView>
              {!findationResult && (
                <ProductFindationOption
                  onBrandChange={handleBrandChange}
                  onProductChange={handleProductChange}
                  onShadeChange={handleShadeChange}
                  onFindMyMatch={handleFindMyMatch}
                  onInitialLoading={handleFetchBrands}
                  form={form}
                />
              )}
              {findationResult && (
                <ProductFindationResult
                  data={findationResult}
                  productName={data?.name}
                  onAddMoreShades={handleAddMoreShades}
                  onClose={handleCloseModal}
                />
              )}
            </ScrollView>
          ) : (
            <Container background={theme.white} style={style.loadingContainer}>
              <LoadingOverlay active={!isDataLoaded} containerStyle={style.spinnerContainerStyle} />
            </Container>
          )}
        </Container>
      </CustomModal>
    </Container>
  )
}

export default ProductFindation
