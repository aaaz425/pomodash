'use client';

import { DatePickerInput } from '@/components/shared/DatePickerInput';

interface Props {
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (v: string) => void;
  onDateToChange: (v: string) => void;
  markedDates?: Set<string>;
}

type DatePreset = 'today' | 'week' | 'month';

const PRESETS: { label: string; preset: DatePreset }[] = [
  { label: '오늘', preset: 'today' },
  { label: '이번 주', preset: 'week' },
  { label: '이번 달', preset: 'month' },
];

function getDateRange(preset: DatePreset): { from: string; to: string } {
  const today = new Date();
  const toKey = today.toISOString().slice(0, 10);
  if (preset === 'today') return { from: toKey, to: toKey };
  if (preset === 'week') {
    const mon = new Date(today);
    mon.setDate(today.getDate() - (today.getDay() || 7) + 1);
    return { from: mon.toISOString().slice(0, 10), to: toKey };
  }
  return { from: `${toKey.slice(0, 7)}-01`, to: toKey };
}

export function JournalDateRangeFilter({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  markedDates,
}: Props) {
  const today = new Date().toISOString().slice(0, 10);

  function isPresetActive(preset: DatePreset) {
    const { from, to } = getDateRange(preset);
    return dateFrom === from && dateTo === to;
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        기간
      </span>
      <div className="flex gap-1.5">
        {PRESETS.map(({ label, preset }) => (
          <button
            key={preset}
            onClick={() => {
              const { from, to } = getDateRange(preset);
              onDateFromChange(from);
              onDateToChange(to);
            }}
            className={[
              'flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors',
              isPresetActive(preset)
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-transparent text-muted-foreground border-border hover:border-foreground/40',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <DatePickerInput
            value={dateFrom}
            onChange={onDateFromChange}
            max={dateTo && dateTo < today ? dateTo : today}
            placeholder="시작일"
            markedDates={markedDates}
          />
        </div>
        <span className="text-muted-foreground text-sm shrink-0">-</span>
        <div className="flex-1">
          <DatePickerInput
            value={dateTo}
            onChange={onDateToChange}
            min={dateFrom || undefined}
            max={today}
            placeholder="종료일"
            markedDates={markedDates}
          />
        </div>
      </div>
    </div>
  );
}
