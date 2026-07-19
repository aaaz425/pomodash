import { endOfDay, isWithinInterval, parseISO, startOfDay, subDays } from 'date-fns';
import type {
  Category,
  CategoryRatingItem,
  DistractionFrequency,
  FocusRating,
  FocusRatingTrend,
  Session,
  Task,
} from '@/types';

function inWindow(session: Session, start: Date, end: Date): boolean {
  return isWithinInterval(parseISO(session.startedAt), { start, end });
}

function avgRating(sessions: Session[]): { avg: number | null; sampleSize: number } {
  const ratings = sessions.map((s) => s.focusRating).filter((r): r is FocusRating => r !== null);
  if (ratings.length === 0) return { avg: null, sampleSize: 0 };
  return {
    avg: ratings.reduce((sum, r) => sum + r, 0) / ratings.length,
    sampleSize: ratings.length,
  };
}

export function getTopDistractions(
  sessions: Session[],
  days = 14,
  today: Date = new Date(),
): DistractionFrequency[] {
  const start = subDays(startOfDay(today), days - 1);

  const counts = new Map<string, number>();
  for (const session of sessions) {
    if (!inWindow(session, start, today)) continue;
    for (const tagId of session.distractionTags) {
      counts.set(tagId, (counts.get(tagId) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([tagId, count]) => ({ tagId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
}

export function getFocusRatingTrend(
  sessions: Session[],
  days = 7,
  today: Date = new Date(),
): FocusRatingTrend {
  const recentStart = subDays(startOfDay(today), days - 1);
  const previousEnd = endOfDay(subDays(recentStart, 1));
  const previousStart = startOfDay(subDays(previousEnd, days - 1));

  const recentSessions = sessions.filter((s) => inWindow(s, recentStart, today));
  const previousSessions = sessions.filter((s) => inWindow(s, previousStart, previousEnd));

  const recent = avgRating(recentSessions);
  const previous = avgRating(previousSessions);

  return {
    recentAvg: recent.avg,
    previousAvg: previous.avg,
    sampleSize: recent.sampleSize,
  };
}

export function getCategoryFocusRatings(
  sessions: Session[],
  tasks: Task[],
  categories: Category[],
  minSamples = 3,
): CategoryRatingItem[] {
  const taskMap = new Map(tasks.map((t) => [t.id, t]));
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  const ratingsByCategory = new Map<string, FocusRating[]>();
  for (const session of sessions) {
    if (session.focusRating === null || session.taskId === null) continue;
    const task = taskMap.get(session.taskId);
    if (!task) continue;
    const category = categoryMap.get(task.categoryId);
    if (!category) continue;

    const ratings = ratingsByCategory.get(category.id) ?? [];
    ratings.push(session.focusRating);
    ratingsByCategory.set(category.id, ratings);
  }

  const items: CategoryRatingItem[] = [];
  for (const [categoryId, ratings] of ratingsByCategory) {
    if (ratings.length < minSamples) continue;
    items.push({
      categoryId,
      categoryName: categoryMap.get(categoryId)!.name,
      avgRating: ratings.reduce((sum, r) => sum + r, 0) / ratings.length,
      sampleSize: ratings.length,
    });
  }

  return items.sort((a, b) => b.avgRating - a.avgRating);
}

export function getLowestRatingDayOfWeek(
  sessions: Session[],
  today: Date = new Date(),
): string | null {
  const start = subDays(startOfDay(today), 29);
  const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

  const sums = new Array(7).fill(0);
  const counts = new Array(7).fill(0);

  for (const session of sessions) {
    if (session.focusRating === null) continue;
    if (!inWindow(session, start, today)) continue;
    const day = parseISO(session.startedAt).getDay();
    sums[day] += session.focusRating;
    counts[day] += 1;
  }

  let lowestDay = -1;
  let lowestAvg = Infinity;
  for (let day = 0; day < 7; day++) {
    if (counts[day] === 0) continue;
    const avg = sums[day] / counts[day];
    if (avg < lowestAvg) {
      lowestAvg = avg;
      lowestDay = day;
    }
  }

  return lowestDay === -1 ? null : `${DAY_NAMES[lowestDay]}요일`;
}
