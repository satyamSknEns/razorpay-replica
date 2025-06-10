'use client'

import { useState } from 'react'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import isToday from 'dayjs/plugin/isToday'
import isoWeek from 'dayjs/plugin/isoWeek'

import classNames from 'classnames'

dayjs.extend(weekday)
dayjs.extend(isToday)
dayjs.extend(isoWeek)

const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function Calender() {
  const [currentDate, setCurrentDate] = useState(dayjs())
  const [selectedDate, setSelectedDate] = useState(dayjs()) // <-- New

  const startOfMonth = currentDate.startOf('month')
  const endOfMonth = currentDate.endOf('month')
  const startDate = startOfMonth.startOf('week')
  const endDate = endOfMonth.endOf('week')

  const today = dayjs()

  const generateDates = () => {
    const dates = []
    let date = startDate
    while (date.isBefore(endDate) || date.isSame(endDate)) {
      dates.push(date)
      date = date.add(1, 'day')
    }
    return dates
  }

  const goToPreviousMonth = () => {
    setCurrentDate(currentDate.subtract(1, 'month'))
  }

  const goToNextMonth = () => {
    setCurrentDate(currentDate.add(1, 'month'))
  }

  const handleToday = () => {
    setCurrentDate(dayjs())
    setSelectedDate(dayjs()) 
  }

  const days = generateDates()

  return (
    <div className="w-full p-4 bg-[#1E2939] text-white min-w-[600px] overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <button className='border border-[#4c5d75] px-2 py-1 ml-2 rounded' onClick={goToPreviousMonth}><span className='mr-1.5'>&lt;</span> Prev</button>
        <div className="text-center">
          <button
            onClick={handleToday}
            className="text-xl bg-gray-800 px-2 py-1 rounded"
          >
            Today
          </button>
          <div className="flex gap-2 justify-center items-center mt-4">
            <select
              value={currentDate.month()}
              onChange={(e) =>
                setCurrentDate(currentDate.month(Number(e.target.value)))
              }
              className="bg-gray-800 rounded px-2 py-1 border border-[#4c5d75]"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {dayjs().month(i).format('MMMM')}
                </option>
              ))}
            </select>
            <select
              value={currentDate.year()}
              onChange={(e) =>
                setCurrentDate(currentDate.year(Number(e.target.value)))
              }
              className="bg-gray-800 rounded px-2 py-1 border border-[#4c5d75]"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={2020 + i}>
                  {2020 + i}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button className='border border-[#4c5d75] px-2 py-1 mr-2 rounded' onClick={goToNextMonth}>Next <span className='ml-1.5'>&gt;</span></button>
      </div>

      <div className="grid grid-cols-7 text-center font-semibold mb-2">
        {daysShort.map((day) => (
          <div key={day} className='border py-2 mx-2 border-[#2d3a4b] rounded bg-[#2d3a4b]'>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((date, i) => {
          const isCurrentMonth = date.month() === currentDate.month()
          const isTodayDate = date.isSame(today, 'day')
          const isSelected = date.isSame(selectedDate, 'day')

          return (
            <div
              key={i}
              onClick={() => setSelectedDate(date)} 
              className={classNames(
                'h-10 flex items-center justify-center text-sm cursor-pointer transition duration-150 border py-2 m-2 border-[#2d3a4b] rounded',
                {
                  'bg-blue-600 text-white': isSelected,
                  'bg-gray-700 text-white': isTodayDate && !isSelected,
                //   'bg-red-900 text-white': isCurrentMonth && date.date() <= 2 && date.day() < 5,
                //   'bg-yellow-700 text-white': isCurrentMonth && date.date() === 10,
                //   'text-green-500': isCurrentMonth && !isSelected && !isTodayDate,
                  'text-blue-600': !isCurrentMonth,
                }
              )}
            >
              {date.date()}
            </div>
          )
        })}
      </div>
    </div>
  )
}
