const GAS_URL = 'https://script.google.com/macros/s/AKfycbwyYb5CrjTE-D4gpL2PRnfpU5Vka75eciyC7ysmwcGqKfmSDtndgCPuWYD7ozmf2Jb7hQ/exec'
const CACHE_KEY = 'trip-votes-cache'

export interface Vote {
  name: string
  mainCourse: string
  dessert: string
  drink: string
  note: string
  time: string
}

function parseRow(row: Record<string, string>): Vote {
  // Handle both Chinese keys (from Sheet headers) and English keys (from COLS)
  return {
    name: (row['name'] || row['姓名'] || '').trim(),
    mainCourse: (row['mainCourse'] || row['主菜'] || row['主菜 '] || '').trim(),
    dessert: (row['dessert'] || row['甜點'] || '').trim(),
    drink: (row['drink'] || row['飲品'] || '').trim(),
    note: (row['note'] || row['備註'] || '').trim(),
    time: (row['timestamp'] || row['投票時間'] || '').trim(),
  }
}

// Shared promise so multiple components don't fire duplicate requests
let fetchPromise: Promise<Vote[]> | null = null

export function fetchVotes(): Promise<Vote[]> {
  if (fetchPromise) return fetchPromise
  fetchPromise = fetch(GAS_URL)
    .then(r => r.json())
    .then(d => {
      const votes = (d.data || []).map(parseRow).filter((v: Vote) => v.name)
      localStorage.setItem(CACHE_KEY, JSON.stringify(votes))
      fetchPromise = null
      return votes
    })
    .catch(() => {
      fetchPromise = null
      return getCached()
    })
  return fetchPromise
}

export function getCached(): Vote[] {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '[]')
  } catch {
    return []
  }
}

// Pre-warm: start fetching immediately on module load
fetchVotes()
