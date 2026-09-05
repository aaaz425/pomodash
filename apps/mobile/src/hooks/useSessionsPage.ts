import { useCallback, useEffect, useState } from 'react';
import { fetchSessionsPage } from '@/lib/supabase/sessions';
import { SESSION_LIMITS } from '@/constants/limits';
import type { Session } from '@/types/sessions';

export function useSessionsPage() {
  const [items, setItems] = useState<Session[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchSessionsPage({ cursor: null, limit: SESSION_LIMITS.JOURNAL_PAGE_SIZE }).then((result) => {
      if (cancelled) return;
      setItems(result?.sessions ?? []);
      setCursor(result?.nextCursor ?? null);
      setHasMore(!!result?.nextCursor);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const result = await fetchSessionsPage({ cursor, limit: SESSION_LIMITS.JOURNAL_PAGE_SIZE });
    setItems((prev) => [...prev, ...(result?.sessions ?? [])]);
    setCursor(result?.nextCursor ?? null);
    setHasMore(!!result?.nextCursor);
    setLoading(false);
  }, [cursor, hasMore, loading]);

  const updateItem = useCallback((id: string, patch: Partial<Session>) => {
    setItems((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return { items, hasMore, loading, loadMore, updateItem, removeItem };
}
