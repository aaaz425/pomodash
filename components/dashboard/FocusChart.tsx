'use client';

import { useMemo } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { getFocusTrendData, type TabType } from '@/lib/dashboard';
import type { Category, Session, Task } from '@/types';

interface Props {
  sessions: Session[];
  tasks: Task[];
  categories: Category[];
  tab: TabType;
  focusLabel: string;
}

const isHorizontal = (tab: TabType) => tab === 'today' || tab === 'month';

export function FocusChart({ sessions, tasks, categories, tab, focusLabel }: Props) {
  const { data, categories: usedCats } = useMemo(
    () => getFocusTrendData(sessions, tasks, categories, tab),
    [sessions, tasks, categories, tab],
  );

  const hasData = usedCats.length > 0;
  const horizontal = isHorizontal(tab);

  return (
    <div className="flex flex-col gap-3 p-5 rounded-lg border border-border bg-card min-h-[200px]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-foreground">{focusLabel}</p>
        {hasData && (
          <div className="flex flex-wrap gap-3">
            {usedCats.map((cat) => (
              <span
                key={cat.name}
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <span
                  className="inline-block w-2 h-2 rounded-sm"
                  style={{ backgroundColor: cat.color }}
                />
                {cat.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Chart */}
      {hasData ? (
        <div className="flex-1 min-h-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            {horizontal ? (
              // 가로 막대 (today, month)
              <BarChart
                layout="vertical"
                data={data}
                margin={{ top: 0, right: 8, bottom: 0, left: 0 }}
                barCategoryGap="30%"
              >
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => (v === 0 ? '' : `${v}m`)}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                  axisLine={false}
                  tickLine={false}
                  width={48}
                />
                <Tooltip
                  cursor={{ fill: 'var(--muted)', opacity: 0.3 }}
                  contentStyle={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(value, name) => [
                    typeof value === 'number' ? `${value}분` : String(value),
                    String(name ?? ''),
                  ]}
                />
                {usedCats.map((cat) => (
                  <Bar key={cat.name} dataKey={cat.name} stackId="a" fill={cat.color} radius={0} />
                ))}
              </BarChart>
            ) : (
              // 세로 막대 (week, all)
              <BarChart
                data={data}
                margin={{ top: 0, right: 4, bottom: 0, left: -16 }}
                barCategoryGap="30%"
              >
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => (v === 0 ? '' : `${v}m`)}
                />
                <Tooltip
                  cursor={{ fill: 'var(--muted)', opacity: 0.3 }}
                  contentStyle={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(value, name) => [
                    typeof value === 'number' ? `${value}분` : String(value),
                    String(name ?? ''),
                  ]}
                />
                {usedCats.map((cat, i) => (
                  <Bar
                    key={cat.name}
                    dataKey={cat.name}
                    stackId="a"
                    fill={cat.color}
                    radius={i === usedCats.length - 1 ? [2, 2, 0, 0] : 0}
                  />
                ))}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs text-muted-foreground">아직 기록된 세션이 없어요</p>
        </div>
      )}
    </div>
  );
}
