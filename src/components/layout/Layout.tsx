import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  onOpenAI?: () => void;
}

export function Layout({ children, onOpenAI }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header onOpenAI={onOpenAI} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

