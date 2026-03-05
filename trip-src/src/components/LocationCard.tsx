import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ScheduleItem } from '../data/schedule'

interface Props {
  item: ScheduleItem
  onGoVote?: () => void
}

export default function LocationCard({ item, onGoVote }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      layout
      className="mt-2.5 glass-card glass-card-hover rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
      onClick={() => setExpanded(!expanded)}
      whileTap={{ scale: 0.98 }}
    >
      <div className="px-3.5 py-2.5">
        {item.address && (
          <div className="flex items-center gap-1.5">
            <span className="text-[10px]">📍</span>
            <p className="text-xs text-slate-500 truncate">{item.address}</p>
          </div>
        )}
        {!expanded && (
          <p className="text-[11px] text-sky-primary font-medium mt-1 flex items-center gap-1">
            {item.menu ? `${item.menu.length} 道菜色 ·` : ''} 點擊展開
            <motion.span
              animate={{ rotate: expanded ? 180 : 0 }}
              className="inline-block text-[10px]"
            >
              ▼
            </motion.span>
          </p>
        )}
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {item.menu && (
              <div className="px-3.5 pb-3">
                <div className="flex flex-wrap gap-1.5">
                  {item.menu.map((dish, i) => (
                    <motion.span
                      key={dish}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="text-xs bg-gradient-to-r from-sky-50 to-blue-50 text-sky-primary-dark px-2.5 py-1 rounded-lg font-medium border border-sky-100/50"
                    >
                      {dish}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex">
              {onGoVote && (
                <button
                  onClick={(e) => { e.stopPropagation(); onGoVote() }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-accent to-orange-400 text-white text-xs font-black hover:from-amber-accent-dark hover:to-orange-500 transition-all"
                >
                  🗳️ 選我要吃的餐點
                </button>
              )}
              {item.mapUrl && (
                <a
                  href={item.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-sky-primary to-blue-500 text-white text-xs font-bold hover:from-sky-primary-dark hover:to-blue-600 transition-all`}
                >
                  📍 Google Maps 導航
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
