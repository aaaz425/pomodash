import Link from 'next/link';
import { siteConfig } from '@/lib/site';

export function AboutSection() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION ?? '—';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{siteConfig.name}</span>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          v{version}
        </span>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">{siteConfig.description}</p>

      <Link
        href="/landing"
        className="text-sm text-primary hover:underline underline-offset-2 w-fit"
      >
        앱 소개 보기 →
      </Link>
    </div>
  );
}
