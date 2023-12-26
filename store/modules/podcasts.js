import axios from 'axios'
import { createRequestActions } from './utils/requestAction'
import { actionPayload, asyncActionPayload, createActionsReducer } from '../utils/createActionsReducer'
import envConfig from '../../config/envConfig'
import { useActionState } from '../utils/stateHook'
import { now } from '../../utils/date'
import { compareDate } from '../../utils/sort'

const namespace = 'podcasts'

const initialState = {
  programs: {},
  programClips: {},
  fetchedAt: null
}

const omnyApiInstance = axios.create({ baseURL: 'https://omny.fm' })

const omnyRequest = asyncActionPayload((endpoint, payload = {}, config = {}) => {
  const requestObj = {
    ...config,
    url: endpoint
  }
  if (config.method && config.method.toLowerCase() !== 'get') {
    requestObj.data = payload
  }
  return omnyApiInstance.request(requestObj)
})

const programs = actionPayload(payload => payload)
const programClips = actionPayload(payload => payload)
const fetchedAt = actionPayload(payload => payload)

export const useAllProgramsClips = () => {
  const allProgramsClips = useActionState(`podcasts.programClips`)
  if (allProgramsClips) {
    const merged = Object.entries(allProgramsClips)
      .flatMap(program => program?.[1]?.clips)
      .sort(compareDate('PublishedUtc'))
    return merged
  }
  return []
}

const fetchProgramClips = ({ programId, cursor = 1, pageSize = 10 }) => async (dispatch, getState) => {
  const endpoint = `/api/orgs/${envConfig.omny.orgID}/programs/${programId}/clips?cursor=${cursor}&pageSize=${pageSize}`
  const response = await dispatch(requestGet(endpoint, { cursor, pageSize, programId, type: 'program-clips' }))
  return response?.value
}

const fetchPrograms = () => async (dispatch, getState) => {
  const endpoint = `/api/orgs/${envConfig.omny.orgID}/programs`
  const response = await dispatch(requestGet(endpoint, { type: 'programs' }))
  return response?.value
}

const fetchPodcasts = (pageSize = 3) => async (dispatch, getState) => {
  const response = await dispatch(fetchPrograms({ pageSize }))
  const programsData = response?.data?.Programs

  if (programsData) {
    await Promise.all(
      programsData?.map(async program => {
        await dispatch(
          fetchProgramClips({
            programId: program.Id,
            pageSize
          })
        )
      })
    )
  }
}

const fetchClipDetails = ({ url }) => async (dispatch, getState) => {
  if (/(omny.fm)/.test(url)) {
    const [programSlug, clipSlug] = url.split('shows/')?.[1]?.split('/')

    if (programSlug && clipSlug) {
      const endpoint = `/shows/${programSlug}/${clipSlug}.json`
      const response = await dispatch(requestGet(endpoint))
      return response?.value?.data
    }
  }
}

const submitConsumptionData = payload => async (dispatch, getState) => {
  const endpoint = `https://traffic.omny.fm/api/consumption/events?organizationId=${envConfig.omny.orgID}`
  const response = await dispatch(requestPost(endpoint, payload))
  return response?.value?.data
}

const actionCreators = {
  programs,
  programClips,
  fetchedAt,
  request: omnyRequest
}

const actions = {
  fetchPrograms,
  fetchProgramClips,
  fetchPodcasts,
  fetchClipDetails,
  submitConsumptionData
}

const reduceProgramClips = (state, newState, action) => {
  const data = action?.payload?.data

  if (data) {
    const { cursor, programId, pageSize } = action.meta.payload
    const { Clips: clips, Cursor: nextCursor } = data || {}
    const storedClips = state?.programClips[programId]?.clips || []
    const nextProgramClips = { ...state?.programClips }
    const nextClips = cursor <= 1 ? clips : [...storedClips, ...clips]

    nextProgramClips[programId] = {
      programId,
      clips: nextClips.map((item, i) => ({ index: i, ...item })),
      cursor,
      nextCursor: parseInt(nextCursor)
    }

    return {
      ...newState,
      pageSize,
      fetchedAt: now(),
      programClips: nextProgramClips
    }
  }
}

const reducePrograms = (state, newState, action) => {
  const data = action?.payload?.data
  if (data) {
    const { Programs: programsData } = data || {}
    const { pageSize } = action.meta.payload

    const podcastsData = programsData?.reduce((obj, item) => {
      obj[item?.Id] = item
      return obj
    }, {})
    return {
      ...newState,
      pageSize,
      fetchedAt: now(),
      programs: podcastsData
    }
  }

  return { ...newState }
}

const reducer = (state, action) => {
  let newState = module.reducer(state, action)
  const type = action?.meta?.payload?.type

  if (action.type === `${namespace}/request_FULFILLED`) {
    if (type === 'program-clips') {
      newState = reduceProgramClips(state, newState, action)
    }
    if (type === 'programs') {
      newState = reducePrograms(state, newState, action)
    }
  }

  return newState
}

const module = createActionsReducer(namespace, actionCreators, initialState, {}, actions)

const { requestGet, requestPost } = createRequestActions(module)

export default { namespace, actions: module.actions, reducer }
