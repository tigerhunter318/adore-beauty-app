// const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';
// Gets the current screen from navigation state
export const getActiveRouteState = state => {
  const route = state.routes && state.routes[state.index]

  if (route?.state) {
    // Dive into nested navigators
    return getActiveRouteState(route.state)
  }

  return route
}

export const getFocusedRouteStateFromNavigation = navigation => getActiveRouteState(navigation.dangerouslyGetState())

/**
 *
 * @param state
 * @returns {*}
 */
export const getActiveTabState = state => state?.routes[state?.index]
