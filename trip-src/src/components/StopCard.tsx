import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ScheduleItem } from '../data/schedule'
import { stopImages } from '../data/images'
import MealPicker from './MealPicker'

interface Props {
  item: ScheduleItem
  index: number
}

const logoKeys = new Set(['office', 'highway', 'home'])

// Tag color mapping — same category = same color
const tagColors: Record<string, string> = {
  '集合':   'bg-slate-500',
  '交通':   'bg-sky-500',
  '午餐':   'bg-orange-500',
  '工作':   'bg-emerald-500',
  '購物':   'bg-violet-500',
  '住宿':   'bg-pink-500',
  '自由':   'bg-cyan-500',
  '美食':   'bg-red-500',
  '派對':   'bg-fuchsia-500',
  '退房':   'bg-slate-500',
  '景點':   'bg-teal-500',
  '下午茶': 'bg-purple-500',
  '結束':   'bg-slate-500',
}

export default function StopCard({ item, index }: Props) {
  const [mealOpen, setMealOpen] = useState(false)
  const imageUrl = item.imageKey ? stopImages[item.imageKey] : null
  const isLogo = item.imageKey ? logoKeys.has(item.imageKey) : false

  return (
    <motion.div
      className="cal-card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
    >
      {/* Photo / Logo */}
      {imageUrl && (
        <div className={`relative overflow-hidden rounded-t-[20px] ${isLogo ? 'h-28 bg-[#070404] flex items-center justify-center' : 'h-44'}`}>
          <img src={imageUrl} alt={item.title} className={isLogo ? 'h-14 w-auto object-contain' : 'w-full h-full object-cover'} loading="lazy" />
          {!isLogo && <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />}
          <div className="absolute bottom-3 left-4 flex items-center gap-2">
            <span className="text-[12px] font-bold text-white mono bg-black/30 backdrop-blur-md px-2 py-0.5 rounded-lg">
              {item.time}
            </span>
            {item.tag && (
              <span className={`text-[10px] font-semibold text-white backdrop-blur-md px-2 py-0.5 rounded-lg ${tagColors[item.tag] || 'bg-brand/80'}`}>
                {item.tag}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className={`px-5 pb-5 ${imageUrl ? 'pt-3.5' : 'pt-4'}`}>
        {/* No-image: show time + tag inline */}
        {!imageUrl && (
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[12px] font-bold text-brand mono">{item.time}</span>
            {item.tag && (
              <span className={`text-[10px] font-semibold text-white px-2 py-0.5 rounded-md ${tagColors[item.tag] || 'bg-text-3'}`}>
                {item.tag}
              </span>
            )}
          </div>
        )}

        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-[16px] font-bold text-text-1 tracking-tight leading-snug">
              {item.title}
            </h3>
            {item.description && (
              <p className="text-[13px] text-text-2 mt-1 leading-relaxed">{item.description}</p>
            )}
            {item.address && (
              <p className="text-[12px] text-text-3 mt-1 flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                {item.address}
              </p>
            )}
          </div>
          {!imageUrl && (
            <span className="text-2xl mt-0.5">{item.icon}</span>
          )}
        </div>

        {/* Nav button */}
        {item.mapUrl && (
          <a
            href={item.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2.5 py-3 rounded-2xl bg-brand-blue text-white text-[14px] font-bold shadow-lg shadow-brand-blue/25 active:scale-[0.98] transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            開啟導航
          </a>
        )}

        {/* Tips — always visible, no folding */}
        {item.tips && (
          <div className="mt-3">
            <p className="text-[11px] font-bold text-text-3 tracking-wider uppercase mb-2">推薦必吃</p>
            <div className="flex flex-wrap gap-2">
              {item.tips.map((tip) => (
                <span key={tip} className="text-[12px] text-text-1 bg-brand-light px-3 py-1.5 rounded-xl font-medium">
                  {tip}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Menu — always visible, no folding */}
        {item.menu && !item.voteLink && (
          <div className="mt-3">
            <p className="text-[11px] font-bold text-text-3 tracking-wider uppercase mb-2">菜色</p>
            <div className="flex flex-wrap gap-2">
              {item.menu.map((dish) => (
                <span key={dish} className="text-[12px] text-text-2 bg-bg px-3 py-1.5 rounded-xl font-medium">
                  {dish}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Meal picker — only this one folds */}
        {item.voteLink && (
          <>
            {item.menu && (
              <div className="mt-3">
                <p className="text-[11px] font-bold text-text-3 tracking-wider uppercase mb-2">固定菜色</p>
                <div className="flex flex-wrap gap-2">
                  {item.menu.filter(d => !d.startsWith('＋')).map((dish) => (
                    <span key={dish} className="text-[12px] text-text-2 bg-bg px-3 py-1.5 rounded-xl font-medium">
                      {dish}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {!mealOpen && (
              <button
                onClick={() => setMealOpen(true)}
                className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-brand/10 text-brand text-[14px] font-bold active:scale-[0.98] transition-transform"
              >
                🍽️ 點我選擇你要吃的餐點
              </button>
            )}
            {mealOpen && (
              <button
                onClick={() => setMealOpen(false)}
                className="mt-3 w-full flex items-center justify-center gap-2 py-2 text-text-3 text-[12px] font-medium"
              >
                收合選餐 ▲
              </button>
            )}
          </>
        )}
      </div>

      {/* Meal picker expandable */}
      <AnimatePresence>
        {mealOpen && item.voteLink && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              <div className="h-px bg-divider mb-3" />
              <MealPicker />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
