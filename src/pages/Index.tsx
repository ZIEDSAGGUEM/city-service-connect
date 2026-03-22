import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AppPageShell } from '@/components/layout/AppPageShell';
import { HeroSection } from '@/components/home/HeroSection';
import { CategorySection } from '@/components/home/CategorySection';
import { FeaturedProviders } from '@/components/home/FeaturedProviders';
import { HowItWorks } from '@/components/home/HowItWorks';
import { AIAssistant } from '@/components/ai/AIAssistant';

const Index = () => {
  const [isAIOpen, setIsAIOpen] = useState(false);

  return (
    <AppPageShell>
      <Header onOpenAI={() => setIsAIOpen(true)} />
      <main className="relative flex-1">
        <HeroSection />
        <CategorySection />
        <FeaturedProviders />
        <HowItWorks />
      </main>
      <Footer />
      <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </AppPageShell>
  );
};

export default Index;
