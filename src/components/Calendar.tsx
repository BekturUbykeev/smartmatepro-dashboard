import { useState } from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'

interface Event {
  id: string
  title: string
  startTime: string
  endTime: string
  duration: number
  color: string
  day: number
}

export function Calendar() {
  const [view, setView] = useState<'month' | 'week' | 'day' | 'list'>('week')
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8, 25)) // September 25, 2025

  const events: Event[] = [
    {
      id: '1',
      title: 'Men\'s Haircut',
      startTime: '9:00',
      endTime: '10:40',
      duration: 100,
      color: 'bg-yellow-400',
      day: 0 // Monday
    },
    {
      id: '2',
      title: 'Beard Trim',
      startTime: '13:00',
      endTime: '14:00',
      duration: 60,
      color: 'bg-yellow-400',
      day: 0
    },
    {
      id: '3',
      title: 'Info Here',
      startTime: '13:00',
      endTime: '14:00',
      duration: 60,
      color: 'bg-orange-500',
      day: 1 // Tuesday
    },
    {
      id: '4',
      title: 'Consultation',
      startTime: '10:00',
      endTime: '11:00',
      duration: 60,
      color: 'bg-green-500',
      day: 3 // Thursday
    },
    {
      id: '5',
      title: 'Full Service',
      startTime: '12:00',
      endTime: '13:00',
      duration: 60,
      color: 'bg-green-500',
      day: 5 // Saturday
    },
    {
      id: '6',
      title: 'Color Treatment',
      startTime: '17:00',
      endTime: '18:00',
      duration: 60,
      color: 'bg-green-500',
      day: 5
    }
  ]

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const hours = Array.from({ length: 15 }, (_, i) => i + 7) // 7 AM to 9 PM

  const getEventPosition = (startTime: string) => {
    const [hour, minute] = startTime.split(':').map(Number)
    return ((hour - 7) * 60 + minute)
  }

  const getDayDate = (dayIndex: number) => {
    const date = new Date(currentDate)
    date.setDate(currentDate.getDate() + dayIndex)
    return date.getDate()
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1>Calendar</h1>
          <div className="flex items-center space-x-2">
            <input
              type="search"
              placeholder="Search for anything..."
              className="px-4 py-2 border rounded-lg w-80 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button className="p-1.5 hover:bg-gray-100 rounded">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3>September 2025</h3>
              <button className="p-1.5 hover:bg-gray-100 rounded">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="bg-gray-100 rounded-lg p-1 flex items-center space-x-1">
              {(['month', 'week', 'day', 'list'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1.5 text-sm rounded capitalize transition-colors ${
                    view === v
                      ? 'bg-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-max">
          {/* Day headers */}
          <div className="sticky top-0 bg-white border-b z-10 grid grid-cols-[80px_repeat(7,minmax(140px,1fr))]">
            <div className="p-3 text-sm text-gray-500 border-r">GMT +2</div>
            {daysOfWeek.map((day, index) => (
              <div key={day} className="p-3 text-center border-r">
                <div className="text-xl font-medium mb-1">{getDayDate(index)}</div>
                <div className="text-sm text-gray-600">{day}</div>
              </div>
            ))}
          </div>

          {/* Time grid */}
          <div className="grid grid-cols-[80px_repeat(7,minmax(140px,1fr))]">
            {/* Time labels */}
            <div className="border-r">
              {hours.map((hour) => (
                <div key={hour} className="h-16 border-b px-3 py-1 text-sm text-gray-500">
                  {hour} {hour < 12 ? 'am' : 'pm'}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {daysOfWeek.map((day, dayIndex) => (
              <div key={day} className="relative border-r">
                {hours.map((hour) => (
                  <div key={hour} className="h-16 border-b" />
                ))}

                {/* Events */}
                {events
                  .filter(event => event.day === dayIndex)
                  .map((event) => {
                    const top = getEventPosition(event.startTime)
                    const height = event.duration

                    return (
                      <div
                        key={event.id}
                        className={`absolute left-1 right-1 ${event.color} rounded-lg p-2 text-white text-sm overflow-hidden`}
                        style={{
                          top: `${(top / 60) * 4}rem`,
                          height: `${(height / 60) * 4}rem`
                        }}
                      >
                        <div className="font-medium">{event.startTime} ({event.duration} mins)</div>
                        {height >= 60 && (
                          <div className="text-xs opacity-90 mt-1">{event.title}</div>
                        )}
                      </div>
                    )
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Add Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center">
        <Plus className="w-6 h-6" />
      </button>
    </div>
  )
}