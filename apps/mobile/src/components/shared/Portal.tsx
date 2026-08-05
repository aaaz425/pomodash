import {
  createContext,
  Fragment,
  useContext,
  useEffect,
  useId,
  useState,
  type ReactNode,
} from 'react';

// react-native-screens가 (app) 그룹의 각 탭 화면을 독립된 네이티브 화면으로 분리하면서,
// 그 화면 트리 안에서 띄운 RN <Modal>이 앱 진짜 루트가 아니라 화면 스코프 안에서만
// 프레젠트되는 문제(하단 탭바에 가려짐)가 있다 — 모달을 이 Portal로 감싸 실제로는
// (app)/_layout.tsx에서 AppTabs(탭 네비게이터)를 감싸는 위치(StoreProvider 안쪽,
// 탭 스크린 트리 바깥)에서 렌더링되게 한다 — StoreProvider보다 바깥이면 zustand 컨텍스트가
// 끊겨 useTaskStore 등이 깨진다.
interface PortalContextValue {
  register: (id: string, node: ReactNode) => void;
  unregister: (id: string) => void;
}

const PortalContext = createContext<PortalContextValue | null>(null);

export function PortalProvider({ children }: { children: ReactNode }) {
  const [nodes, setNodes] = useState<Record<string, ReactNode>>({});

  const register = (id: string, node: ReactNode) => {
    setNodes((prev) => ({ ...prev, [id]: node }));
  };
  const unregister = (id: string) => {
    setNodes((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  return (
    <PortalContext.Provider value={{ register, unregister }}>
      {children}
      {Object.entries(nodes).map(([id, node]) => (
        <Fragment key={id}>{node}</Fragment>
      ))}
    </PortalContext.Provider>
  );
}

export function Portal({ children }: { children: ReactNode }) {
  const ctx = useContext(PortalContext);
  const id = useId();

  if (!ctx) throw new Error('Portal must be used within PortalProvider');

  useEffect(() => {
    ctx.register(id, children);
    return () => ctx.unregister(id);
  });

  return null;
}
