export const filterAvailableDeliveryOptions = (availableOptions, type) =>
  availableOptions &&
  availableOptions.filter(o => {
    const matchField = o.type === type
    const matchDescription = o.description.includes(`[type:${type}]`)
    const matchCost = (type === 'free' && o.cost === 0) || (type !== 'free' && o.cost > 0)
    if (type === 'free') {
      return o.cost === 0
    }
    return matchField || matchDescription || matchCost
  })

export const filterDeliveryName = text => text.replace(/\([^()]*\)/g, '').replace(/\[[^]*\]/g, '')

export const filterDeliveryDescription = text => text.match(/\(([^)]+)\)/)?.[1]
