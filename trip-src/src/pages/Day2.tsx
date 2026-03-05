import { motion } from 'framer-motion'
import DayTimeline from '../components/DayTimeline'
import { day2Schedule } from '../data/schedule'

export default function Day2() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-6 pt-6 pb-2">
        <p className="text-[11px] font-semibold text-brand-blue tracking-[0.15em] uppercase">3月10日 週二</p>
        <h2 className="text-[42px] font-bold text-text-1 tracking-tight leading-none mt-1">Day 2</h2>
        <p className="text-[14px] text-text-2 mt-2">退房 → 蜊埤湖 → 無菜單料理 → 遊湖 → 下午茶 → 回家</p>
      </div>
      <DayTimeline schedule={day2Schedule} />
    </motion.div>
  )
}
