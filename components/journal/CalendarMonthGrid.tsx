'use client';

import type { DayActivity } from '@/types';

interface Props {
  data: DayActivity[];
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

function parseDateKey(dateKey: string): Date {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function isSameDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}분`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours}시간` : `${hours}시간 ${rest}분`;
}

export function CalendarMonthGrid({ data, selectedDate, onSelectDate }: Props) {
  if (data.length === 0) return null;

  const firstDayOffset = parseDateKey(data[0].date).getDay(); // 0=일 ... 6=토
  const cells: Array<DayActivity | null> = [...Array(firstDayOffset).fill(null), ...data];
  const remainder = cells.length % 7;
  if (remainder > 0) cells.push(...Array(7 - remainder).fill(null));

  const weeks: Array<Array<DayActivity | null>> = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="grid grid-cols-7">
        {DAY_LABELS.map((label) => (
          <span key={label} className="text-[11px] text-muted-foreground text-center py-1">
            {label}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1">
            {week.map((day, di) => {
              if (!day) return <div key={`empty-${wi}-${di}`} />;

              const date = parseDateKey(day.date);
              const isSelected = selectedDate ? isSameDate(date, selectedDate) : false;
              const hasFocus = day.focusMinutes > 0;

              return (
                <button
                  key={day.date}
                  onClick={() => onSelectDate(date)}
                  aria-label={`${date.getDate()}일${hasFocus ? `, ${formatMinutes(day.focusMinutes)} 집중` : ''}`}
                  className={[
                    'flex flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 text-xs transition-colors',
                    isSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted',
                  ].join(' ')}
                >
                  <span>{date.getDate()}</span>
                  {hasFocus && (
                    <>
                      <span
                        className={[
                          'sm:hidden w-1.5 h-1.5 rounded-full',
                          isSelected ? 'bg-primary-foreground' : 'bg-primary',
                        ].join(' ')}
                      />
                      <span
                        className={[
                          'hidden sm:inline text-[10px]',
                          isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground',
                        ].join(' ')}
                      >
                        {formatMinutes(day.focusMinutes)}
                      </span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
