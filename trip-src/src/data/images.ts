const LOGO = 'https://ap13.ragic.com/sims/file.jsp?a=ChuckChargingCC&f=%E8%B3%87%E7%94%A2+%EF%BC%92.png'
const unsplash = (id: string) => `https://images.unsplash.com/${id}?w=400&h=300&fit=crop&q=80`

export const stopImages: Record<string, string> = {
  // Day 1
  'office':     LOGO,
  'driving':    unsplash('photo-1449824913935-59a10b8d2000'),
  'seafood':    'https://followmii.tw/wp-content/uploads/2023/12/batch_collage-2.jpg',          // 石港春帆實景
  'ev-charger': unsplash('photo-1593941707882-a5bba14938c7'),
  'grocery':    unsplash('photo-1604719312566-8912e9227c6a'),
  'guesthouse': 'https://a0.muscache.com/im/pictures/miso/Hosting-680010670650418235/original/f18b1d07-41b1-4662-acd0-3634ffa4471d.jpeg',  // 只此清綠實景
  'chill':      unsplash('photo-1551024709-8f23befc6f87'),                                       // drinks/cheers
  'nightmarket': unsplash('photo-1504674900247-0877df9cc836'),  // 夜市美食意象
  'party':      unsplash('photo-1528495612343-9ca9f4a4de28'),

  // Day 2
  'checkout':   'https://a0.muscache.com/im/pictures/miso/Hosting-680010670650418235/original/f18b1d07-41b1-4662-acd0-3634ffa4471d.jpeg',  // 只此清綠
  'lake':       'https://bobowin.blog/wp-content/uploads/20221121191655_55.jpg',                 // 蜊埤湖實景
  'handmade':   'https://www.tony60533.com/wp-content/uploads/2022/04/000-1.jpg',                // 橙心手作料理實景
  'cycling':    'https://mimigo.tw/wp-content/uploads/20200923173301_14.jpg',                    // 龍潭湖白色貨櫃
  'teahouse':   'https://mimigo.tw/wp-content/uploads/20200923173259_94.jpg',                    // Herbelle湖畔茶屋
  'highway':    LOGO,
  'home':       LOGO,
}
