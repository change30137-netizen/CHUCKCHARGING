import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import Day1 from './pages/Day1'
import Day2 from './pages/Day2'
import RoomPage from './pages/RoomPage'
import OrderPage from './pages/OrderPage'

const pages = [Day1, Day2, RoomPage, OrderPage]

export default function App() {
  const [activeTab, setActiveTab] = useState(0)
  const Page = pages[activeTab]

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main className="max-w-lg mx-auto pt-[56px] pb-[52px] no-scrollbar">
        <AnimatePresence mode="wait">
          <Page key={activeTab} />
        </AnimatePresence>
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
