import { supabase } from '@/lib/supabase/client';
import { SessionSchema, type Session } from '@/types/sessions';

interface SessionRow {
  id: string;
  task_id: string | null;
  title: string | null;
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
  'id, task_id, title, mode, started_at, ended_at, completed_cycles, total_cycles, focus_seconds, paused_seconds, focus_periods, note, focus_rating, distraction_tags';

export interface SessionListResult {
  sessions: Session[];
  invalidCount: number;
}

export function toSession(row: SessionRow): Session | null {
  const parsed = SessionSchema.safeParse({
    id: row.id,
    taskId: row.task_id,
    title: row.title,
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

export async function fetchSessions(): Promise<SessionListResult | null> {
  const { data, error } = await supabase
    .from('sessions')
    .select(SELECT_COLUMNS)
    .order('started_at', { ascending: false });
  if (error || !data) return null;
  const sessions = data.map(toSession).filter((s): s is Session => s !== null);
  return { sessions, invalidCount: data.length - sessions.length };
}

export interface SessionsPageParams {
  cursor?: string | null; // 이전 페이지 마지막 세션의 startedAt
  limit: number;
}

export interface SessionsPageResult extends SessionListResult {
  nextCursor: string | null;
}

// 저널 리스트 무한스크롤용 커서 기반 페이지네이션
export async function fetchSessionsPage({
  cursor,
  limit,
}: SessionsPageParams): Promise<SessionsPageResult | null> {
  let query = supabase
    .from('sessions')
    .select(SELECT_COLUMNS)
    .order('started_at', { ascending: false })
    .limit(limit);
  if (cursor) query = query.lt('started_at', cursor);

  const { data, error } = await query;
  if (error || !data) return null;

  const rows = data as unknown as SessionRow[];
  const sessions = rows.map(toSession).filter((s): s is Session => s !== null);
  const nextCursor = rows.length === limit ? rows[rows.length - 1].started_at : null;
  return { sessions, invalidCount: rows.length - sessions.length, nextCursor };
}

// 저널 캘린더 월별 조회용
export async function fetchSessionsInRange(
  startIso: string,
  endIso: string,
): Promise<SessionListResult | null> {
  const { data, error } = await supabase
    .from('sessions')
    .select(SELECT_COLUMNS)
    .gte('started_at', startIso)
    .lt('started_at', endIso)
    .order('started_at', { ascending: true });
  if (error || !data) return null;
  const sessions = data.map(toSession).filter((s): s is Session => s !== null);
  return { sessions, invalidCount: data.length - sessions.length };
}

export async function insertSession(input: Omit<Session, 'id'>): Promise<Session | null> {
  const { data, error } = await supabase
    .from('sessions')
    .insert({
      task_id: input.taskId,
      title: input.title,
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
  patch: Partial<Pick<Session, 'title' | 'note' | 'focusRating' | 'distractionTags'>>,
): Promise<{ error: boolean }> {
  const row: Record<string, unknown> = {};
  if (patch.title !== undefined) row.title = patch.title;
  if (patch.note !== undefined) row.note = patch.note;
  if (patch.focusRating !== undefined) row.focus_rating = patch.focusRating;
  if (patch.distractionTags !== undefined) row.distraction_tags = patch.distractionTags;

  const { error } = await supabase.from('sessions').update(row).eq('id', id);
  return { error: error !== null };
}

export async function deleteSession(id: string): Promise<{ error: boolean }> {
  const { error } = await supabase.from('sessions').delete().eq('id', id);
  return { error: error !== null };
}
