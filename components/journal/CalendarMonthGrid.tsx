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

function headerTextClass(dayOfWeek: number): string {
  if (dayOfWeek === 0) return 'text-red-500 dark:text-red-400';
  if (dayOfWeek === 6) return 'text-blue-500 dark:text-blue-400';
  return 'text-muted-foreground';
}

function dayNumberTextClass(dayOfWeek: number): string {
  if (dayOfWeek === 0) return 'text-red-500 dark:text-red-400';
  if (dayOfWeek === 6) return 'text-blue-500 dark:text-blue-400';
  return 'text-foreground';
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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="flex flex-col rounded-xl border border-border overflow-hidden shadow-sm">
      <div className="grid grid-cols-7 border-b border-border bg-muted/40">
        {DAY_LABELS.map((label, i) => (
          <span
            key={label}
            className={`text-xs font-semibold text-center py-2.5 ${headerTextClass(i)}`}
          >
            {label}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-px bg-border">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-px">
            {week.map((day, di) => {
              if (!day) {
                return (
                  <div
                    key={`empty-${wi}-${di}`}
                    className="min-h-[92px] sm:min-h-[132px] bg-muted/10"
                  />
                );
              }

              const date = parseDateKey(day.date);
              const dayOfWeek = date.getDay();
              const isSelected = selectedDate ? isSameDate(date, selectedDate) : false;
              const isToday = isSameDate(date, today);
              const isFuture = date.getTime() > today.getTime();
              const hasFocus = day.focusMinutes > 0 && !isFuture;
              const isDisabled = isFuture || !hasFocus;

              return (
                <button
                  key={day.date}
                  onClick={() => onSelectDate(date)}
                  disabled={isDisabled}
                  aria-label={`${date.getDate()}일${hasFocus ? `, ${formatMinutes(day.focusMinutes)} 집중` : ''}`}
                  className={[
                    'flex flex-col items-start min-h-[92px] sm:min-h-[132px] p-2 sm:p-3 transition-colors',
                    isDisabled
                      ? 'bg-card cursor-not-allowed'
                      : isSelected
                        ? 'bg-primary/10'
                        : 'bg-card hover:bg-muted/60',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'flex items-center justify-center w-7 h-7 rounded-full text-sm transition-colors',
                      isFuture
                        ? 'font-medium text-muted-foreground/30'
                        : isSelected
                          ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                          : isToday
                            ? 'bg-primary/15 font-semibold text-primary'
                            : `font-medium ${dayNumberTextClass(dayOfWeek)}`,
                    ].join(' ')}
                  >
                    {date.getDate()}
                  </span>

                  {hasFocus && (
                    <>
                      <span className="sm:hidden mt-auto w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="hidden sm:inline-flex mt-auto items-center self-start rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
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
