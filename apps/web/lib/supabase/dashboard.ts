import { createClient } from '@/lib/supabase/client';
import { DashboardSummarySchema, type DashboardSummary } from '@/types';

export async function fetchDashboardSummary(): Promise<DashboardSummary | null> {
  const supabase = createClient();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const { data, error } = await supabase.rpc('get_dashboard_summary', { p_timezone: timezone });
  if (error || !data) return null;
  const parsed = DashboardSummarySchema.safeParse(data);
  return parsed.success ? parsed.data : null;
}
