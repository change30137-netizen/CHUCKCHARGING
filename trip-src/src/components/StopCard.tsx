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

export default function StopCard({ item, index }: Props) {
  const [expanded, setExpanded] = useState(false)
  const imageUrl = item.imageKey ? stopImages[item.imageKey] : null
  const isLogo = item.imageKey ? logoKeys.has(item.imageKey) : false
  const hasDetails = item.menu || item.voteLink || item.tips

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
        <div className={`relative overflow-hidden rounded-t-[20px] ${isLogo ? 'h-32 bg-brand-dark flex items-center justify-center' : 'h-44'}`}>
          <img src={imageUrl} alt={item.title} className={`${isLogo ? 'h-16 w-auto object-contain' : 'w-full h-full object-cover'}`} loading="lazy" />
          {!isLogo && <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />}
          <div className="absolute bottom-3 left-4 flex items-center gap-2">
            <span className="text-[12px] font-bold text-white mono bg-black/30 backdrop-blur-md px-2 py-0.5 rounded-lg">
              {item.time}
            </span>
            {item.tag && (
              <span className="text-[10px] font-semibold text-white bg-brand/80 backdrop-blur-md px-2 py-0.5 rounded-lg">
                {item.tag}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div
        className={`px-5 ${imageUrl ? 'pt-3.5' : 'pt-4'} ${hasDetails ? 'cursor-pointer' : ''}`}
        onClick={() => hasDetails && setExpanded(!expanded)}
      >
        {/* No-image: show time + tag inline */}
        {!imageUrl && (
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[12px] font-bold text-brand mono">{item.time}</span>
            {item.tag && (
              <span className="text-[10px] font-semibold text-text-3 bg-divider px-2 py-0.5 rounded-md">
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

        {/* Nav button — always visible, big and obvious */}
        {item.mapUrl && (
          <a
            href={item.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-3 flex items-center justify-center gap-2.5 py-3 rounded-2xl bg-brand-blue text-white text-[14px] font-bold shadow-lg shadow-brand-blue/25 active:scale-[0.98] transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            開啟導航
          </a>
        )}

        {/* Expand hint */}
        {item.voteLink && !expanded && (
          <div className="mt-3 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-brand/10 text-brand text-[13px] font-bold">
            🍽️ 點我選擇你要吃的餐點
          </div>
        )}
        {item.tips && !expanded && (
          <div className="mt-3 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-brand-light text-brand text-[13px] font-bold">
            📋 點我看推薦美食
          </div>
        )}
        {hasDetails && !item.voteLink && !item.tips && !expanded && (
          <div className="flex items-center justify-center pt-2 pb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-text-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
        {expanded && hasDetails && (
          <div className="flex items-center justify-center pt-2 pb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-text-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </div>
        )}
        {!hasDetails && <div className="h-4" />}
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              <div className="h-px bg-divider mb-3" />

              {item.tips && (
                <div className="mb-3">
                  <p className="text-[11px] font-bold text-text-3 tracking-wider uppercase mb-2">推薦必吃</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tips.map((tip, i) => (
                      <motion.span
                        key={tip}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="text-[12px] text-text-1 bg-brand-light px-3 py-1.5 rounded-xl font-medium"
                      >
                        {tip}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}

              {item.menu && !item.voteLink && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {item.menu.map((dish, i) => (
                    <motion.span
                      key={dish}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="text-[12px] text-text-2 bg-bg px-3 py-1.5 rounded-xl font-medium"
                    >
                      {dish}
                    </motion.span>
                  ))}
                </div>
              )}

              {item.voteLink && (
                <>
                  {item.menu && (
                    <div className="mb-4">
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
                  <MealPicker />
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
