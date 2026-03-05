import type { ScheduleItem } from '../data/schedule'
import StopCard from './StopCard'
import TravelIndicator from './TravelIndicator'

interface Props {
  schedule: ScheduleItem[]
}

export default function DayTimeline({ schedule }: Props) {
  return (
    <div className="px-4 py-1 space-y-0">
      {schedule.map((item, i) => (
        <div key={item.time + item.title}>
          <StopCard item={item} index={i} />
          {item.travelTime && i < schedule.length - 1 && (
            <TravelIndicator text={item.travelTime} />
          )}
        </div>
      ))}
    </div>
  )
}
