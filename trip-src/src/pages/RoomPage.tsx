import { motion } from 'framer-motion'
import RoomAssignment from '../components/RoomAssignment'

export default function RoomPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-6 pt-6 pb-2">
        <p className="text-[11px] font-semibold text-brand-green tracking-[0.15em] uppercase">宜蘭員山</p>
        <h2 className="text-[42px] font-bold text-text-1 tracking-tight leading-none mt-1">住宿</h2>
        <p className="text-[14px] text-text-2 mt-2">7 間四人房 · 兩張雙人床</p>
      </div>
      <RoomAssignment />
    </motion.div>
  )
}
