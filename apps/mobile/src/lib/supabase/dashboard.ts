import { supabase } from '@/lib/supabase/client';
import { DashboardSummarySchema, type DashboardSummary } from '@/types/dashboard';

export async function fetchDashboardSummary(): Promise<DashboardSummary | null> {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const { data, error } = await supabase.rpc('get_dashboard_summary', { p_timezone: timezone });
  if (error || !data) return null;
  const parsed = DashboardSummarySchema.safeParse(data);
  return parsed.success ? parsed.data : null;
}
