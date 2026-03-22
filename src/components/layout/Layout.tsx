import { Header } from './Header';
import { Footer } from './Footer';
import { AppPageShell } from './AppPageShell';

interface LayoutProps {
  children: React.ReactNode;
  onOpenAI?: () => void;
}

export function Layout({ children, onOpenAI }: LayoutProps) {
  return (
    <AppPageShell>
      <Header onOpenAI={onOpenAI} />
      <main className="relative flex-1">{children}</main>
      <Footer />
    </AppPageShell>
  );
}
