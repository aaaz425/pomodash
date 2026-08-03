'use client';

import { useMemo } from 'react';
import { InsightCard } from '@/components/journal/InsightCard';
import {
  getCategoryFocusRatings,
  getFocusRatingTrend,
  getLowestRatingDayOfWeek,
  getTopDistractions,
} from '@/lib/journalInsights';
import { DISTRACTION_TAGS } from '@/lib/constants';
import type {
  Category,
  CategoryRatingItem,
  DistractionFrequency,
  FocusRatingTrend,
  Session,
  Task,
} from '@/types';

interface CardContent {
  text: string;
  sub?: string;
}

const EMPTY: CardContent = {
  text: '아직 데이터가 부족해요',
  sub: '기록이 쌓이면 패턴을 보여드려요',
};

function topDistractionCopy(items: DistractionFrequency[]): CardContent {
  if (items.length === 0) return EMPTY;
  const top = items[0];
  const label = DISTRACTION_TAGS.find((t) => t.id === top.tagId)?.label ?? top.tagId;
  return {
    text: `최근 2주간 가장 많이 방해한 건 ${label}이에요`,
    sub: `${top.count}회 기록됨`,
  };
}

function ratingTrendCopy(trend: FocusRatingTrend): CardContent {
  if (trend.sampleSize === 0 || trend.recentAvg === null) return EMPTY;
  if (trend.previousAvg === null) {
    return {
      text: '이번 주 집중도를 기록하고 있어요',
      sub: `평균 ${trend.recentAvg.toFixed(1)}점`,
    };
  }
  const diff = trend.recentAvg - trend.previousAvg;
  const text =
    Math.abs(diff) < 0.3
      ? '집중도가 지난주와 비슷해요'
      : diff > 0
        ? '집중도가 지난주보다 좋아졌어요'
        : '집중도가 지난주보다 떨어졌어요';
  return { text, sub: `이번 주 평균 ${trend.recentAvg.toFixed(1)}점` };
}

function categoryRatingCopy(items: CategoryRatingItem[]): CardContent {
  if (items.length === 0) return EMPTY;
  const top = items[0];
  return {
    text: `${top.categoryName} 카테고리에서 집중이 가장 잘 됐어요`,
    sub: `평균 ${top.avgRating.toFixed(1)}점`,
  };
}

function lowestDayCopy(day: string | null): CardContent {
  if (!day) return EMPTY;
  return { text: `${day}에 유독 집중이 흐트러지는 편이에요` };
}

interface Props {
  sessions: Session[];
  tasks: Task[];
  categories: Category[];
}

export function InsightsSection({ sessions, tasks, categories }: Props) {
  const topDistractions = useMemo(() => getTopDistractions(sessions), [sessions]);
  const ratingTrend = useMemo(() => getFocusRatingTrend(sessions), [sessions]);
  const categoryRatings = useMemo(
    () => getCategoryFocusRatings(sessions, tasks, categories),
    [sessions, tasks, categories],
  );
  const lowestDay = useMemo(() => getLowestRatingDayOfWeek(sessions), [sessions]);

  const cards = [
    { label: '방해요소', ...topDistractionCopy(topDistractions) },
    { label: '집중도 추이', ...ratingTrendCopy(ratingTrend) },
    { label: '카테고리', ...categoryRatingCopy(categoryRatings) },
    { label: '요일 패턴', ...lowestDayCopy(lowestDay) },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((card) => (
        <InsightCard key={card.label} {...card} />
      ))}
    </div>
  );
}
