import {
  useQuery,
  useLazyQuery,
  QueryHookOptions,
  LazyQueryResultTuple,
  OperationVariables,
  QueryResult,
  DocumentNode
} from '@apollo/client'
import { ApolloClient } from '@apollo/client/core/ApolloClient'
import { ApolloQueryResult } from '@apollo/client/core/types'
import { QueryOptions } from '@apollo/client/core/watchQueryOptions'
import { apolloClient } from '../../../services/apollo/apollo'

export const useLazyHasuraQuery = (
  query: DocumentNode,
  options: QueryHookOptions
): LazyQueryResultTuple<any, OperationVariables> =>
  useLazyQuery(query, {
    context: { clientName: 'hasura' },
    ...options
  })

const useHasuraQuery = (query: DocumentNode, options: QueryHookOptions): QueryResult =>
  useQuery(query, {
    context: { clientName: 'hasura' },
    ...options
  })

export const hasuraQuery = (options: QueryOptions): Promise<ApolloQueryResult<any>> => {
  const client = apolloClient() as ApolloClient<unknown>
  return client.query({ context: { clientName: 'hasura' }, ...options })
}

export default useHasuraQuery
