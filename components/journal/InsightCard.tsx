interface Props {
  label: string;
  text: string;
  sub?: string;
}

export function InsightCard({ label, text, sub }: Props) {
  return (
    <div className="flex flex-col gap-1.5 p-5 rounded-lg border border-border bg-card">
      <span className="text-xs text-muted-foreground">{label}</span>
      <p className="text-sm font-semibold text-foreground leading-snug">{text}</p>
      {sub && <p className="text-[11px] text-muted-foreground">{sub}</p>}
    </div>
  );
}
