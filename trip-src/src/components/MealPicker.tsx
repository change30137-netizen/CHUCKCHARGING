import { useState } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { memberNames } from '../data/members'
import { mainCourses, desserts, drinks } from '../data/menu'
import type { MenuOption } from '../data/menu'

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
  const canSubmit = name && mainCourse && dessert && drink

  function handleSubmit(e: React.MouseEvent) {
    e.stopPropagation()
    if (!canSubmit) return
    const stored = localStorage.getItem('trip-votes')
    const existing = stored ? JSON.parse(stored) : []
    const idx = existing.findIndex((v: { name: string }) => v.name === name)
    const record = { name, mainCourse, dessert, drink, note: note.trim(), timestamp: new Date().toISOString() }
    if (idx >= 0) existing[idx] = record; else existing.push(record)
    localStorage.setItem('trip-votes', JSON.stringify(existing))
    setSubmitted(true)
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 }, colors: ['#e7b94f', '#3b82f6', '#10b981'] })
  }

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 text-center" onClick={(e) => e.stopPropagation()}>
        <p className="text-[32px] font-bold text-brand-green mono">Done</p>
        <p className="text-[13px] text-text-2 mt-1">{name} 的餐點已記錄</p>
        <button onClick={() => setSubmitted(false)} className="mt-4 text-[13px] text-brand font-semibold">重新選擇</button>
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

      <motion.button
        onClick={handleSubmit} disabled={!canSubmit}
        className={`w-full py-3.5 rounded-2xl text-[14px] font-bold transition-all ${
          canSubmit
            ? 'bg-brand text-white shadow-lg shadow-brand/25 active:scale-[0.98]'
            : 'bg-divider text-text-3 cursor-not-allowed'
        }`}
        whileTap={canSubmit ? { scale: 0.98 } : {}}
      >
        送出
      </motion.button>
    </div>
  )
}
