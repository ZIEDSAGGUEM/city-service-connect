import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { CategorySection } from '@/components/home/CategorySection';
import { FeaturedProviders } from '@/components/home/FeaturedProviders';
import { HowItWorks } from '@/components/home/HowItWorks';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { CTASection } from '@/components/home/CTASection';
import { AIAssistant } from '@/components/ai/AIAssistant';

const Index = () => {
  const [isAIOpen, setIsAIOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onOpenAI={() => setIsAIOpen(true)} />
      <main className="flex-1">
        <HeroSection />
        <CategorySection />
        <FeaturedProviders />
        <HowItWorks />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
      <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
};

export default Index;
