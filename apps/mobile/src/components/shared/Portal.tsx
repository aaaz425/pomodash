import {
  createContext,
  Fragment,
  useContext,
  useEffect,
  useId,
  useState,
  type ReactNode,
} from 'react';

// react-native-screens가 탭 화면을 독립 네이티브 화면으로 분리해 그 안의 RN <Modal>이 화면 스코프에 갇혀 탭바에 가려짐 —
// Portal로 감싸 (app)/_layout.tsx의 AppTabs 바깥(단, StoreProvider 안쪽 — 그보다 바깥이면 zustand 컨텍스트가 끊김)에서 렌더링
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
