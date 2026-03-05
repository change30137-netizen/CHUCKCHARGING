import { motion } from 'framer-motion'

const tabs = [
  { id: 0, label: 'Day 1' },
  { id: 1, label: 'Day 2' },
  { id: 2, label: '住宿' },
  { id: 3, label: '點餐' },
]

interface Props {
  activeTab: number
  onTabChange: (tab: number) => void
}

export default function BottomNav({ activeTab, onTabChange }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-2xl">
      <div className="max-w-lg mx-auto flex h-12">
        {tabs.map((tab) => {
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex-1 relative flex items-center justify-center"
            >
              {active && (
                <motion.div
                  layoutId="pill"
                  className="absolute inset-x-4 inset-y-1.5 bg-brand/10 rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className={`relative z-10 text-[13px] font-semibold transition-colors ${
                active ? 'text-brand' : 'text-text-3'
              }`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
