import { useState } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { memberNames } from '../data/members'
import { mainCourses, desserts, drinks } from '../data/menu'
import type { MenuOption } from '../data/menu'
import type { VoteRecord } from '../hooks/useVote'

interface Props {
  onSubmit: (vote: Omit<VoteRecord, 'timestamp'>) => Promise<boolean>
  submitting: boolean
}

function OptionCards({
  label,
  options,
  selected,
  onSelect,
  accentFrom,
  accentTo,
}: {
  label: string
  options: MenuOption[]
  selected: string
  onSelect: (id: string) => void
  accentFrom: string
  accentTo: string
}) {
  return (
    <div className="mb-5">
      <h3 className="text-sm font-black text-dark-bg mb-2.5">{label}</h3>
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => {
          const isSelected = selected === opt.id
          return (
            <motion.button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              className={`relative p-3 rounded-2xl text-left border-2 transition-all text-sm overflow-hidden ${
                isSelected
                  ? 'border-transparent text-white font-bold shadow-lg'
                  : 'border-slate-100 bg-white/60 text-slate-600 hover:border-slate-200 hover:bg-white'
              }`}
              style={isSelected ? {
                background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
                boxShadow: `0 4px 14px ${accentFrom}40`,
              } : {}}
              whileTap={{ scale: 0.95 }}
              animate={isSelected ? { scale: [1, 1.03, 1] } : {}}
              transition={{ duration: 0.2 }}
            >
              <span className="text-base mr-1">{opt.emoji}</span>
              <span className="text-[13px]">{opt.name}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

export default function VoteForm({ onSubmit, submitting }: Props) {
  const [name, setName] = useState('')
  const [mainCourse, setMainCourse] = useState('')
  const [dessert, setDessert] = useState('')
  const [drink, setDrink] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const canSubmit = name && mainCourse && dessert && drink && !submitting

  async function handleSubmit() {
    if (!canSubmit) return
    const success = await onSubmit({ name, mainCourse, dessert, drink })
    if (success) {
      setSubmitted(true)
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0EA5E9', '#F59E0B', '#10B981', '#F43F5E', '#8B5CF6'],
      })
      setTimeout(() => setSubmitted(false), 3000)
    }
  }

  return (
    <div>
      {/* Name selector */}
      <div className="mb-5">
        <h3 className="text-sm font-black text-dark-bg mb-2.5">你是誰？</h3>
        <select
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3.5 rounded-2xl border-2 border-slate-100 bg-white/60 text-sm font-medium text-dark-bg focus:border-sky-primary focus:outline-none focus:ring-4 focus:ring-sky-primary/10 transition-all appearance-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2394a3b8' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
        >
          <option value="">請選擇姓名</option>
          {memberNames.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      <OptionCards
        label="主菜（7 選 1）"
        options={mainCourses}
        selected={mainCourse}
        onSelect={setMainCourse}
        accentFrom="#0EA5E9"
        accentTo="#3B82F6"
      />
      <OptionCards
        label="甜點（6 選 1）"
        options={desserts}
        selected={dessert}
        onSelect={setDessert}
        accentFrom="#F59E0B"
        accentTo="#EF4444"
      />
      <OptionCards
        label="飲品（9 選 1）"
        options={drinks}
        selected={drink}
        onSelect={setDrink}
        accentFrom="#10B981"
        accentTo="#0EA5E9"
      />

      <motion.button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`w-full py-4 rounded-2xl font-black text-sm transition-all ${
          canSubmit
            ? 'bg-gradient-to-r from-amber-accent to-orange-400 text-white shadow-lg shadow-amber-accent/30'
            : 'bg-slate-100 text-slate-300 cursor-not-allowed'
        }`}
        whileHover={canSubmit ? { scale: 1.02, y: -1 } : {}}
        whileTap={canSubmit ? { scale: 0.98 } : {}}
      >
        {submitting ? '送出中...' : submitted ? '已送出！🎉' : '送出投票 →'}
      </motion.button>

      {submitted && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm text-emerald-500 font-bold mt-3"
        >
          投票成功！可以隨時改票
        </motion.p>
      )}
    </div>
  )
}
