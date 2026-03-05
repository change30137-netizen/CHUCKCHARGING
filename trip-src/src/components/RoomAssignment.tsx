import { motion } from 'framer-motion'
import { rooms } from '../data/members'

export default function RoomAssignment() {
  return (
    <div className="px-5 space-y-3">
      {rooms.map((room, i) => (
        <motion.div
          key={room.id}
          className="cal-card p-5"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06, duration: 0.35 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-[15px] font-bold text-text-1">{room.name}</h3>
              <p className="text-[12px] text-text-3 mt-0.5">{room.type}</p>
            </div>
            <span className="text-2xl">{room.icon}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {room.members.map((m) => (
              <span key={m} className="text-[13px] font-semibold text-brand bg-brand-light px-3.5 py-1.5 rounded-full">
                {m}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
