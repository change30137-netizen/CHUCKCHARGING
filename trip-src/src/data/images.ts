// Unsplash free images + company logo
const img = (id: string) =>
  `https://images.unsplash.com/${id}?w=400&h=300&fit=crop&q=80`

const LOGO = 'https://ap13.ragic.com/sims/file.jsp?a=ChuckChargingCC&f=%E8%B3%87%E7%94%A2+%EF%BC%92.png'

export const stopImages: Record<string, string> = {
  // Day 1
  'office':     LOGO,                                       // 公司 logo
  'driving':    img('photo-1449824913935-59a10b8d2000'),   // road trip highway
  'seafood':    img('photo-1579584425555-c3ce17fd4351'),   // sashimi platter
  'ev-charger': img('photo-1593941707882-a5bba14938c7'),   // EV charging
  'grocery':    img('photo-1604719312566-8912e9227c6a'),   // grocery store
  'guesthouse': img('photo-1566073771259-6a8506099945'),   // resort villa
  'chill':      img('photo-1506126613408-eca07ce68773'),   // relax hammock
  'nightmarket':img('photo-1504674900247-0877df9cc836'),   // street food
  'party':      img('photo-1528495612343-9ca9f4a4de28'),   // karaoke party

  // Day 2
  'checkout':   img('photo-1566073771259-6a8506099945'),   // hotel
  'lake':       img('photo-1439066615861-d1af74d74000'),   // lake reflection
  'handmade':   img('photo-1555939594-58d7cb561ad1'),   // chinese cuisine
  'cycling':    img('photo-1541625602330-2277a4c46182'),   // cycling nature
  'teahouse':   img('photo-1544787219-7f47ccb76574'),   // tea cup cafe
  'highway':    LOGO,                                       // 回公司 logo
  'home':       LOGO,                                       // 解散 logo
}
