/**
 * ported from
 * https://github.com/facebook/facebook-ios-sdk/blob/e54ab86c81c7bcb9885e14bd7e9bed2dd736346d/FBSDKCoreKit/FBSDKCoreKit/AppEvents/FBSDKAppEvents.m
 * https://github.com/coronalabs/plugins-sdk-facebook-android/blob/master/facebook/src/main/java/com/facebook/appevents/AppEventsConstants.java
 */
class AppEventsConstants {}

// Event names

// General purpose

/** Log this event when an app is being activated. */
AppEventsConstants.EVENT_NAME_ACTIVATED_APP = 'fb_mobile_activate_app'

AppEventsConstants.EVENT_NAME_DEACTIVATED_APP = 'fb_mobile_deactivate_app'

AppEventsConstants.EVENT_NAME_SESSION_INTERRUPTIONS = 'fb_mobile_app_interruptions'

AppEventsConstants.EVENT_NAME_TIME_BETWEEN_SESSIONS = 'fb_mobile_time_between_sessions'

/** Log this event when the user has completed registration with the app. */
AppEventsConstants.EVENT_NAME_COMPLETED_REGISTRATION = 'fb_mobile_complete_registration'

/** Log this event when the user has viewed a form of content in the app. */
AppEventsConstants.EVENT_NAME_VIEWED_CONTENT = 'fb_mobile_content_view'

/** Log this event when the user has performed a search within the app. */
AppEventsConstants.EVENT_NAME_SEARCHED = 'fb_mobile_search'

/**
 * Log this event when the user has rated an item in the app.
 * The valueToSum passed to logEvent should be the numeric rating.
 */
AppEventsConstants.EVENT_NAME_RATED = 'fb_mobile_rate'

/** Log this event when the user has completed a tutorial in the app. */
AppEventsConstants.EVENT_NAME_COMPLETED_TUTORIAL = 'fb_mobile_tutorial_completion'

// Ecommerce related

/**
 * Log this event when the user has added an item to their cart.
 * The valueToSum passed to logEvent should be the item's price.
 */
AppEventsConstants.EVENT_NAME_ADDED_TO_CART = 'fb_mobile_add_to_cart'

/**
 * Log this event when the user has added an item to their wishlist.
 * The valueToSum passed to logEvent should be the item's price.
 */
AppEventsConstants.EVENT_NAME_ADDED_TO_WISHLIST = 'fb_mobile_add_to_wishlist'

/**
 * Log this event when the user has entered the checkout process.
 * The valueToSum passed to logEvent should be the total price in the cart.
 */
AppEventsConstants.EVENT_NAME_INITIATED_CHECKOUT = 'fb_mobile_initiated_checkout'

/** Log this event when the user has entered their payment info. */
AppEventsConstants.EVENT_NAME_ADDED_PAYMENT_INFO = 'fb_mobile_add_payment_info'

/**
 *  @deprecated Use {@link
 *  AppEventsLogger#logPurchase(java.math.BigDecimal, java.util.Currency)} instead.
 *  Log this event when the user has completed a purchase. The {@link
 *  AppEventsLogger#logPurchase(java.math.BigDecimal, java.util.Currency)} method is a shortcut
 *  for logging this event.
 */
AppEventsConstants.EVENT_NAME_PURCHASED = 'fb_mobile_purchase'

// Gaming related

/** Log this event when the user has achieved a level in the app. */
AppEventsConstants.EVENT_NAME_ACHIEVED_LEVEL = 'fb_mobile_level_achieved'

/** Log this event when the user has unlocked an achievement in the app. */
AppEventsConstants.EVENT_NAME_UNLOCKED_ACHIEVEMENT = 'fb_mobile_achievement_unlocked'

/**
 * Log this event when the user has spent app credits.
 * The valueToSum passed to logEvent should be the number of credits spent.
 */
AppEventsConstants.EVENT_NAME_SPENT_CREDITS = 'fb_mobile_spent_credits'

// Event parameters

/**
 * Parameter key used to specify currency used with logged event.  E.g. "USD", "EUR", "GBP". See
 * <a href="http://en.wikipedia.org/wiki/ISO_4217">ISO-4217</a>
 * for specific values.
 */
AppEventsConstants.EVENT_PARAM_CURRENCY = 'fb_currency'

/**
 * Parameter key used to specify the method the user has used to register for the app, e.g.,
 * "Facebook", "email", "Twitter", etc.
 */
AppEventsConstants.EVENT_PARAM_REGISTRATION_METHOD = 'fb_registration_method'

/**
 * Parameter key used to specify a generic content type/family for the logged event, e.g.
 * "music", "photo", "video".  Options to use will vary depending on the nature of the app.
 */
AppEventsConstants.EVENT_PARAM_CONTENT_TYPE = 'fb_content_type'

/**
 * Parameter key used to specify an ID for the specific piece of content being logged about.
 * This could be an EAN, article identifier, etc., depending on the nature of the app.
 */
AppEventsConstants.EVENT_PARAM_CONTENT_ID = 'fb_content_id'

/** Parameter key used to specify the string provided by the user for a search operation. */
AppEventsConstants.EVENT_PARAM_SEARCH_STRING = 'fb_search_string'

/**
 * Parameter key used to specify whether the activity being logged about was successful or not.
 * EVENT_PARAM_VALUE_YES and EVENT_PARAM_VALUE_NO are good canonical values to use for this
 * parameter.
 */
AppEventsConstants.EVENT_PARAM_SUCCESS = 'fb_success'

/**
 * Parameter key used to specify the maximum rating available for the EVENT_NAME_RATE event.
 * E.g., "5" or "10".
 */
AppEventsConstants.EVENT_PARAM_MAX_RATING_VALUE = 'fb_max_rating_value'

/**
 * Parameter key used to specify whether payment info is available for the
 * EVENT_NAME_INITIATED_CHECKOUT event. EVENT_PARAM_VALUE_YES and EVENT_PARAM_VALUE_NO are good
 * canonical values to use for this parameter.
 */
AppEventsConstants.EVENT_PARAM_PAYMENT_INFO_AVAILABLE = 'fb_payment_info_available'

/**
 * Parameter key used to specify how many items are being processed for an
 * EVENT_NAME_INITIATED_CHECKOUT or EVENT_NAME_PURCHASE event.
 */
AppEventsConstants.EVENT_PARAM_NUM_ITEMS = 'fb_num_items'

/** Parameter key used to specify the level achieved in an EVENT_NAME_LEVEL_ACHIEVED event. */
AppEventsConstants.EVENT_PARAM_LEVEL = 'fb_level'

/**
 * Parameter key used to specify a description appropriate to the event being logged.
 * E.g., the name of the achievement unlocked in the EVENT_NAME_ACHIEVEMENT_UNLOCKED event.
 */
AppEventsConstants.EVENT_PARAM_DESCRIPTION = 'fb_description'

/**
 * Parameter key used to specify source application package.
 */
AppEventsConstants.EVENT_PARAM_SOURCE_APPLICATION = 'fb_mobile_launch_source'

// Parameter values

/** Yes-valued parameter value to be used with parameter keys that need a Yes/No value */
AppEventsConstants.EVENT_PARAM_VALUE_YES = '1'

/** No-valued parameter value to be used with parameter keys that need a Yes/No value */
AppEventsConstants.EVENT_PARAM_VALUE_NO = '0'

Object.freeze(AppEventsConstants)
export default AppEventsConstants
