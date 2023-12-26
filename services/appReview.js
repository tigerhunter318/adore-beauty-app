import * as StoreReview from 'react-native-store-review'
import { getAsyncStorageItem, setAsyncStorageItem } from '../utils/asyncStorage'
import { monthsFromNow, utcNow } from '../utils/date'
import { deepClone } from '../utils/object'
import envConfig from '../config/envConfig'

const namespace = 'in_app_review_info'

const hasPeriodPassed = lastRatedDate => !lastRatedDate || (lastRatedDate && monthsFromNow(lastRatedDate, true) > 3)

const isOverCount = cnt => cnt > 4

const updateReviewInfo = async (items = {}) => {
  const reviewInfo = await getAsyncStorageItem(namespace)
  await setAsyncStorageItem(namespace, { ...deepClone(reviewInfo || {}), ...items })
}

const isAvailable = () => envConfig.enableAppReview && StoreReview.isAvailable

const rateApp = async () => {
  if (isAvailable()) {
    const reviewInfo = await getAsyncStorageItem(namespace)
    const lastRatedDate = reviewInfo?.lastRatedDate

    if (hasPeriodPassed(lastRatedDate)) {
      StoreReview.requestReview()
      updateReviewInfo({ lastRatedDate: utcNow() })
    }
  }
}

const rateAppFromWishlist = async () => {
  if (isAvailable()) {
    const reviewInfo = await getAsyncStorageItem(namespace)
    const lastRatedDate = reviewInfo?.lastRatedDate
    const wishlistCnt = reviewInfo?.wishlistCnt || 0

    if (hasPeriodPassed(lastRatedDate) && isOverCount(wishlistCnt)) {
      StoreReview.requestReview()
      updateReviewInfo({ lastRatedDate: utcNow(), wishlistCnt: 0 })
    } else {
      updateReviewInfo({ wishlistCnt: wishlistCnt + 1 })
    }
  }
}

const rateAppFromArticle = async id => {
  if (isAvailable()) {
    const reviewInfo = await getAsyncStorageItem(namespace)
    const lastRatedDate = reviewInfo?.lastRatedDate
    const articleIds = reviewInfo?.articleIds || []

    if (!articleIds.includes(id)) {
      articleIds.push(id)
    }

    if (hasPeriodPassed(lastRatedDate) && isOverCount(articleIds.length)) {
      StoreReview.requestReview()
      updateReviewInfo({ lastRatedDate: utcNow(), articleIds: [] })
    } else {
      updateReviewInfo({ articleIds })
    }
  }
}

export const appReview = {
  rateApp,
  rateAppFromWishlist,
  rateAppFromArticle
}
