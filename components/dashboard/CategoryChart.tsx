'use client';

import { useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { getCategoryFocusData } from '@/lib/dashboard';
import { formatDuration } from '@/lib/sessionUtils';
import type { Category, Session, Task } from '@/types';

interface Props {
  sessions: Session[];
  tasks: Task[];
  categories: Category[];
}

export function CategoryChart({ sessions, tasks, categories }: Props) {
  const data = useMemo(
    () => getCategoryFocusData(sessions, tasks, categories),
    [sessions, tasks, categories],
  );

  const totalMinutes = data.reduce((sum, d) => sum + d.minutes, 0);
  const hasData = data.length > 0;

  return (
    <div className="flex flex-col gap-3 p-5 rounded-lg border border-border bg-card min-h-[180px]">
      <p className="text-sm font-semibold text-foreground">카테고리별 집중</p>

      {hasData ? (
        <div className="flex items-center justify-center gap-4 flex-1">
          {/* Donut chart */}
          <div
            className="relative shrink-0 w-[120px] h-[120px]"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' }}
          >
            <ResponsiveContainer width="100%" height="100%" minHeight={120}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="minutes"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="100%"
                  paddingAngle={3}
                  stroke="var(--card)"
                  strokeWidth={2}
                  startAngle={90}
                  endAngle={-270}
                >
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(value, name) => [
                    typeof value === 'number' ? formatDuration(value * 60) : String(value),
                    String(name ?? ''),
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-bold text-foreground leading-tight text-center max-w-[60px] break-keep">
                {formatDuration(totalMinutes * 60)}
              </span>
              <span className="text-[10px] text-muted-foreground">총 집중</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            {data.map((item) => (
              <div key={item.name} className="flex items-center justify-between gap-2 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="shrink-0 w-2 h-2 rounded-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs font-medium text-foreground truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-xs font-semibold text-foreground w-[68px] text-right tabular-nums">
                    {formatDuration(item.minutes * 60)}
                  </span>
                  <span className="text-[11px] text-muted-foreground w-7 text-right tabular-nums">
                    {item.percent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs text-muted-foreground">아직 기록된 세션이 없어요</p>
        </div>
      )}
    </div>
  );
}
