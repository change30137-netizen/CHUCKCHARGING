import { motion } from 'framer-motion'
import { mainCourses, desserts, drinks } from '../data/menu'
import { memberNames } from '../data/members'
import type { VoteRecord } from '../hooks/useVote'
import type { MenuOption } from '../data/menu'

interface Props {
  votes: VoteRecord[]
  loading: boolean
}

function findName(options: MenuOption[], id: string) {
  return options.find(o => o.id === id)?.name || id
}

function BarChart({
  title,
  options,
  field,
  votes,
  gradientFrom,
  gradientTo,
}: {
  title: string
  options: MenuOption[]
  field: 'mainCourse' | 'dessert' | 'drink'
  votes: VoteRecord[]
  gradientFrom: string
  gradientTo: string
}) {
  const counts = options.map((opt) => ({
    ...opt,
    count: votes.filter((v) => v[field] === opt.id).length,
  }))
  const max = Math.max(...counts.map(c => c.count), 1)
  const sorted = counts.filter(c => c.count > 0).sort((a, b) => b.count - a.count)

  return (
    <div className="mb-5">
      <h3 className="text-sm font-black text-dark-bg mb-2.5">{title}</h3>
      <div className="space-y-2">
        {sorted.map((item, i) => (
          <div key={item.id} className="flex items-center gap-2.5">
            <span className="text-xs w-28 truncate text-slate-600 font-medium">
              {item.emoji} {item.name}
            </span>
            <div className="flex-1 bg-slate-100/80 rounded-full h-7 overflow-hidden">
              <motion.div
                className="h-full rounded-full flex items-center justify-end pr-2.5"
                style={{ background: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})` }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.max((item.count / max) * 100, 12)}%` }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
              >
                <span className="text-[11px] font-black text-white drop-shadow-sm">{item.count}</span>
              </motion.div>
            </div>
          </div>
        ))}
        {sorted.length === 0 && (
          <p className="text-xs text-slate-400 italic">尚無人投票</p>
        )}
      </div>
    </div>
  )
}

export default function VoteResults({ votes, loading }: Props) {
  const votedNames = votes.map(v => v.name)
  const notVoted = memberNames.filter(n => !votedNames.includes(n))

  if (loading) {
    return (
      <div className="py-8 space-y-3">
        {[1,2,3].map(i => (
          <div key={i} className="h-7 bg-slate-100 rounded-full shimmer" />
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-black text-dark-bg">投票結果</h2>
        <span className="text-xs bg-gradient-to-r from-sky-primary to-blue-500 text-white px-3 py-1 rounded-full font-bold shadow-sm">
          {votes.length}/{memberNames.length} 人
        </span>
      </div>

      <BarChart title="主菜排行" options={mainCourses} field="mainCourse" votes={votes} gradientFrom="#0EA5E9" gradientTo="#3B82F6" />
      <BarChart title="甜點排行" options={desserts} field="dessert" votes={votes} gradientFrom="#F59E0B" gradientTo="#EF4444" />
      <BarChart title="飲品排行" options={drinks} field="drink" votes={votes} gradientFrom="#10B981" gradientTo="#0EA5E9" />

      {/* Individual votes */}
      {votes.length > 0 && (
        <div className="mb-5">
          <h3 className="text-sm font-black text-dark-bg mb-2.5">個人選擇</h3>
          <div className="space-y-2">
            {votes.map((v, i) => (
              <motion.div
                key={v.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-xl p-3 flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-primary to-blue-500 flex items-center justify-center text-white text-xs font-black shrink-0">
                  {v.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-dark-bg">{v.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {findName(mainCourses, v.mainCourse)} · {findName(desserts, v.dessert)} · {findName(drinks, v.drink)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {notVoted.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100"
        >
          <p className="text-xs font-black text-amber-600 mb-1.5">
            還沒投票的人 ({notVoted.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {notVoted.map(n => (
              <span key={n} className="text-xs bg-white/80 text-amber-600 px-2 py-0.5 rounded-lg font-medium border border-amber-100">
                {n}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
