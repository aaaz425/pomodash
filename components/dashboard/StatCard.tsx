import { LucideIcon } from 'lucide-react';

interface Props {
  label: string;
  Icon: LucideIcon;
  value: string;
  sub?: string;
}

export function StatCard({ label, Icon, value, sub }: Props) {
  return (
    <div className="flex-1 flex flex-col gap-1.5 p-5 rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <p className="text-[22px] font-bold tracking-tight text-foreground leading-none">{value}</p>
      {sub && <p className="text-[11px] text-muted-foreground">{sub}</p>}
    </div>
  );
}
