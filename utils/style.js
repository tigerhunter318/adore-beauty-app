/**
 * merge two stylesheet objects.
 * add active styles
 * @param style1
 * @param style2
 * @param active
 */
// export const composeStyle1 = (style1 = {}, style2 = {}, active = false) => {
//   const styled = {}
//   Object.keys(style1).forEach(key => {
//     styled[key] = [style1[key], style2[key], active && style1[`${key}Active`], active && style2[`${key}Active`]]
//   })
//   Object.keys(style2).forEach(key => {
//     if(!styled[key] && style2[key]){
//       console.log("15","",key,style2[key])
//       styled[key] = [ style2[key]] //, active && style2[`${key}Active`]]
//     }
//   })
//   return styled
// }

export const composeStyle = (style1 = {}, style2 = {}, active = false) => {
  const styled = {}
  Object.keys(style1).forEach(key => {
    if (style1[key]) {
      styled[key] = [style1[key]]
      if (active) {
        styled[key].push(style1[`${key}Active`])
      }
    }
  })

  Object.keys(style2).forEach(key => {
    if (style2[key]) {
      const arr = styled[key] ? styled[key] : []
      styled[key] = [...arr, style2[key]]
      if (active) {
        styled[key].push(style2[`${key}Active`])
      }
    }
  })
  return styled
}
