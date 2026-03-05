export interface MenuOption {
  id: string
  name: string
  emoji?: string
  origin?: string
}

export const mainCourses: MenuOption[] = [
  { id: 'grouper', name: '清蒸 龍虎石斑 佐血蟹醬', emoji: '🐟', origin: '宜蘭產' },
  { id: 'shrimp', name: '清蒸 蒜泥大白蝦', emoji: '🦐', origin: '澎湖產' },
  { id: 'oyster', name: '清蒸 蒜泥大牡蠣', emoji: '🦪', origin: '日本岡山縣' },
  { id: 'pomfret', name: '香煎 紀日金鯧鰈', emoji: '🐠', origin: '北大西洋' },
  { id: 'pork', name: '爐烤 松阪豬 佐薑醋醬', emoji: '🥩', origin: '台灣產' },
  { id: 'lamb', name: '爐烤 羊肩排 佐洋蔥酸醬汁', emoji: '🍖', origin: '紐西蘭產' },
  { id: 'duck', name: '香煎 櫻桃鴨 佐法式黑胡椒醬汁', emoji: '🦆', origin: '宜蘭產' },
]

export const desserts: MenuOption[] = [
  { id: 'tofu', name: '日式杏仁豆腐', emoji: '🍮' },
  { id: 'panna-cotta', name: '檸檬鮮奶酪', emoji: '🍋' },
  { id: 'chocolate', name: '巧克力蛋糕', emoji: '🍫' },
  { id: 'brulee', name: '鹽糖焦布蕾', emoji: '🔥' },
  { id: 'cheesecake', name: '起司蛋糕', emoji: '🧀' },
  { id: 'mungbean', name: '冰心綠豆皇', emoji: '🟢' },
]

export const drinks: MenuOption[] = [
  // 氣泡系列
  { id: 'sparkling-original', name: '原味氣泡', emoji: '🫧' },
  { id: 'sparkling-apple', name: '青蘋果氣泡', emoji: '🫧' },
  { id: 'sparkling-peach', name: '白桃氣泡', emoji: '🫧' },
  { id: 'sparkling-cassis', name: '黑醋栗氣泡', emoji: '🫧' },
  // 果汁 & 茶
  { id: 'fruit-juice', name: '現榨香果果汁', emoji: '🍹' },
  { id: 'tomato', name: '覆女小番茄汁', emoji: '🍅' },
  { id: 'fungus', name: '養生黑木耳汁', emoji: '🖤' },
  { id: 'thai-tea', name: '泰式奶茶', emoji: '🧋' },
  { id: 'cocoa-ice', name: '可可歐蕾（冰）', emoji: '🍫' },
  { id: 'cocoa-hot', name: '可可歐蕾（熱）', emoji: '🍫' },
  { id: 'lotus-tea', name: '蓮花茶（無咖啡因）', emoji: '🪷' },
  { id: 'oolong', name: '烏龍茶（原片）', emoji: '🍵' },
  // 咖啡系列
  { id: 'americano-ice', name: '冰美式', emoji: '☕' },
  { id: 'americano-hot', name: '熱美式', emoji: '☕' },
  { id: 'latte-ice', name: '冰拿鐵', emoji: '☕' },
  { id: 'latte-hot', name: '熱拿鐵', emoji: '☕' },
  { id: 'cappuccino-ice', name: '冰卡布奇諾', emoji: '☕' },
  { id: 'cappuccino-hot', name: '熱卡布奇諾', emoji: '☕' },
]
