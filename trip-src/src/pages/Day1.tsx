import { motion } from 'framer-motion'
import DayTimeline from '../components/DayTimeline'
import { day1Schedule } from '../data/schedule'

export default function Day1() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {/* Big number hero — Cal AI style */}
      <div className="px-6 pt-6 pb-2">
        <p className="text-[11px] font-semibold text-brand tracking-[0.15em] uppercase">3月9日 週一</p>
        <h2 className="text-[42px] font-bold text-text-1 tracking-tight leading-none mt-1">Day 1</h2>
        <p className="text-[14px] text-text-2 mt-2">公司出發 → 頭城海鮮 → 場勘 → 民宿 → 夜市 → 派對</p>
      </div>
      <DayTimeline schedule={day1Schedule} />
    </motion.div>
  )
}
