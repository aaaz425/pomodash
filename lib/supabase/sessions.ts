import { createClient } from '@/lib/supabase/client';
import { SessionSchema, type Session } from '@/types';

interface SessionRow {
  id: string;
  task_id: string | null;
  mode: string;
  started_at: string;
  ended_at: string;
  completed_cycles: number;
  total_cycles: number;
  focus_seconds: number;
  paused_seconds: number;
  focus_periods: { start: string; end: string }[];
  note: string | null;
  focus_rating: number | null;
  distraction_tags: string[];
}

const SELECT_COLUMNS =
  'id, task_id, mode, started_at, ended_at, completed_cycles, total_cycles, focus_seconds, paused_seconds, focus_periods, note, focus_rating, distraction_tags';

export function toSession(row: SessionRow): Session | null {
  const parsed = SessionSchema.safeParse({
    id: row.id,
    taskId: row.task_id,
    mode: row.mode,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    completedCycles: row.completed_cycles,
    totalCycles: row.total_cycles,
    focusSeconds: row.focus_seconds,
    pausedSeconds: row.paused_seconds,
    focusPeriods: row.focus_periods,
    note: row.note,
    focusRating: row.focus_rating,
    distractionTags: row.distraction_tags,
  });
  return parsed.success ? parsed.data : null;
}

export async function fetchSessions(): Promise<Session[] | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('sessions')
    .select(SELECT_COLUMNS)
    .order('started_at', { ascending: false });
  if (error || !data) return null;
  return data.map(toSession).filter((s): s is Session => s !== null);
}

export async function insertSession(input: Omit<Session, 'id'>): Promise<Session | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('sessions')
    .insert({
      task_id: input.taskId,
      mode: input.mode,
      started_at: input.startedAt,
      ended_at: input.endedAt,
      completed_cycles: input.completedCycles,
      total_cycles: input.totalCycles,
      focus_seconds: input.focusSeconds,
      paused_seconds: input.pausedSeconds,
      focus_periods: input.focusPeriods,
      note: input.note,
      focus_rating: input.focusRating,
      distraction_tags: input.distractionTags,
    })
    .select(SELECT_COLUMNS)
    .single();
  if (error || !data) return null;
  return toSession(data);
}

export async function updateSession(
  id: string,
  patch: Partial<Pick<Session, 'note' | 'focusRating' | 'distractionTags'>>,
): Promise<{ error: boolean }> {
  const supabase = createClient();
  const row: Record<string, unknown> = {};
  if (patch.note !== undefined) row.note = patch.note;
  if (patch.focusRating !== undefined) row.focus_rating = patch.focusRating;
  if (patch.distractionTags !== undefined) row.distraction_tags = patch.distractionTags;

  const { error } = await supabase.from('sessions').update(row).eq('id', id);
  return { error: error !== null };
}

export async function deleteSession(id: string): Promise<{ error: boolean }> {
  const supabase = createClient();
  const { error } = await supabase.from('sessions').delete().eq('id', id);
  return { error: error !== null };
}
