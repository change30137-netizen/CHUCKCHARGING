export interface Room {
  id: number
  name: string
  type: string
  members: string[]
  icon: string
}

export const memberNames = [
  'Chuck',
  'Terry',
  '品寧',
  'Sonya',
  'Lillian',
  'Yvonne',
  '泓銘',
  '阿祥',
  'Louis',
  '思嚴',
]

export const rooms: Room[] = [
  { id: 1, name: '房間 1', type: '四人房（獨享）', members: ['Chuck'], icon: '👑' },
  { id: 2, name: '房間 2', type: '四人房（獨享）', members: ['Terry'], icon: '🛏️' },
  { id: 3, name: '房間 3', type: '四人房（獨享）', members: ['品寧'], icon: '🛏️' },
  { id: 4, name: '房間 4', type: '四人房（獨享）', members: ['Sonya'], icon: '🛏️' },
  { id: 5, name: '房間 5', type: '四人房（雙人）', members: ['Lillian', 'Yvonne'], icon: '👯‍♀️' },
  { id: 6, name: '房間 6', type: '四人房（雙人）', members: ['泓銘', '阿祥'], icon: '🤝' },
  { id: 7, name: '房間 7', type: '四人房（雙人）', members: ['Louis', '思嚴'], icon: '🤝' },
]
