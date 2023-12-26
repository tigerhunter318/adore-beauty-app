import { useState, useEffect } from 'react'
import uuid from 'react-native-uuid'
import { useDispatch } from 'react-redux'
import TrackPlayer from 'react-native-track-player'
import envConfig from '../../config/envConfig'
import { unixTimeStamp } from '../../utils/date'
import podcasts from '../../store/modules/podcasts'

/**
 * Consumption analytics API for third-party players
 * https://help.omnystudio.com/en/articles/2435830-consumption-analytics-api-for-third-party-players-beta
 */

const initialState = {
  Source: 'MobileApp',
  Events: [],
  Completed: true
}

const useOmnyConsumptionAPI = () => {
  const [state, setState] = useState(initialState)
  const [isSessionFinished, setIsSessionFinished] = useState(false)
  const [seqNumber, setSeqNumber] = useState(1)
  const dispatch = useDispatch()

  const updateConsumptionData = async ({ track, eventType, sendData = false }) => {
    if (track) {
      const position = await TrackPlayer.getPosition()

      const handleStateChange = prevState => {
        const lastEvent = prevState?.Events[parseInt(prevState?.Events?.length) - 1]
        const isSimilarEvent = lastEvent?.Type === eventType

        if (isSimilarEvent) {
          return prevState
        }

        setSeqNumber(seqNumber + 1)

        return {
          ...prevState,
          Events: [
            ...prevState.Events,
            {
              OrganizationId: envConfig.omny.orgID,
              ClipId: track?.id,
              Type: eventType,
              Position: position,
              SeqNumber: seqNumber,
              Timestamp: unixTimeStamp()
            }
          ]
        }
      }

      setState(handleStateChange)

      if (sendData) {
        setIsSessionFinished(true)
        setState({ ...initialState })
        setSeqNumber(1)
      }
    }
  }

  const submitData = async () => {
    const hasPairEvents = state.Events?.length % 2 === 0
    if (hasPairEvents) {
      const sessionId = uuid.v4()
      state.Events.map(event => (event.SessionId = sessionId))

      const hasUniqueClipId = [...new Set(state.Events.map(event => event.ClipId))]?.length === 1

      if (hasUniqueClipId) {
        await dispatch(podcasts.actions.submitConsumptionData(state))
      }
    }

    setIsSessionFinished(false)
  }

  const handleSession = () => {
    if (isSessionFinished) {
      submitData()
    }
  }

  useEffect(handleSession, [isSessionFinished])

  return {
    updateConsumptionData,
    seqNumber
  }
}

export default useOmnyConsumptionAPI
