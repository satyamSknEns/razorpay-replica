'use client'

import { useState } from 'react';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import isToday from 'dayjs/plugin/isToday';
import isoWeek from 'dayjs/plugin/isoWeek';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';

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
    <div className="w-full mt-4 text-white min-w-[430px] overflow-x-auto cursor-pointer">
        <div className="flex justify-between items-center mb-4">
            <div className="text-center items-center flex gap-3">
              <button className='border border-[#4c5d75] px-2 pt-.5 pb-1 rounded bg-[#2f3743] cursor-pointer' onClick={goToPreviousMonth}><WestIcon fontSize='small'/></button>
              <button className='border border-[#4c5d75] px-2 pt-.5 pb-1 rounded bg-[#2f3743] cursor-pointer' onClick={goToNextMonth}><EastIcon fontSize='small'/></button>
                <select
                  value={currentDate.month()}
                  onChange={(e) =>
                    setCurrentDate(currentDate.month(Number(e.target.value)))
                  }
                  className="bg-gray-800 rounded px-2 py-1 border border-[#4c5d75] cursor-pointer"
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
                  className="bg-gray-800 rounded px-2 py-1 border border-[#4c5d75] cursor-pointer"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={2020 + i}>
                      {2020 + i}
                    </option>
                  ))}
                </select>
            </div>
            <div className='border border-[#4c5d75] rounded'>
              <button
                onClick={handleToday}
                className="text-base bg-[#2f3743] px-4 py-1 rounded cursor-pointer"
              >
                Today
              </button>
            </div>
        </div>
      <div className='border border-[#2d3a4b] bg-gray-800 rounded py-4'>
          <div className="grid grid-cols-7 text-center font-semibold mb-2">
            {daysShort.map((day) => (
              <div key={day} className='py-2 mx-2'>{day}</div>
            ))}
          </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((date, i) => {
          const isCurrentMonth = date.month() === currentDate.month()
          const isTodayDate = date.isSame(today, 'day')
          const isSunday=date.day()===0;
          const isSelected = date.isSame(selectedDate, 'day')
          const isSaturday = date.day() === 6;
            const allMonthSaturdays = days.filter(
              d =>d.day() === 6 &&
                d.month() === date.month() &&
                d.year() === date.year()
            );

            const saturdayIndex = allMonthSaturdays.findIndex(d => d.isSame(date, 'day')) + 1;
            const isRedDate = isSaturday && [1, 3, 5].includes(saturdayIndex);

          return (
            <div
              key={i}
              onClick={() => setSelectedDate(date)} 
              className={classNames(
                'h-10 flex items-center justify-center text-sm cursor-pointer transition duration-150',
                {
                  'bg-blue-800 rounded text-white': isSelected,
                  'bg-gray-700 text-white rounded': isTodayDate && !isSelected,
                  'text-green-600 font-semibold': (isSunday || isRedDate) && !isTodayDate && !isSelected,
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
    </div>
  )
}
