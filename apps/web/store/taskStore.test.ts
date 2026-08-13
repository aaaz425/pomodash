import { describe, it, expect, beforeEach, vi } from 'vitest';

import { createTaskStore } from '@/store/taskStore';
import { DEFAULT_CATEGORIES } from '@/types';
import type { Session, Task } from '@/types';
import { fetchTasks, insertTask, updateTask, deleteTask, reorderTasks } from '@/lib/supabase/tasks';
import {
  fetchCategories,
  insertCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
} from '@/lib/supabase/categories';
import {
  fetchSessions,
  insertSession,
  updateSession,
  deleteSession,
} from '@/lib/supabase/sessions';

vi.mock('@/lib/supabase/tasks', () => ({
  fetchTasks: vi.fn(),
  insertTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
  reorderTasks: vi.fn(),
}));
vi.mock('@/lib/supabase/categories', () => ({
  fetchCategories: vi.fn(),
  insertCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
  reorderCategories: vi.fn(),
}));
vi.mock('@/lib/supabase/sessions', () => ({
  fetchSessions: vi.fn(),
  insertSession: vi.fn(),
  updateSession: vi.fn(),
  deleteSession: vi.fn(),
}));

const mockFetchTasks = vi.mocked(fetchTasks);
const mockInsertTask = vi.mocked(insertTask);
const mockUpdateTask = vi.mocked(updateTask);
const mockDeleteTask = vi.mocked(deleteTask);
const mockReorderTasks = vi.mocked(reorderTasks);

const mockFetchCategories = vi.mocked(fetchCategories);
const mockInsertCategory = vi.mocked(insertCategory);
const mockUpdateCategory = vi.mocked(updateCategory);
const mockDeleteCategory = vi.mocked(deleteCategory);
const mockReorderCategories = vi.mocked(reorderCategories);

const mockFetchSessions = vi.mocked(fetchSessions);
const mockInsertSession = vi.mocked(insertSession);
const mockUpdateSession = vi.mocked(updateSession);
const mockDeleteSession = vi.mocked(deleteSession);

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `db-id-${idCounter}`;
}

beforeEach(() => {
  vi.clearAllMocks();
  idCounter = 0;
  // insert 계열은 "입력값 + 새 DB id"를 돌려주는 실제 supabase insert().select().single()의 echo-back을 흉내
  mockInsertTask.mockImplementation(async (input) => ({
    id: nextId(),
    title: input.title,
    categoryId: input.categoryId,
    targetFocusMinutes: input.targetFocusMinutes,
    targetCycles: input.targetCycles,
    targetBreakMinutes: input.targetBreakMinutes,
    completed: false,
    createdAt: new Date().toISOString(),
  }));
  mockInsertCategory.mockImplementation(async (input) => ({
    id: nextId(),
    name: input.name,
    color: input.color,
  }));
  mockInsertSession.mockImplementation(async (input) => ({ id: nextId(), ...input }));
  mockUpdateTask.mockResolvedValue({ error: false });
  mockDeleteTask.mockResolvedValue({ error: false });
  mockReorderTasks.mockResolvedValue({ error: false });
  mockUpdateCategory.mockResolvedValue({ error: false });
  mockDeleteCategory.mockResolvedValue({ error: false, blocked: false });
  mockReorderCategories.mockResolvedValue({ error: false });
  mockUpdateSession.mockResolvedValue({ error: false });
  mockDeleteSession.mockResolvedValue({ error: false });
});

async function addNCategories(store: ReturnType<typeof createTaskStore>, n: number) {
  for (let i = 0; i < n; i++) {
    await store.getState().addCategory({ name: `cat-${i}`, color: 'bg-blue-500' });
  }
}

function makeSessionInput(overrides: Partial<Omit<Session, 'id'>> = {}): Omit<Session, 'id'> {
  return {
    taskId: null,
    title: null,
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
  it('기본값(targetFocusMinutes=25, targetCycles=4, targetBreakMinutes=5)으로 task 생성', async () => {
    const store = createTaskStore();
    await store.getState().addTask({ title: 'A', categoryId: 'c1' });
    const [task] = store.getState().tasks;
    expect(task.targetFocusMinutes).toBe(25);
    expect(task.targetCycles).toBe(4);
    expect(task.targetBreakMinutes).toBe(5);
  });

  it('targetFocusMinutes/targetCycles/targetBreakMinutes를 명시하면 해당 값 사용', async () => {
    const store = createTaskStore();
    await store.getState().addTask({
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

  it('title 양 끝 공백이 trim됨', async () => {
    const store = createTaskStore();
    await store.getState().addTask({ title: '  공부하기  ', categoryId: 'c1' });
    expect(store.getState().tasks[0].title).toBe('공부하기');
    expect(mockInsertTask).toHaveBeenCalledWith(expect.objectContaining({ title: '공부하기' }));
  });

  it('새 task는 목록 맨 앞에 추가됨', async () => {
    const store = createTaskStore();
    await store.getState().addTask({ title: 'first', categoryId: 'c1' });
    await store.getState().addTask({ title: 'second', categoryId: 'c1' });
    expect(store.getState().tasks.map((t) => t.title)).toEqual(['second', 'first']);
  });

  it('생성된 task의 실제 DB id를 반환함', async () => {
    const store = createTaskStore();
    const id = await store.getState().addTask({ title: 'A', categoryId: 'c1' });
    expect(id).not.toBeNull();
    expect(store.getState().tasks[0].id).toBe(id);
  });

  it('insertTask가 실패(null)하면 낙관적으로 추가했던 task가 롤백되고 null을 반환함', async () => {
    mockInsertTask.mockResolvedValueOnce(null);
    const store = createTaskStore();
    const id = await store.getState().addTask({ title: 'A', categoryId: 'c1' });
    expect(id).toBeNull();
    expect(store.getState().tasks).toHaveLength(0);
  });
});

describe('toggleTask', () => {
  it('completed가 false에서 true로 토글됨', async () => {
    const store = createTaskStore();
    const id = await store.getState().addTask({ title: 'A', categoryId: 'c1' });
    await store.getState().toggleTask(id!);
    expect(store.getState().tasks[0].completed).toBe(true);
  });

  it('completed가 true에서 false로 토글됨', async () => {
    const store = createTaskStore();
    const id = await store.getState().addTask({ title: 'A', categoryId: 'c1' });
    await store.getState().toggleTask(id!);
    await store.getState().toggleTask(id!);
    expect(store.getState().tasks[0].completed).toBe(false);
  });

  it('존재하지 않는 id면 아무 task도 변경되지 않고 저장 호출도 없음', async () => {
    const store = createTaskStore();
    await store.getState().addTask({ title: 'A', categoryId: 'c1' });
    await store.getState().toggleTask('no-such-id');
    expect(store.getState().tasks[0].completed).toBe(false);
    expect(mockUpdateTask).not.toHaveBeenCalled();
  });
});

describe('updateTask', () => {
  it('title/categoryId/목표 시간 필드를 부분적으로 변경할 수 있음', async () => {
    const store = createTaskStore();
    const id = await store.getState().addTask({ title: 'A', categoryId: 'c1' });

    await store.getState().updateTask(id!, { title: 'B', targetFocusMinutes: 50 });

    const task = store.getState().tasks[0];
    expect(task.title).toBe('B');
    expect(task.targetFocusMinutes).toBe(50);
    expect(task.categoryId).toBe('c1'); // 패치에 없는 필드는 유지
    expect(task.targetCycles).toBe(4);
  });

  it('title 양 끝 공백이 trim됨', async () => {
    const store = createTaskStore();
    const id = await store.getState().addTask({ title: 'A', categoryId: 'c1' });

    await store.getState().updateTask(id!, { title: '  B  ' });

    expect(store.getState().tasks[0].title).toBe('B');
  });

  it('존재하지 않는 id면 아무 task도 변경되지 않고 저장 호출도 없음', async () => {
    const store = createTaskStore();
    await store.getState().addTask({ title: 'A', categoryId: 'c1' });

    await store.getState().updateTask('no-such-id', { title: 'B' });

    expect(store.getState().tasks[0].title).toBe('A');
    expect(mockUpdateTask).not.toHaveBeenCalled();
  });

  it('updateTask가 실패하면 이전 값으로 롤백됨', async () => {
    const store = createTaskStore();
    const id = await store.getState().addTask({ title: 'A', categoryId: 'c1' });
    mockUpdateTask.mockResolvedValueOnce({ error: true });

    await store.getState().updateTask(id!, { title: 'B' });

    expect(store.getState().tasks[0].title).toBe('A');
  });
});

describe('deleteTask', () => {
  it('해당 id의 task가 목록에서 제거됨', async () => {
    const store = createTaskStore();
    const id = await store.getState().addTask({ title: 'A', categoryId: 'c1' });
    await store.getState().deleteTask(id!);
    expect(store.getState().tasks).toHaveLength(0);
  });

  it('존재하지 않는 id면 목록이 그대로 유지되고 삭제 호출도 없음', async () => {
    const store = createTaskStore();
    await store.getState().addTask({ title: 'A', categoryId: 'c1' });
    await store.getState().deleteTask('no-such-id');
    expect(store.getState().tasks).toHaveLength(1);
    expect(mockDeleteTask).not.toHaveBeenCalled();
  });
});

describe('addSession / updateSessionNote / updateSessionRating / updateSessionTags / deleteSession', () => {
  it('addSession — 새 세션이 목록 맨 앞에 추가됨', async () => {
    const store = createTaskStore();
    await store.getState().addSession(makeSessionInput());
    await store.getState().addSession(makeSessionInput({ startedAt: '2024-03-16T09:00:00.000Z' }));
    expect(store.getState().sessions.map((s) => s.startedAt)).toEqual([
      '2024-03-16T09:00:00.000Z',
      '2024-03-15T09:00:00.000Z',
    ]);
  });

  it('addSession — focusRating/distractionTags가 그대로 저장됨', async () => {
    const store = createTaskStore();
    await store
      .getState()
      .addSession(makeSessionInput({ focusRating: 3, distractionTags: ['phone'] }));
    expect(store.getState().sessions[0].focusRating).toBe(3);
    expect(store.getState().sessions[0].distractionTags).toEqual(['phone']);
  });

  it('addSession — insert 실패 시 낙관적으로 추가했던 세션이 롤백됨', async () => {
    mockInsertSession.mockResolvedValueOnce(null);
    const store = createTaskStore();
    await store.getState().addSession(makeSessionInput());
    expect(store.getState().sessions).toHaveLength(0);
  });

  it('updateSessionFields — note가 그대로 갱신됨', async () => {
    const store = createTaskStore();
    await store.getState().addSession(makeSessionInput());
    const id = store.getState().sessions[0].id;
    await store.getState().updateSessionFields(id, { note: '잘했다' });
    expect(store.getState().sessions[0].note).toBe('잘했다');
  });

  it('updateSessionFields — note를 null로 설정 가능', async () => {
    const store = createTaskStore();
    await store.getState().addSession(makeSessionInput({ note: '기존 메모' }));
    const id = store.getState().sessions[0].id;
    await store.getState().updateSessionFields(id, { note: null });
    expect(store.getState().sessions[0].note).toBeNull();
  });

  it('updateSessionFields — 존재하지 않는 id면 아무 세션도 변경되지 않음', async () => {
    const store = createTaskStore();
    await store.getState().addSession(makeSessionInput({ note: '기존 메모' }));
    await store.getState().updateSessionFields('no-such-id', { note: '변경 시도' });
    expect(store.getState().sessions[0].note).toBe('기존 메모');
  });

  it('updateSessionFields — focusRating이 갱신됨', async () => {
    const store = createTaskStore();
    await store.getState().addSession(makeSessionInput());
    const id = store.getState().sessions[0].id;
    await store.getState().updateSessionFields(id, { focusRating: 2 });
    expect(store.getState().sessions[0].focusRating).toBe(2);
  });

  it('updateSessionFields — focusRating을 null로 재설정하면 선택 해제됨', async () => {
    const store = createTaskStore();
    await store.getState().addSession(makeSessionInput({ focusRating: 3 }));
    const id = store.getState().sessions[0].id;
    await store.getState().updateSessionFields(id, { focusRating: null });
    expect(store.getState().sessions[0].focusRating).toBeNull();
  });

  it('updateSessionFields — distractionTags 배열이 교체됨', async () => {
    const store = createTaskStore();
    await store.getState().addSession(makeSessionInput({ distractionTags: ['phone'] }));
    const id = store.getState().sessions[0].id;
    await store.getState().updateSessionFields(id, { distractionTags: ['noise', 'fatigue'] });
    expect(store.getState().sessions[0].distractionTags).toEqual(['noise', 'fatigue']);
  });

  it('updateSessionFields — distractionTags를 빈 배열로 설정 가능', async () => {
    const store = createTaskStore();
    await store.getState().addSession(makeSessionInput({ distractionTags: ['phone'] }));
    const id = store.getState().sessions[0].id;
    await store.getState().updateSessionFields(id, { distractionTags: [] });
    expect(store.getState().sessions[0].distractionTags).toEqual([]);
  });

  it('updateSessionFields — title이 갱신됨', async () => {
    const store = createTaskStore();
    await store.getState().addSession(makeSessionInput());
    const id = store.getState().sessions[0].id;
    await store.getState().updateSessionFields(id, { title: '알고리즘 스터디' });
    expect(store.getState().sessions[0].title).toBe('알고리즘 스터디');
  });

  it('updateSessionFields — 여러 필드를 한 번에 갱신 가능', async () => {
    const store = createTaskStore();
    await store.getState().addSession(makeSessionInput());
    const id = store.getState().sessions[0].id;
    await store.getState().updateSessionFields(id, {
      title: '집중 세션',
      focusRating: 3,
      distractionTags: ['phone'],
      note: '메모',
    });
    const session = store.getState().sessions[0];
    expect(session.title).toBe('집중 세션');
    expect(session.focusRating).toBe(3);
    expect(session.distractionTags).toEqual(['phone']);
    expect(session.note).toBe('메모');
  });

  it('updateSessionFields — 저장 실패 시 롤백됨', async () => {
    mockUpdateSession.mockResolvedValueOnce({ error: true });
    const store = createTaskStore();
    await store.getState().addSession(makeSessionInput({ note: '기존 메모' }));
    const id = store.getState().sessions[0].id;
    await store.getState().updateSessionFields(id, { note: '변경 시도' });
    expect(store.getState().sessions[0].note).toBe('기존 메모');
  });

  it('deleteSession — 해당 id의 세션이 목록에서 제거됨', async () => {
    const store = createTaskStore();
    await store.getState().addSession(makeSessionInput());
    const id = store.getState().sessions[0].id;
    await store.getState().deleteSession(id);
    expect(store.getState().sessions).toHaveLength(0);
  });
});

describe('reorderTasks', () => {
  it('activeId를 overId 위치로 이동시킴', async () => {
    const store = createTaskStore();
    const idA = await store.getState().addTask({ title: 'A', categoryId: 'c1' });
    const idB = await store.getState().addTask({ title: 'B', categoryId: 'c1' });
    const idC = await store.getState().addTask({ title: 'C', categoryId: 'c1' });
    // 현재 순서: [C, B, A] — A를 C 위치로 이동
    await store.getState().reorderTasks(idA!, idC!);
    expect(store.getState().tasks.map((t) => t.id)).toEqual([idA, idC, idB]);
  });

  it('activeId가 존재하지 않으면 아무 변경도 없고 저장 호출도 없음', async () => {
    const store = createTaskStore();
    const idA = await store.getState().addTask({ title: 'A', categoryId: 'c1' });
    const idB = await store.getState().addTask({ title: 'B', categoryId: 'c1' });
    mockReorderTasks.mockClear();
    await store.getState().reorderTasks('no-such-id', idA!);
    expect(store.getState().tasks.map((t) => t.id)).toEqual([idB, idA]);
    expect(mockReorderTasks).not.toHaveBeenCalled();
  });

  it('overId가 존재하지 않으면 아무 변경도 없음', async () => {
    const store = createTaskStore();
    const idA = await store.getState().addTask({ title: 'A', categoryId: 'c1' });
    const idB = await store.getState().addTask({ title: 'B', categoryId: 'c1' });
    await store.getState().reorderTasks(idA!, 'no-such-id');
    expect(store.getState().tasks.map((t) => t.id)).toEqual([idB, idA]);
  });

  it('reorderTasksRows가 재정렬된 새 순서의 id 배열로 호출됨', async () => {
    const store = createTaskStore();
    const idA = await store.getState().addTask({ title: 'A', categoryId: 'c1' });
    const idB = await store.getState().addTask({ title: 'B', categoryId: 'c1' });
    mockReorderTasks.mockClear();
    await store.getState().reorderTasks(idA!, idB!);
    expect(mockReorderTasks).toHaveBeenCalledWith([idA, idB]);
  });
});

describe('addCategory', () => {
  it('새 category가 목록 끝에 추가됨', async () => {
    const store = createTaskStore();
    await store.getState().addCategory({ name: '새 카테고리', color: 'bg-pink-500' });
    const categories = store.getState().categories;
    expect(categories[categories.length - 1].name).toBe('새 카테고리');
  });

  it('name 양 끝 공백이 trim됨', async () => {
    const store = createTaskStore();
    await store.getState().addCategory({ name: '  여행  ', color: 'bg-pink-500' });
    const categories = store.getState().categories;
    expect(categories[categories.length - 1].name).toBe('여행');
  });

  it('카테고리가 정확히 10개면 추가 시 아무 동작도 하지 않음 (상한)', async () => {
    const store = createTaskStore();
    // 기본 5개 + 5개 추가 = 10개
    await addNCategories(store, 5);
    expect(store.getState().categories).toHaveLength(10);
    await store.getState().addCategory({ name: '11번째', color: 'bg-pink-500' });
    expect(store.getState().categories).toHaveLength(10);
    expect(mockInsertCategory).not.toHaveBeenCalledWith(
      expect.objectContaining({ name: '11번째' }),
    );
  });

  it('카테고리가 9개일 때는 정상적으로 10개까지 추가 가능', async () => {
    const store = createTaskStore();
    // 기본 5개 + 4개 추가 = 9개
    await addNCategories(store, 4);
    expect(store.getState().categories).toHaveLength(9);
    await store.getState().addCategory({ name: '10번째', color: 'bg-pink-500' });
    expect(store.getState().categories).toHaveLength(10);
  });

  it('insertCategory가 실패(null)하면 낙관적으로 추가했던 category가 롤백됨', async () => {
    mockInsertCategory.mockResolvedValueOnce(null);
    const store = createTaskStore();
    await store.getState().addCategory({ name: '새 카테고리', color: 'bg-pink-500' });
    expect(store.getState().categories).toEqual(DEFAULT_CATEGORIES);
  });
});

describe('updateCategory / deleteCategory', () => {
  it('updateCategory — 해당 id의 name/color가 변경됨', async () => {
    const store = createTaskStore();
    const id = DEFAULT_CATEGORIES[0].id;
    await store.getState().updateCategory(id, { name: '바뀐 이름', color: 'bg-red-500' });
    const category = store.getState().categories.find((c) => c.id === id);
    expect(category).toMatchObject({ name: '바뀐 이름', color: 'bg-red-500' });
  });

  it('updateCategory — name이 trim됨', async () => {
    const store = createTaskStore();
    const id = DEFAULT_CATEGORIES[0].id;
    await store.getState().updateCategory(id, { name: '  공백  ', color: 'bg-red-500' });
    const category = store.getState().categories.find((c) => c.id === id);
    expect(category?.name).toBe('공백');
  });

  it('deleteCategory — 해당 id의 category가 목록에서 제거됨', async () => {
    const store = createTaskStore();
    const id = DEFAULT_CATEGORIES[0].id;
    await store.getState().deleteCategory(id);
    expect(store.getState().categories.find((c) => c.id === id)).toBeUndefined();
  });

  it('deleteCategory — DB에서 FK violation으로 막히면(로컬엔 참조 작업 정보가 없던 경우) 롤백됨', async () => {
    mockDeleteCategory.mockResolvedValueOnce({ error: true, blocked: true });
    const store = createTaskStore();
    const id = DEFAULT_CATEGORIES[0].id;
    await store.getState().deleteCategory(id);
    expect(store.getState().categories.find((c) => c.id === id)).toBeDefined();
  });

  it('deleteCategory — 로컬에 참조하는 작업이 있으면 낙관적 삭제 없이 즉시 막힘(깜빡임 방지)', async () => {
    const store = createTaskStore();
    const categoryId = DEFAULT_CATEGORIES[0].id;
    await store.getState().addTask({ title: 'A', categoryId });
    mockDeleteCategory.mockClear();

    await store.getState().deleteCategory(categoryId);

    expect(store.getState().categories.find((c) => c.id === categoryId)).toBeDefined();
    expect(mockDeleteCategory).not.toHaveBeenCalled();
  });
});

describe('reorderCategories', () => {
  it('activeId를 overId 위치로 이동시킴', async () => {
    const store = createTaskStore();
    const [c0, c1] = DEFAULT_CATEGORIES;
    await store.getState().reorderCategories(c0.id, c1.id);
    expect(store.getState().categories[0].id).toBe(c1.id);
    expect(store.getState().categories[1].id).toBe(c0.id);
  });

  it('activeId 또는 overId가 존재하지 않으면 아무 변경도 없음', async () => {
    const store = createTaskStore();
    const before = store.getState().categories.map((c) => c.id);
    await store.getState().reorderCategories('no-such-id', DEFAULT_CATEGORIES[0].id);
    expect(store.getState().categories.map((c) => c.id)).toEqual(before);
  });
});

describe('hydrate', () => {
  it('fetchTasks/fetchCategories/fetchSessions 결과로 상태가 복원됨', async () => {
    const task: Task = {
      id: 't1',
      title: '저장된 작업',
      categoryId: 'c1',
      targetFocusMinutes: 25,
      targetCycles: 4,
      targetBreakMinutes: 5,
      completed: false,
      createdAt: '2026-01-01T00:00:00.000Z',
    };
    mockFetchTasks.mockResolvedValueOnce([task]);
    mockFetchCategories.mockResolvedValueOnce(DEFAULT_CATEGORIES);
    mockFetchSessions.mockResolvedValueOnce([]);

    const store = createTaskStore();
    await store.getState().hydrate();
    expect(store.getState().tasks).toEqual([task]);
    expect(store.getState().categories).toEqual(DEFAULT_CATEGORIES);
  });

  it('조회가 전부 실패(null)하면 tasks/sessions는 빈 배열, categories는 DEFAULT_CATEGORIES로 복원됨', async () => {
    mockFetchTasks.mockResolvedValueOnce(null);
    mockFetchCategories.mockResolvedValueOnce(null);
    mockFetchSessions.mockResolvedValueOnce(null);

    const store = createTaskStore();
    await store.getState().hydrate();
    expect(store.getState().tasks).toEqual([]);
    expect(store.getState().sessions).toEqual([]);
    expect(store.getState().categories).toEqual(DEFAULT_CATEGORIES);
  });
});
