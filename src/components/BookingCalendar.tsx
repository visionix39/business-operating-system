import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { bookedRanges } from '../data/mock'

interface Props {
  propertyId: string
  checkIn: string
  checkOut: string
  onSelectRange: (checkIn: string, checkOut: string) => void
}

function isBooked(date: Date, ranges: { start: string; end: string }[]) {
  return ranges.some((r) =>
    isWithinInterval(date, {
      start: startOfDay(parseISO(r.start)),
      end: startOfDay(parseISO(r.end)),
    }),
  )
}

export function BookingCalendar({ propertyId, checkIn, checkOut, onSelectRange }: Props) {
  const [month, setMonth] = useState(new Date(2026, 7, 1))
  const [picking, setPicking] = useState<'in' | 'out'>('in')
  const ranges = bookedRanges[propertyId] ?? []

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month))
    const end = endOfWeek(endOfMonth(month))
    return eachDayOfInterval({ start, end })
  }, [month])

  const inDate = checkIn ? parseISO(checkIn) : null
  const outDate = checkOut ? parseISO(checkOut) : null

  const handleDay = (day: Date) => {
    if (isBooked(day, ranges) || isBefore(day, startOfDay(new Date('2026-08-04')))) return

    if (picking === 'in' || !inDate || (outDate && isBefore(day, inDate))) {
      onSelectRange(format(day, 'yyyy-MM-dd'), '')
      setPicking('out')
      return
    }

    if (isSameDay(day, inDate) || isBefore(day, inDate)) {
      onSelectRange(format(day, 'yyyy-MM-dd'), '')
      setPicking('out')
      return
    }

    // block if any booked night in range
    const span = eachDayOfInterval({ start: inDate, end: day })
    if (span.some((d) => isBooked(d, ranges))) return

    onSelectRange(format(inDate, 'yyyy-MM-dd'), format(day, 'yyyy-MM-dd'))
    setPicking('in')
  }

  return (
    <div className="calendar">
      <div className="calendar-header">
        <h3>{format(month, 'MMMM yyyy')}</h3>
        <div className="calendar-nav">
          <button type="button" aria-label="Previous month" onClick={() => setMonth((m) => subMonths(m, 1))}>
            <ChevronLeft size={16} />
          </button>
          <button type="button" aria-label="Next month" onClick={() => setMonth((m) => addMonths(m, 1))}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div className="calendar-grid">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <div key={d} className="calendar-dow">
            {d}
          </div>
        ))}
        {days.map((day) => {
          const booked = isBooked(day, ranges)
          const muted = !isSameMonth(day, month)
          const selected =
            (inDate && isSameDay(day, inDate)) || (outDate && isSameDay(day, outDate))
          const inRange =
            inDate &&
            outDate &&
            isWithinInterval(day, { start: inDate, end: outDate }) &&
            !selected

          const classes = [
            'calendar-day',
            'selectable',
            muted ? 'muted' : '',
            booked ? 'booked' : '',
            selected ? 'selected' : '',
            inRange ? 'in-range' : '',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <button
              key={day.toISOString()}
              type="button"
              className={classes}
              disabled={booked || muted}
              onClick={() => handleDay(day)}
            >
              {format(day, 'd')}
            </button>
          )
        })}
      </div>
      <div className="calendar-legend">
        <span>
          <i className="legend-dot available" /> Available
        </span>
        <span>
          <i className="legend-dot booked" /> Booked
        </span>
      </div>
    </div>
  )
}
