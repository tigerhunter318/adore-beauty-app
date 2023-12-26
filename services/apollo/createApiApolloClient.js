import createFPMLink from 'apollo-link-react-native-firebase-perf'
import perf from '@react-native-firebase/perf'
import { ReduxLink } from 'apollo-link-redux'
import { ApolloLink, HttpLink } from '@apollo/client'
import { apolloErrorLogLink, createApolloClient } from './apollo'
import envConfig from '../../config/envConfig'
import store from '../../store/store'

const createApolloLinkFrom = (uri, headers) => {
  const apolloLinkFrom = [apolloErrorLogLink, new ReduxLink(store), new HttpLink({ uri, headers })]

  if (envConfig.firebase.isApolloPerformanceMonitoringEnabled) {
    apolloLinkFrom.unshift(createFPMLink(perf, envConfig.firebase.isApolloPerformanceMonitoringDebugEnabled))
  }
  return ApolloLink.from(apolloLinkFrom)
}

export const createApiApolloClient = apiHeaders => {
  const links = {
    default: createApolloLinkFrom(envConfig.graphUri, apiHeaders),
    hasura: createApolloLinkFrom(envConfig.hasuraUri, { ...apiHeaders, 'X-Hasura-Role': 'public' })
  }

  return createApolloClient({
    link: ApolloLink.split(operation => operation.getContext().clientName === 'hasura', links.hasura, links.default)
  })
}
