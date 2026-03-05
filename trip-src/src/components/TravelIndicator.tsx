import { motion } from 'framer-motion'

export default function TravelIndicator({ text }: { text: string }) {
  return (
    <motion.div
      className="flex items-center justify-center gap-2 py-3"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="h-px w-8 bg-divider" />
      <span className="text-[11px] text-text-3 font-medium mono">{text}</span>
      <div className="h-px w-8 bg-divider" />
    </motion.div>
  )
}
