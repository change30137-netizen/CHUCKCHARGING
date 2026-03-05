import { motion } from 'framer-motion'
import VoteForm from '../components/VoteForm'
import VoteResults from '../components/VoteResults'
import { useVote } from '../hooks/useVote'

export default function VotePage() {
  const { votes, loading, submitting, submitVote } = useVote()

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.25 }}
      className="px-4 py-3"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-4 mb-5"
      >
        <h2 className="text-xl font-black">
          <span className="gradient-text-warm">午餐投票</span>
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          石港春帆精緻海鮮餐廳 — 選出你最想吃的菜色！
        </p>
      </motion.div>

      <div className="glass-card rounded-2xl p-4 mb-5">
        <VoteForm onSubmit={submitVote} submitting={submitting} />
      </div>

      <div className="glass-card rounded-2xl p-4">
        <VoteResults votes={votes} loading={loading} />
      </div>
    </motion.div>
  )
}
