export default {
  scale: 2,
  product: {
    thumbnail: {
      width: 140, // match website
      height: 140
    },
    medium: {
      width: 140, // use thumbnail size to reduce network cache generation
      height: 140
    },
    large: {
      width: 300, // match website
      height: 300
    }
  },
  promotion: {
    thumbnail: {
      width: 105, // ?fm=webp&w=230&h=230
      height: 105
    }
  },
  brand: {
    listing: {
      width: 110,
      height: 110
    }
  },
  article: {
    avatar: {
      width: 40,
      height: 40 // fm=webp&w=50&h=50, ?fm=webp&w=70&h=70
    },
    thumbnail: {
      // width: 150, //?fm=webp&w=308&h=308, ?fm=webp&w=255&h=255
      // width: 164 + 0,
      // height: 126 + 0
      width: 100,
      height: 100
    },
    content: {
      // width: 330 + 0, // ?fm=webp&w=350&q=75
      // height: 210 + 0
      width: 325,
      height: 325
    },
    card: {
      // width: 380 + 0, // ?fm=webp&w=520&h=520, /?fm=webp&w=650&h=650
      // height: 200 + 0
      width: 325,
      height: 325
    }
  }
}
