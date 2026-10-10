import Link from 'next/link';

interface Props {
  href: string;
  label: string;
  variant?: 'primary' | 'secondary';
}

export function LandingCTA({ href, label, variant = 'primary' }: Props) {
  return (
    <Link
      href={href}
      className={
        variant === 'primary'
          ? 'inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors'
          : 'inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors'
      }
    >
      {label}
    </Link>
  );
}
