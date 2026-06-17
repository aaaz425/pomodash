'use client'

import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'

interface Props {
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step?: number
  unit: string
}

export function StepperInput({ value, onChange, min, max, step = 1, unit }: Props) {
  const [raw, setRaw] = useState('')
  const [editing, setEditing] = useState(false)

  function commit(s: string) {
    const n = parseInt(s, 10)
    if (!isNaN(n)) onChange(Math.max(min, Math.min(max, n)))
    setEditing(false)
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center rounded-lg border border-border bg-muted overflow-hidden">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - step))}
          aria-label="감소"
          className="flex items-center justify-center w-8 h-9 text-muted-foreground hover:bg-border/50 hover:text-foreground transition-colors border-r border-border shrink-0"
        >
          <Minus className="w-3 h-3" />
        </button>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={editing ? raw : String(value)}
          onFocus={() => { setRaw(String(value)); setEditing(true) }}
          onChange={(e) => setRaw(e.target.value.replace(/\D/g, ''))}
          onBlur={() => commit(raw)}
          onKeyDown={(e) => e.key === 'Enter' && commit(raw)}
          className="w-10 text-center text-sm font-semibold text-foreground bg-transparent focus:outline-none py-2"
        />
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + step))}
          aria-label="증가"
          className="flex items-center justify-center w-8 h-9 text-muted-foreground hover:bg-border/50 hover:text-foreground transition-colors border-l border-border shrink-0"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
      <span className="text-sm text-muted-foreground w-4">{unit}</span>
    </div>
  )
}
