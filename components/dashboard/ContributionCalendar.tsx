import type { DayActivity } from '@/types';

interface Props {
  data: DayActivity[];
}

const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

const INTENSITY_LEVELS = [
  { minMinutes: 1, maxMinutes: 29, className: 'bg-green-200 dark:bg-green-900' },
  { minMinutes: 30, maxMinutes: 59, className: 'bg-green-400 dark:bg-green-700' },
  { minMinutes: 60, maxMinutes: 89, className: 'bg-green-500 dark:bg-green-600' },
  { minMinutes: 90, maxMinutes: Infinity, className: 'bg-green-600 dark:bg-green-400' },
] as const;

function intensityClass(minutes: number): string {
  if (minutes === 0) return 'bg-muted';
  return INTENSITY_LEVELS.find((l) => minutes >= l.minMinutes && minutes <= l.maxMinutes)!
    .className;
}

function formatTitle(dateStr: string, minutes: number): string {
  const date = new Date(dateStr + 'T00:00:00');
  const month = date.getMonth() + 1;
  const day = date.getDate();
  if (minutes === 0) return `${month}월 ${day}일`;
  return `${month}월 ${day}일 · ${minutes}분`;
}

// weekStartsOn: 1 (월요일) 기준 — 월=0 ... 일=6
function dayOfWeekIndex(dateStr: string): number {
  const d = new Date(dateStr + 'T00:00:00');
  return (d.getDay() + 6) % 7; // 0=월,1=화,...,6=일
}

export function ContributionCalendar({ data }: Props) {
  if (data.length === 0) return null;

  const firstDayOffset = dayOfWeekIndex(data[0].date);
  const cells: Array<DayActivity | null> = [...Array(firstDayOffset).fill(null), ...data];

  // 마지막 주를 7의 배수로 채움
  const remainder = cells.length % 7;
  if (remainder > 0) {
    cells.push(...Array(7 - remainder).fill(null));
  }

  const weeks: Array<Array<DayActivity | null>> = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <div className="flex flex-col gap-2">
      {/* 요일 헤더 */}
      <div className="flex gap-1">
        {DAY_LABELS.map((label) => (
          <span key={label} className="w-3.5 shrink-0 text-[9px] text-muted-foreground text-center">
            {label}
          </span>
        ))}
      </div>

      {/* 날짜 셀 */}
      <div className="flex flex-col gap-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex gap-1">
            {week.map((day, di) =>
              day ? (
                <div
                  key={day.date}
                  title={formatTitle(day.date, day.focusMinutes)}
                  className={`w-3.5 h-3.5 shrink-0 rounded-[3px] ${intensityClass(day.focusMinutes)}`}
                />
              ) : (
                <div key={`empty-${wi}-${di}`} className="w-3.5 h-3.5 shrink-0" />
              ),
            )}
          </div>
        ))}
      </div>

      {/* 범례 */}
      <div className="flex items-center gap-1.5 mt-1 self-end">
        <span className="text-[10px] text-muted-foreground">적음</span>
        {INTENSITY_LEVELS.map((l) => (
          <div key={l.minMinutes} className={`w-3.5 h-3.5 rounded-[3px] ${l.className}`} />
        ))}
        <span className="text-[10px] text-muted-foreground">많음</span>
      </div>
    </div>
  );
}
