import { StoreProvider } from '@/store/StoreProvider'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <StoreProvider>{children}</StoreProvider>
}
