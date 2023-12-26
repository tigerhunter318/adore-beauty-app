const groupBrandsByLetter = brands => {
  if (brands) {
    const removeAccents = str => {
      let string = ''
      const map = {
        A: 'á|à|ã|â|ä|À|Á|Ã|Â|Ä',
        E: 'é|è|ê|ë|É|È|Ê|Ë',
        I: 'í|ì|î|ï|Í|Ì|Î|Ï',
        O: 'ó|ò|ô|õ|ö|Ó|Ò|Ô|Õ|Ö',
        U: 'ú|ù|û|ü|Ú|Ù|Û|Ü',
        C: 'ç|Ç',
        N: 'ñ|Ñ'
      }

      Object.keys(map).forEach(pattern => (string = str.replace(new RegExp(map[pattern], 'g'), pattern)))

      return string
    }

    const newData = brands?.reduce((obj, brand) => {
      const letter = removeAccents(brand.name ? brand.name[0].toUpperCase() : brand.brand_name[0].toUpperCase())
      if (!obj[letter]) {
        obj[letter] = { letter, data: [brand] }
      } else {
        obj[letter].data.push(brand)
      }
      return obj
    }, {})
    return Object.values(newData)
  }
  return null
}

export default groupBrandsByLetter
