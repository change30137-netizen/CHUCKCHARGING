import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { memberNames } from '../data/members'

const GAS_URL = 'https://script.google.com/macros/s/AKfycbwyYb5CrjTE-D4gpL2PRnfpU5Vka75eciyC7ysmwcGqKfmSDtndgCPuWYD7ozmf2Jb7hQ/exec'

interface Vote {
  name: string
  mainCourse: string
  dessert: string
  drink: string
  note: string
  time: string
}

function tally(votes: Vote[], key: keyof Vote) {
  const map: Record<string, number> = {}
  for (const v of votes) {
    const val = v[key]
    if (val) map[val] = (map[val] || 0) + 1
  }
  return Object.entries(map).sort((a, b) => b[1] - a[1])
}

export default function OrderPage() {
  const [votes, setVotes] = useState<Vote[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(GAS_URL)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setVotes(d.data.map((row: Record<string, string>) => ({
            name: row['\u59D3\u540D'] || '',
            mainCourse: row['\u4E3B\u83DC'] || '',
            dessert: row['\u7518\u9EDE'] || '',
            drink: row['\u98F2\u54C1'] || '',
            note: row['\u5099\u8A3B'] || '',
            time: row['\u6295\u7968\u6642\u9593'] || '',
          })))
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const votedNames = votes.map(v => v.name).filter(Boolean)
  const notVoted = memberNames.filter(n => !votedNames.includes(n))

  const mainTally = tally(votes, 'mainCourse')
  const dessertTally = tally(votes, 'dessert')
  const drinkTally = tally(votes, 'drink')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-6 pt-6 pb-2">
        <p className="text-[11px] font-semibold text-brand tracking-[0.15em] uppercase">石港春帆</p>
        <h2 className="text-[42px] font-bold text-text-1 tracking-tight leading-none mt-1">點餐</h2>
        <p className="text-[14px] text-text-2 mt-2">已選 {votes.length} / {memberNames.length} 人</p>
      </div>

      <div className="px-5 space-y-3 pb-6">
        {loading && (
          <div className="cal-card p-8 text-center">
            <p className="text-[14px] text-text-3">載入中...</p>
          </div>
        )}

        {/* Not voted */}
        {!loading && notVoted.length > 0 && (
          <div className="cal-card p-5">
            <p className="text-[11px] font-bold text-red-400 tracking-wider uppercase mb-2">還沒選 ({notVoted.length})</p>
            <div className="flex flex-wrap gap-2">
              {notVoted.map(n => (
                <span key={n} className="text-[13px] font-semibold text-red-400 bg-red-50 px-3.5 py-1.5 rounded-full">{n}</span>
              ))}
            </div>
          </div>
        )}

        {/* Tally summary for ordering */}
        {!loading && votes.length > 0 && (
          <>
            <TallyCard title="主菜統計" items={mainTally} />
            <TallyCard title="甜點統計" items={dessertTally} />
            <TallyCard title="飲品統計" items={drinkTally} />
          </>
        )}

        {/* Individual cards */}
        {!loading && votes.map((v, i) => (
          <motion.div
            key={v.name}
            className="cal-card p-5"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[16px] font-bold text-text-1">{v.name}</h3>
              <span className="text-[10px] text-text-3">{v.time}</span>
            </div>
            <div className="space-y-1.5">
              <Row label="主菜" value={v.mainCourse} />
              <Row label="甜點" value={v.dessert} />
              <Row label="飲品" value={v.drink} />
              {v.note && <Row label="備註" value={v.note} highlight />}
            </div>
          </motion.div>
        ))}

        {!loading && votes.length === 0 && (
          <div className="cal-card p-8 text-center">
            <p className="text-[14px] text-text-3">還沒有人選餐</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-[11px] font-bold text-text-3 w-8 shrink-0 pt-0.5">{label}</span>
      <span className={`text-[13px] leading-snug ${highlight ? 'text-brand font-semibold' : 'text-text-1'}`}>{value}</span>
    </div>
  )
}

function TallyCard({ title, items }: { title: string; items: [string, number][] }) {
  const max = items[0]?.[1] || 1
  return (
    <div className="cal-card p-5">
      <p className="text-[11px] font-bold text-text-3 tracking-wider uppercase mb-3">{title}</p>
      <div className="space-y-2">
        {items.map(([name, count]) => (
          <div key={name} className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] text-text-1 font-medium truncate">{name}</span>
                <span className="text-[12px] text-text-3 font-bold mono ml-2">{count}</span>
              </div>
              <div className="h-1.5 bg-bg rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-brand rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(count / max) * 100}%` }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
