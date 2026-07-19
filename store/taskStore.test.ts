import { describe, it, expect, beforeEach } from 'vitest';

import { createTaskStore } from '@/store/taskStore';
import { DEFAULT_CATEGORIES, STORAGE_KEYS } from '@/types';
import type { Session } from '@/types';

beforeEach(() => {
  localStorage.clear();
});

function addNCategories(store: ReturnType<typeof createTaskStore>, n: number) {
  for (let i = 0; i < n; i++) {
    store.getState().addCategory({ name: `cat-${i}`, color: 'bg-blue-500' });
  }
}

function makeSessionInput(overrides: Partial<Omit<Session, 'id'>> = {}): Omit<Session, 'id'> {
  return {
    taskId: null,
    mode: 'pomodoro',
    startedAt: '2024-03-15T09:00:00.000Z',
    endedAt: '2024-03-15T09:30:00.000Z',
    completedCycles: 1,
    totalCycles: 4,
    focusSeconds: 1500,
    pausedSeconds: 0,
    focusPeriods: [],
    note: null,
    focusRating: null,
    distractionTags: [],
    ...overrides,
  };
}

describe('addTask', () => {
  it('기본값(targetFocusMinutes=25, targetCycles=4, targetBreakMinutes=5)으로 task 생성', () => {
    const store = createTaskStore();
    store.getState().addTask({ title: 'A', categoryId: 'c1' });
    const [task] = store.getState().tasks;
    expect(task.targetFocusMinutes).toBe(25);
    expect(task.targetCycles).toBe(4);
    expect(task.targetBreakMinutes).toBe(5);
  });

  it('targetFocusMinutes/targetCycles/targetBreakMinutes를 명시하면 해당 값 사용', () => {
    const store = createTaskStore();
    store.getState().addTask({
      title: 'A',
      categoryId: 'c1',
      targetFocusMinutes: 50,
      targetCycles: 2,
      targetBreakMinutes: 10,
    });
    const [task] = store.getState().tasks;
    expect(task.targetFocusMinutes).toBe(50);
    expect(task.targetCycles).toBe(2);
    expect(task.targetBreakMinutes).toBe(10);
  });

  it('title 양 끝 공백이 trim됨', () => {
    const store = createTaskStore();
    store.getState().addTask({ title: '  공부하기  ', categoryId: 'c1' });
    expect(store.getState().tasks[0].title).toBe('공부하기');
  });

  it('새 task는 목록 맨 앞에 추가됨', () => {
    const store = createTaskStore();
    store.getState().addTask({ title: 'first', categoryId: 'c1' });
    store.getState().addTask({ title: 'second', categoryId: 'c1' });
    expect(store.getState().tasks.map((t) => t.title)).toEqual(['second', 'first']);
  });

  it('생성된 task의 id를 반환함', () => {
    const store = createTaskStore();
    const id = store.getState().addTask({ title: 'A', categoryId: 'c1' });
    expect(store.getState().tasks[0].id).toBe(id);
  });

  it('localStorage에 저장됨', () => {
    const store = createTaskStore();
    store.getState().addTask({ title: 'A', categoryId: 'c1' });
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.tasks) ?? '[]');
    expect(stored).toHaveLength(1);
  });
});

describe('toggleTask', () => {
  it('completed가 false에서 true로 토글됨', () => {
    const store = createTaskStore();
    const id = store.getState().addTask({ title: 'A', categoryId: 'c1' });
    store.getState().toggleTask(id);
    expect(store.getState().tasks[0].completed).toBe(true);
  });

  it('completed가 true에서 false로 토글됨', () => {
    const store = createTaskStore();
    const id = store.getState().addTask({ title: 'A', categoryId: 'c1' });
    store.getState().toggleTask(id);
    store.getState().toggleTask(id);
    expect(store.getState().tasks[0].completed).toBe(false);
  });

  it('존재하지 않는 id면 아무 task도 변경되지 않음', () => {
    const store = createTaskStore();
    store.getState().addTask({ title: 'A', categoryId: 'c1' });
    store.getState().toggleTask('no-such-id');
    expect(store.getState().tasks[0].completed).toBe(false);
  });
});

describe('updateTask', () => {
  it('title/categoryId/목표 시간 필드를 부분적으로 변경할 수 있음', () => {
    const store = createTaskStore();
    const id = store.getState().addTask({ title: 'A', categoryId: 'c1' });

    store.getState().updateTask(id, { title: 'B', targetFocusMinutes: 50 });

    const task = store.getState().tasks[0];
    expect(task.title).toBe('B');
    expect(task.targetFocusMinutes).toBe(50);
    expect(task.categoryId).toBe('c1'); // 패치에 없는 필드는 유지
    expect(task.targetCycles).toBe(4);
  });

  it('title 양 끝 공백이 trim됨', () => {
    const store = createTaskStore();
    const id = store.getState().addTask({ title: 'A', categoryId: 'c1' });

    store.getState().updateTask(id, { title: '  B  ' });

    expect(store.getState().tasks[0].title).toBe('B');
  });

  it('존재하지 않는 id면 아무 task도 변경되지 않음', () => {
    const store = createTaskStore();
    store.getState().addTask({ title: 'A', categoryId: 'c1' });

    store.getState().updateTask('no-such-id', { title: 'B' });

    expect(store.getState().tasks[0].title).toBe('A');
  });

  it('localStorage에 변경 사항이 저장됨', () => {
    const store = createTaskStore();
    const id = store.getState().addTask({ title: 'A', categoryId: 'c1' });

    store.getState().updateTask(id, { title: 'B' });

    const stored = JSON.parse(localStorage.getItem('pomodash:tasks') ?? '[]');
    expect(stored[0].title).toBe('B');
  });
});

describe('deleteTask', () => {
  it('해당 id의 task가 목록에서 제거됨', () => {
    const store = createTaskStore();
    const id = store.getState().addTask({ title: 'A', categoryId: 'c1' });
    store.getState().deleteTask(id);
    expect(store.getState().tasks).toHaveLength(0);
  });

  it('존재하지 않는 id면 목록이 그대로 유지됨', () => {
    const store = createTaskStore();
    store.getState().addTask({ title: 'A', categoryId: 'c1' });
    store.getState().deleteTask('no-such-id');
    expect(store.getState().tasks).toHaveLength(1);
  });
});

describe('addSession / updateSessionNote / updateSessionRating / updateSessionTags / deleteSession', () => {
  it('addSession — 새 세션이 목록 맨 앞에 추가됨', () => {
    const store = createTaskStore();
    store.getState().addSession(makeSessionInput());
    store.getState().addSession(makeSessionInput({ startedAt: '2024-03-16T09:00:00.000Z' }));
    expect(store.getState().sessions.map((s) => s.startedAt)).toEqual([
      '2024-03-16T09:00:00.000Z',
      '2024-03-15T09:00:00.000Z',
    ]);
  });

  it('addSession — focusRating/distractionTags가 그대로 저장됨', () => {
    const store = createTaskStore();
    store.getState().addSession(makeSessionInput({ focusRating: 3, distractionTags: ['phone'] }));
    expect(store.getState().sessions[0].focusRating).toBe(3);
    expect(store.getState().sessions[0].distractionTags).toEqual(['phone']);
  });

  it('updateSessionNote — note 양 끝 공백이 trim됨', () => {
    const store = createTaskStore();
    store.getState().addSession(makeSessionInput());
    const id = store.getState().sessions[0].id;
    store.getState().updateSessionNote(id, '  잘했다  ');
    expect(store.getState().sessions[0].note).toBe('잘했다');
  });

  it('updateSessionNote — 빈 문자열로 설정하면 note가 null로 변경됨', () => {
    const store = createTaskStore();
    store.getState().addSession(makeSessionInput({ note: '기존 메모' }));
    const id = store.getState().sessions[0].id;
    store.getState().updateSessionNote(id, '');
    expect(store.getState().sessions[0].note).toBeNull();
  });

  it('updateSessionNote — 공백만 있는 문자열도 trim 후 null로 변경됨', () => {
    const store = createTaskStore();
    store.getState().addSession(makeSessionInput({ note: '기존 메모' }));
    const id = store.getState().sessions[0].id;
    store.getState().updateSessionNote(id, '    ');
    expect(store.getState().sessions[0].note).toBeNull();
  });

  it('updateSessionNote — 존재하지 않는 id면 아무 세션도 변경되지 않음', () => {
    const store = createTaskStore();
    store.getState().addSession(makeSessionInput({ note: '기존 메모' }));
    store.getState().updateSessionNote('no-such-id', '변경 시도');
    expect(store.getState().sessions[0].note).toBe('기존 메모');
  });

  it('updateSessionRating — 정상적으로 평점이 갱신됨', () => {
    const store = createTaskStore();
    store.getState().addSession(makeSessionInput());
    const id = store.getState().sessions[0].id;
    store.getState().updateSessionRating(id, 2);
    expect(store.getState().sessions[0].focusRating).toBe(2);
  });

  it('updateSessionRating — null로 재설정하면 선택 해제됨', () => {
    const store = createTaskStore();
    store.getState().addSession(makeSessionInput({ focusRating: 3 }));
    const id = store.getState().sessions[0].id;
    store.getState().updateSessionRating(id, null);
    expect(store.getState().sessions[0].focusRating).toBeNull();
  });

  it('updateSessionRating — 존재하지 않는 id면 아무 세션도 변경되지 않음', () => {
    const store = createTaskStore();
    store.getState().addSession(makeSessionInput({ focusRating: 1 }));
    store.getState().updateSessionRating('no-such-id', 3);
    expect(store.getState().sessions[0].focusRating).toBe(1);
  });

  it('updateSessionTags — 정상적으로 태그 배열이 교체됨', () => {
    const store = createTaskStore();
    store.getState().addSession(makeSessionInput({ distractionTags: ['phone'] }));
    const id = store.getState().sessions[0].id;
    store.getState().updateSessionTags(id, ['noise', 'fatigue']);
    expect(store.getState().sessions[0].distractionTags).toEqual(['noise', 'fatigue']);
  });

  it('updateSessionTags — 빈 배열로 설정 가능', () => {
    const store = createTaskStore();
    store.getState().addSession(makeSessionInput({ distractionTags: ['phone'] }));
    const id = store.getState().sessions[0].id;
    store.getState().updateSessionTags(id, []);
    expect(store.getState().sessions[0].distractionTags).toEqual([]);
  });

  it('updateSessionTags — 존재하지 않는 id면 아무 세션도 변경되지 않음', () => {
    const store = createTaskStore();
    store.getState().addSession(makeSessionInput({ distractionTags: ['phone'] }));
    store.getState().updateSessionTags('no-such-id', ['noise']);
    expect(store.getState().sessions[0].distractionTags).toEqual(['phone']);
  });

  it('deleteSession — 해당 id의 세션이 목록에서 제거됨', () => {
    const store = createTaskStore();
    store.getState().addSession(makeSessionInput());
    const id = store.getState().sessions[0].id;
    store.getState().deleteSession(id);
    expect(store.getState().sessions).toHaveLength(0);
  });
});

describe('reorderTasks', () => {
  it('activeId를 overId 위치로 이동시킴', () => {
    const store = createTaskStore();
    const idA = store.getState().addTask({ title: 'A', categoryId: 'c1' });
    const idB = store.getState().addTask({ title: 'B', categoryId: 'c1' });
    const idC = store.getState().addTask({ title: 'C', categoryId: 'c1' });
    // 현재 순서: [C, B, A] — A를 C 위치로 이동
    store.getState().reorderTasks(idA, idC);
    expect(store.getState().tasks.map((t) => t.id)).toEqual([idA, idC, idB]);
  });

  it('activeId가 존재하지 않으면 아무 변경도 없음', () => {
    const store = createTaskStore();
    const idA = store.getState().addTask({ title: 'A', categoryId: 'c1' });
    const idB = store.getState().addTask({ title: 'B', categoryId: 'c1' });
    store.getState().reorderTasks('no-such-id', idA);
    expect(store.getState().tasks.map((t) => t.id)).toEqual([idB, idA]);
  });

  it('overId가 존재하지 않으면 아무 변경도 없음', () => {
    const store = createTaskStore();
    const idA = store.getState().addTask({ title: 'A', categoryId: 'c1' });
    const idB = store.getState().addTask({ title: 'B', categoryId: 'c1' });
    store.getState().reorderTasks(idA, 'no-such-id');
    expect(store.getState().tasks.map((t) => t.id)).toEqual([idB, idA]);
  });

  it('localStorage에도 재정렬된 순서가 저장됨', () => {
    const store = createTaskStore();
    const idA = store.getState().addTask({ title: 'A', categoryId: 'c1' });
    const idB = store.getState().addTask({ title: 'B', categoryId: 'c1' });
    store.getState().reorderTasks(idA, idB);
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.tasks) ?? '[]');
    expect(stored.map((t: { id: string }) => t.id)).toEqual([idA, idB]);
  });
});

describe('addCategory', () => {
  it('새 category가 목록 끝에 추가됨', () => {
    const store = createTaskStore();
    store.getState().addCategory({ name: '새 카테고리', color: 'bg-pink-500' });
    const categories = store.getState().categories;
    expect(categories[categories.length - 1].name).toBe('새 카테고리');
  });

  it('name 양 끝 공백이 trim됨', () => {
    const store = createTaskStore();
    store.getState().addCategory({ name: '  여행  ', color: 'bg-pink-500' });
    const categories = store.getState().categories;
    expect(categories[categories.length - 1].name).toBe('여행');
  });

  it('카테고리가 정확히 10개면 추가 시 아무 동작도 하지 않음 (상한)', () => {
    const store = createTaskStore();
    // 기본 5개 + 5개 추가 = 10개
    addNCategories(store, 5);
    expect(store.getState().categories).toHaveLength(10);
    store.getState().addCategory({ name: '11번째', color: 'bg-pink-500' });
    expect(store.getState().categories).toHaveLength(10);
  });

  it('카테고리가 9개일 때는 정상적으로 10개까지 추가 가능', () => {
    const store = createTaskStore();
    // 기본 5개 + 4개 추가 = 9개
    addNCategories(store, 4);
    expect(store.getState().categories).toHaveLength(9);
    store.getState().addCategory({ name: '10번째', color: 'bg-pink-500' });
    expect(store.getState().categories).toHaveLength(10);
  });
});

describe('updateCategory / deleteCategory', () => {
  it('updateCategory — 해당 id의 name/color가 변경됨', () => {
    const store = createTaskStore();
    const id = DEFAULT_CATEGORIES[0].id;
    store.getState().updateCategory(id, { name: '바뀐 이름', color: 'bg-red-500' });
    const category = store.getState().categories.find((c) => c.id === id);
    expect(category).toMatchObject({ name: '바뀐 이름', color: 'bg-red-500' });
  });

  it('updateCategory — name이 trim됨', () => {
    const store = createTaskStore();
    const id = DEFAULT_CATEGORIES[0].id;
    store.getState().updateCategory(id, { name: '  공백  ', color: 'bg-red-500' });
    const category = store.getState().categories.find((c) => c.id === id);
    expect(category?.name).toBe('공백');
  });

  it('deleteCategory — 해당 id의 category가 목록에서 제거됨', () => {
    const store = createTaskStore();
    const id = DEFAULT_CATEGORIES[0].id;
    store.getState().deleteCategory(id);
    expect(store.getState().categories.find((c) => c.id === id)).toBeUndefined();
  });

  it('category를 삭제해도 해당 category를 참조하는 task는 변경되지 않음', () => {
    const store = createTaskStore();
    const categoryId = DEFAULT_CATEGORIES[0].id;
    const taskId = store.getState().addTask({ title: 'A', categoryId });
    store.getState().deleteCategory(categoryId);
    const task = store.getState().tasks.find((t) => t.id === taskId);
    expect(task?.categoryId).toBe(categoryId);
  });
});

describe('reorderCategories', () => {
  it('activeId를 overId 위치로 이동시킴', () => {
    const store = createTaskStore();
    const [c0, c1] = DEFAULT_CATEGORIES;
    store.getState().reorderCategories(c0.id, c1.id);
    expect(store.getState().categories[0].id).toBe(c1.id);
    expect(store.getState().categories[1].id).toBe(c0.id);
  });

  it('activeId 또는 overId가 존재하지 않으면 아무 변경도 없음', () => {
    const store = createTaskStore();
    const before = store.getState().categories.map((c) => c.id);
    store.getState().reorderCategories('no-such-id', DEFAULT_CATEGORIES[0].id);
    expect(store.getState().categories.map((c) => c.id)).toEqual(before);
  });
});

describe('hydrate', () => {
  it('localStorage에 유효한 데이터가 있으면 그 값으로 복원됨', () => {
    const seedStore = createTaskStore();
    seedStore.getState().addTask({ title: '저장된 작업', categoryId: 'c1' });

    const store = createTaskStore();
    store.getState().hydrate();
    expect(store.getState().tasks.map((t) => t.title)).toEqual(['저장된 작업']);
  });

  it('localStorage가 비어 있으면 tasks/sessions는 빈 배열, categories는 DEFAULT_CATEGORIES로 복원됨', () => {
    const store = createTaskStore();
    store.getState().hydrate();
    expect(store.getState().tasks).toEqual([]);
    expect(store.getState().sessions).toEqual([]);
    expect(store.getState().categories).toEqual(DEFAULT_CATEGORIES);
  });

  it('localStorage 데이터가 스키마와 맞지 않으면 fallback 값으로 복원됨', () => {
    localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify([{ wrong: 'shape' }]));
    const store = createTaskStore();
    store.getState().hydrate();
    expect(store.getState().tasks).toEqual([]);
  });

  it('구버전 세션 데이터(focusRating/distractionTags 없음)도 default 값으로 채워져 복원됨', () => {
    const legacySession = {
      id: 's1',
      taskId: null,
      mode: 'pomodoro',
      startedAt: '2024-03-15T09:00:00.000Z',
      endedAt: '2024-03-15T09:30:00.000Z',
      completedCycles: 1,
      totalCycles: 4,
      focusSeconds: 1500,
      pausedSeconds: 0,
      focusPeriods: [],
      note: null,
      // focusRating/distractionTags 필드 없음 — 구버전 데이터 시뮬레이션
    };
    localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify([legacySession]));
    const store = createTaskStore();
    store.getState().hydrate();
    expect(store.getState().sessions[0].focusRating).toBeNull();
    expect(store.getState().sessions[0].distractionTags).toEqual([]);
  });
});
