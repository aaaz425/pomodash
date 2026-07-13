'use client';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  fullWidth?: boolean;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  fullWidth = false,
}: Props<T>) {
  return (
    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={[
            fullWidth ? 'flex-1' : '',
            'px-3 py-1.5 rounded-md text-sm transition-colors',
            value === option.value
              ? 'bg-card text-foreground font-medium shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
