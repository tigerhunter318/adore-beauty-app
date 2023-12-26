import { applyMiddleware, combineReducers, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createLogger } from 'redux-logger'
import promiseMiddleware from 'redux-promise-middleware'
import thunkMiddleware from 'redux-thunk'

import nav from './modules/nav'
import home from './modules/home'
import cart from './modules/cart'
import emarsys from './modules/emarsys'
import customer from './modules/customer'
import wishlists from './modules/wishlists'
import apollo from './modules/apollo'
import cms from './modules/cms'
import envConfig from '../config/envConfig'
import podcasts from './modules/podcasts'
import findation from './modules/findation'

const logger = createLogger({
  collapsed: true
})

const rootReducer = combineReducers({
  nav: nav.reducer,
  home: home.reducer,
  cart: cart.reducer,
  emarsys: emarsys.reducer,
  customer: customer.reducer,
  apollo: apollo.reducer,
  wishlists: wishlists.reducer,
  cms: cms.reducer,
  podcasts: podcasts.reducer,
  findation: findation.reducer
})

const store = envConfig.enableReduxLogger
  ? createStore(rootReducer, composeWithDevTools(applyMiddleware(promiseMiddleware, thunkMiddleware, logger)))
  : createStore(rootReducer, composeWithDevTools(applyMiddleware(promiseMiddleware, thunkMiddleware)))

export default store
