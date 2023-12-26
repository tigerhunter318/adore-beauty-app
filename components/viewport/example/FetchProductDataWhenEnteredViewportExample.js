import React, { useEffect } from 'react'
import useProductQuery from '../../../gql/useProductQuery'
import Container from '../../ui/Container'
import Type from '../../ui/Type'

/**
 * Example component on using to ViewportAware to fetch product data when a component is visible in the viewport.
 *
 <ViewportProvider lazyLoadImage>
   <ScrollView>
     <ViewportAware>
        {({ hasEnteredViewport }) => <FetchProductDataWhenEnteredViewportExample hasEnteredViewport={hasEnteredViewport} />}
     </ViewportAware>
   </ScrollView>
 </ViewportProvider>
 *
 * @param hasEnteredViewport
 * @returns {JSX.Element}
 * @constructor
 */
const FetchProductDataWhenEnteredViewportExample = ({ hasEnteredViewport }) => {
  const [fetchData, { loading, error, data }] = useProductQuery(
    {
      productIds: '1078944,1078942',
      lazyQuery: true
    },
    `qty`
  )

  useEffect(() => {
    if (hasEnteredViewport) {
      fetchData()
    }
  }, [hasEnteredViewport])

  return (
    <Container center>
      {data?.products?.map(item => (
        <Type key={item.product_id}>{item.name}</Type>
      ))}
    </Container>
  )
}

export default FetchProductDataWhenEnteredViewportExample
