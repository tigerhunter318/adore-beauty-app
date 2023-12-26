import React from 'react'
import PromoQuickView from '../../components/promotions/PromoQuickView'

const PromoQuickViewScreen = ({ route: { params } }: { route: { params: any } }) => <PromoQuickView {...params} />

export default PromoQuickViewScreen
