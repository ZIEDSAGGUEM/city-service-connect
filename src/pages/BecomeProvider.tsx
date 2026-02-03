import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AIAssistant } from '@/components/ai/AIAssistant';
import { Button } from '@/components/ui/button';
import { DollarSign, Calendar, Users, TrendingUp, CheckCircle, ArrowRight, Star } from 'lucide-react';

const benefits = [
  {
    icon: DollarSign,
    title: 'Earn More',
    description: 'Set your own rates and keep more of what you earn. No hidden fees or commissions on your first 10 jobs.',
  },
  {
    icon: Calendar,
    title: 'Flexible Schedule',
    description: 'Work when you want. Accept jobs that fit your schedule and availability preferences.',
  },
  {
    icon: Users,
    title: 'Grow Your Client Base',
    description: 'Access thousands of potential clients in your area. Build lasting relationships with repeat customers.',
  },
  {
    icon: TrendingUp,
    title: 'Build Your Business',
    description: 'Showcase your skills, collect reviews, and grow your reputation. Tools to help you succeed.',
  },
];

const steps = [
  { number: 1, title: 'Create Your Profile', description: 'Sign up and tell us about your services, experience, and availability.' },
  { number: 2, title: 'Get Verified', description: 'Complete our verification process to earn trust badges and stand out.' },
  { number: 3, title: 'Start Earning', description: 'Receive job requests, connect with clients, and grow your business.' },
];

const testimonials = [
  {
    name: 'Marcus Williams',
    role: 'Handyman',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    quote: "LocalPro has transformed my business. I've doubled my client base in just 6 months.",
    earnings: '$4,500/month avg',
  },
  {
    name: 'Patricia Chen',
    role: 'House Cleaner',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    quote: "The flexibility is amazing. I choose my hours and the clients I want to work with.",
    earnings: '$3,200/month avg',
  },
];

export default function BecomeProvider() {
  const [isAIOpen, setIsAIOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onOpenAI={() => setIsAIOpen(true)} />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-hero py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          </div>
          <div className="container relative z-10">
            <div className="max-w-3xl">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                Turn Your Skills Into Income
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 mb-8">
                Join thousands of service providers earning on their own terms. 
                Set your rates, choose your hours, and grow your business with LocalPro.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="accent" size="xl" asChild>
                  <Link to="/register" className="inline-flex items-center gap-2">
                    Get Started Free
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Providers Love LocalPro
              </h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to run and grow your service business.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="p-6 bg-card rounded-2xl shadow-soft hover:shadow-medium transition-shadow"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-5">
                    <benefit.icon className="h-7 w-7 text-primary" />
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

        {/* How It Works */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Start Earning in 3 Simple Steps
              </h2>
              <p className="text-lg text-muted-foreground">
                Get started quickly and begin accepting jobs within days.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step) => (
                <div key={step.number} className="relative text-center">
                  {step.number < 3 && (
                    <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
                  )}
                  <div className="inline-flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/10 mb-6">
                    <span className="text-4xl font-bold text-primary">{step.number}</span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Success Stories
              </h2>
              <p className="text-lg text-muted-foreground">
                Hear from providers who've grown their business with LocalPro.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="p-8 bg-card rounded-2xl shadow-soft"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-lg text-foreground mb-6 italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-success">{testimonial.earnings}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
                What You'll Need
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'Valid ID and proof of address',
                  'Professional experience or certifications',
                  'Reliable transportation',
                  'Smartphone with internet',
                  'Professional tools (for your trade)',
                  'Positive attitude and reliability',
                ].map((requirement) => (
                  <div
                    key={requirement}
                    className="flex items-center gap-3 p-4 bg-card rounded-xl"
                  >
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    <span className="text-foreground">{requirement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-gradient-hero">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
                Ready to Start Earning?
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Join LocalPro today and start connecting with clients in your area. 
                It's free to sign up and takes just minutes.
              </p>
              <Button variant="accent" size="xl" asChild>
                <Link to="/register" className="inline-flex items-center gap-2">
                  Become a Provider
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
}
