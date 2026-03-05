import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const LOGO_URL = 'https://ap13.ragic.com/sims/file.jsp?a=ChuckChargingCC&f=%E8%B3%87%E7%94%A2+%EF%BC%92.png'
const TRIP_DATE = new Date('2026-03-09T10:00:00+08:00')

function getCountdown() {
  const now = new Date()
  const diff = TRIP_DATE.getTime() - now.getTime()
  if (diff <= 0) return null
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff / 3600000) % 24),
    m: Math.floor((diff / 60000) % 60),
    s: Math.floor((diff / 1000) % 60),
  }
}

// Circular progress ring
function CountdownRing({ value, max, label, size = 44 }: { value: number; max: number; label: string; size?: number }) {
  const r = (size - 6) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (value / max) * circ

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f0f0f0" strokeWidth={3} />
        <motion.circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke="#f97316"
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={circ}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-[15px] font-bold text-text-1 mono leading-none">{value}</span>
      </div>
      <span className="text-[9px] text-text-3 font-medium mt-0.5">{label}</span>
    </div>
  )
}

export default function Header() {
  const [cd, setCd] = useState(getCountdown)
  useEffect(() => {
    const t = setInterval(() => setCd(getCountdown()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-2xl">
      <div className="max-w-lg mx-auto px-5 h-14 flex items-center gap-3">
        <img src={LOGO_URL} alt="" className="w-7 h-7 rounded-md object-contain" />
        <span className="text-[13px] font-semibold text-text-1 flex-1">Fun鬆二日遊</span>

        {cd ? (
          <div className="flex items-center gap-2">
            {[
              { v: cd.d, max: 30, l: '日' },
              { v: cd.h, max: 24, l: '時' },
              { v: cd.m, max: 60, l: '分' },
              { v: cd.s, max: 60, l: '秒' },
            ].map((item) => (
              <div key={item.l} className="relative flex flex-col items-center">
                <CountdownRing value={item.v} max={item.max} label={item.l} size={36} />
              </div>
            ))}
          </div>
        ) : (
          <span className="text-[13px] font-bold text-brand">出發！</span>
        )}
      </div>
    </header>
  )
}
