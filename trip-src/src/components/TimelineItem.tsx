import { motion } from 'framer-motion'
import type { ScheduleItem } from '../data/schedule'
import LocationCard from './LocationCard'

interface Props {
  item: ScheduleItem
  index: number
  isLast: boolean
  onGoVote?: () => void
}

export default function TimelineItem({ item, index, isLast, onGoVote }: Props) {
  return (
    <motion.div
      className="flex gap-4"
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center w-14 shrink-0">
        <motion.div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg shrink-0 ${
            item.highlight
              ? 'bg-gradient-to-br from-amber-accent to-orange-400 text-white shadow-lg shadow-amber-accent/30'
              : 'bg-gradient-to-br from-sky-primary/15 to-blue-100 text-sky-primary'
          }`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {item.icon}
        </motion.div>
        {!isLast && (
          <div className="w-0.5 flex-1 my-1.5 bg-gradient-to-b from-sky-primary/20 to-transparent" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-6 pt-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`text-xs font-black px-2 py-0.5 rounded-md ${
            item.highlight
              ? 'bg-amber-accent/15 text-amber-accent-dark'
              : 'bg-sky-primary/10 text-sky-primary'
          }`}>
            {item.time}
          </span>
        </div>
        <h3 className={`font-bold text-[15px] leading-snug mt-1 ${
          item.highlight ? 'gradient-text-warm' : 'text-dark-bg'
        }`}>
          {item.title}
        </h3>
        {item.description && (
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.description}</p>
        )}
        {(item.address || item.menu) && (
          <LocationCard item={item} onGoVote={onGoVote} />
        )}
      </div>
    </motion.div>
  )
}
