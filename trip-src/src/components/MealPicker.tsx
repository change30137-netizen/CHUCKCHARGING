import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { memberNames } from '../data/members'
import { mainCourses, desserts, drinks } from '../data/menu'
import type { MenuOption } from '../data/menu'

const GAS_URL = 'https://script.google.com/macros/s/AKfycbwyYb5CrjTE-D4gpL2PRnfpU5Vka75eciyC7ysmwcGqKfmSDtndgCPuWYD7ozmf2Jb7hQ/exec'

function OptionGrid({ label, options, selected, onSelect }: {
  label: string; options: MenuOption[]; selected: string; onSelect: (id: string) => void
}) {
  return (
    <div className="mb-5">
      <p className="text-[11px] font-bold text-text-3 tracking-wider uppercase mb-2">{label}</p>
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => {
          const active = selected === opt.id
          return (
            <motion.button
              key={opt.id}
              onClick={(e) => { e.stopPropagation(); onSelect(opt.id) }}
              className={`p-3 rounded-2xl text-left text-[12px] leading-snug transition-all ${
                active
                  ? 'bg-brand text-white font-semibold shadow-md shadow-brand/20'
                  : 'bg-bg text-text-2 hover:bg-divider'
              }`}
              whileTap={{ scale: 0.96 }}
            >
              <span className="mr-1">{opt.emoji}</span>{opt.name}
              {opt.origin && <span className={`block text-[10px] mt-0.5 ${active ? 'text-white/70' : 'text-text-3'}`}>{opt.origin}</span>}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

export default function MealPicker() {
  const [name, setName] = useState('')
  const [mainCourse, setMainCourse] = useState('')
  const [dessert, setDessert] = useState('')
  const [drink, setDrink] = useState('')
  const [note, setNote] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [votes, setVotes] = useState<Array<Record<string, string>>>([])
  const canSubmit = name && mainCourse && dessert && drink && !sending

  // Load existing votes on mount
  useEffect(() => {
    fetch(GAS_URL)
      .then(r => r.json())
      .then(d => { if (d.success) setVotes(d.data) })
      .catch(() => {})
  }, [submitted])

  // Auto-fill if this person already voted
  useEffect(() => {
    if (!name || votes.length === 0) return
    const existing = votes.find(v => v['\u59D3\u540D'] === name)
    if (existing) {
      const mc = mainCourses.find(o => o.name === existing['\u4E3B\u83DC'])
      const ds = desserts.find(o => o.name === existing['\u7518\u9EDE'])
      const dk = drinks.find(o => o.name === existing['\u98F2\u54C1'])
      if (mc) setMainCourse(mc.id)
      if (ds) setDessert(ds.id)
      if (dk) setDrink(dk.id)
      setNote(existing['\u5099\u8A3B'] || '')
    }
  }, [name, votes])

  async function handleSubmit(e: React.MouseEvent) {
    e.stopPropagation()
    if (!canSubmit) return
    setSending(true)
    setError('')
    const mainName = mainCourses.find(o => o.id === mainCourse)?.name || mainCourse
    const dessertName = desserts.find(o => o.id === dessert)?.name || dessert
    const drinkName = drinks.find(o => o.id === drink)?.name || drink
    try {
      await fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ name, mainCourse: mainName, dessert: dessertName, drink: drinkName, note: note.trim() }),
      })
      // no-cors 無法讀 response，但 GAS 會正確處理
      setSubmitted(true)
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 }, colors: ['#e7b94f', '#3b82f6', '#10b981'] })
    } catch {
      setError('網路錯誤，請確認網路連線後再試')
    } finally {
      setSending(false)
    }
  }

  const votedNames = votes.map(v => v['\u59D3\u540D']).filter(Boolean)
  const notVoted = memberNames.filter(n => !votedNames.includes(n))

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 text-center" onClick={(e) => e.stopPropagation()}>
        <p className="text-[32px] font-bold text-brand-green mono">Done</p>
        <p className="text-[13px] text-text-2 mt-1">{name} 的餐點已記錄</p>
        <button onClick={() => setSubmitted(false)} className="mt-4 text-[13px] text-brand font-semibold">重新選擇 / 改票</button>
        {notVoted.length > 0 && (
          <p className="mt-4 text-[12px] text-text-3">還沒選：{notVoted.join('、')}</p>
        )}
      </motion.div>
    )
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="mb-5">
        <p className="text-[11px] font-bold text-text-3 tracking-wider uppercase mb-2">你是誰</p>
        <select
          value={name} onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded-2xl bg-bg text-[13px] font-medium text-text-1 focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all"
        >
          <option value="">請選擇</option>
          {memberNames.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      <OptionGrid label="主菜（7 選 1）" options={mainCourses} selected={mainCourse} onSelect={setMainCourse} />
      <OptionGrid label="甜點（6 選 1）" options={desserts} selected={dessert} onSelect={setDessert} />
      <OptionGrid label="飲品（9 選 1）" options={drinks} selected={drink} onSelect={setDrink} />

      <div className="mb-5">
        <p className="text-[11px] font-bold text-text-3 tracking-wider uppercase mb-2">備註（選填）</p>
        <textarea
          value={note} onChange={(e) => setNote(e.target.value)}
          placeholder="例：飲料去冰、不吃香菜..."
          rows={2}
          className="w-full p-3 rounded-2xl bg-bg text-[13px] text-text-1 placeholder:text-text-3 focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all resize-none"
        />
      </div>

      <p className="text-[12px] text-text-3 text-center mb-3">* 只有這餐需要先選，其他餐不用</p>

      {error && <p className="text-[12px] text-red-500 text-center mb-2">{error}</p>}

      <motion.button
        onClick={handleSubmit} disabled={!canSubmit}
        className={`w-full py-3.5 rounded-2xl text-[14px] font-bold transition-all ${
          canSubmit
            ? 'bg-brand text-white shadow-lg shadow-brand/25 active:scale-[0.98]'
            : 'bg-divider text-text-3 cursor-not-allowed'
        }`}
        whileTap={canSubmit ? { scale: 0.98 } : {}}
      >
        {sending ? '送出中...' : '送出'}
      </motion.button>
    </div>
  )
}
