import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AppPageShell } from '@/components/layout/AppPageShell';
import { AIAssistant } from '@/components/ai/AIAssistant';
import { Button } from '@/components/ui/button';
import { Search, MessageSquare, CheckCircle, Star, Shield, Clock, DollarSign, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Search for Services',
    description: 'Browse our extensive directory of verified service providers. Filter by category, location, rating, and availability to find the perfect match for your needs.',
    details: ['Over 2,500 verified providers', 'Smart filters and search', 'AI-powered recommendations'],
  },
  {
    icon: MessageSquare,
    title: 'Request & Communicate',
    description: 'Send a detailed request describing your project. Chat directly with providers to discuss specifics, ask questions, and agree on terms.',
    details: ['Secure messaging system', 'Share photos and documents', 'Real-time availability'],
  },
  {
    icon: CheckCircle,
    title: 'Book with Confidence',
    description: 'Once you\'ve found the right provider, confirm your booking. All providers are background-checked and insured for your peace of mind.',
    details: ['Verified backgrounds', 'Insured professionals', 'Secure payment processing'],
  },
  {
    icon: Star,
    title: 'Rate & Review',
    description: 'After the job is complete, share your experience. Your feedback helps maintain quality and helps other homeowners make informed decisions.',
    details: ['Honest community reviews', 'Photo reviews welcome', 'Build provider reputation'],
  },
];

const benefits = [
  { icon: Shield, title: 'Verified Providers', description: 'All service providers undergo thorough background checks and verification.' },
  { icon: Clock, title: 'Quick Response', description: 'Get responses from multiple providers within hours, not days.' },
  { icon: DollarSign, title: 'Fair Pricing', description: 'Compare quotes and find competitive rates for quality service.' },
];

export default function HowItWorks() {
  const [isAIOpen, setIsAIOpen] = useState(false);

  return (
    <AppPageShell>
      <Header onOpenAI={() => setIsAIOpen(true)} />

      <main className="relative flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-secondary/50 to-background py-16 md:py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                How LocalPro Works
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Finding trusted local service providers has never been easier. 
                Four simple steps to quality home service.
              </p>
              <Button variant="hero" size="lg" asChild>
                <Link to="/services" className="inline-flex items-center gap-2">
                  Find a Provider
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="space-y-24">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className={`flex flex-col ${
                    index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'
                  } items-center gap-12`}
                >
                  {/* Content */}
                  <div className="flex-1 space-y-6">
                    <div className="inline-flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold">
                        {index + 1}
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <step.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <h2 className="font-display text-3xl font-bold text-foreground">
                      {step.title}
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                    <ul className="space-y-3">
                      {step.details.map((detail) => (
                        <li key={detail} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-success" />
                          <span className="text-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual */}
                  <div className="flex-1">
                    <div className="relative">
                      <div className="aspect-square max-w-md mx-auto rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <step.icon className="h-24 w-24 text-primary/50" />
                      </div>
                      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Choose LocalPro?
              </h2>
              <p className="text-lg text-muted-foreground">
                We're committed to providing the best experience for homeowners and service providers alike.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="text-center p-8 bg-card rounded-2xl shadow-soft"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto mb-6">
                    <benefit.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-gradient-hero">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Join thousands of satisfied homeowners who found their perfect service providers on LocalPro.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="accent" size="lg" asChild>
                  <Link to="/services">Browse Services</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                  asChild
                >
                  <Link to="/register">Create Account</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </AppPageShell>
  );
}
