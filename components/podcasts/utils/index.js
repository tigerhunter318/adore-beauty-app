import { formatDate } from '../../../utils/date'
import { isValidObject } from '../../../utils/validation'

export const formatEpisodeTrackData = ({ episode, programName }) => {
  if (!isValidObject(episode)) return {}

  const {
    Id: id,
    ImageUrl: image,
    AudioUrl: audio,
    Description: description,
    DescriptionHtml: content,
    Title: title,
    PublishedUrl: shareLink,
    PublishedUtc: publishedAt,
    DurationSeconds
  } = episode || {}

  const thumbnail = image?.replace(/(size=Medium)/gi, 'size=Small')
  const duration = Math.round(DurationSeconds / 60)

  const publishDate = formatDate(publishedAt)

  const track = {
    id,
    title,
    duration,
    artist: programName || 'Adore Beauty',
    url: audio?.split('?')?.[0],
    thumbnail,
    artwork: image,
    ...episode
  }

  return {
    id,
    thumbnail,
    image,
    audio,
    description,
    content,
    title,
    shareLink,
    publishDate,
    duration,
    track,
    programName,
    publishedAt
  }
}
