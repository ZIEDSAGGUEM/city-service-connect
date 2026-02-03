import { Search, MessageSquare, CheckCircle, Star } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Search & Compare',
    description: 'Browse verified providers, read reviews, and compare prices to find the perfect match.',
  },
  {
    icon: MessageSquare,
    title: 'Request & Chat',
    description: 'Send a request describing your needs. Discuss details and schedule directly with providers.',
  },
  {
    icon: CheckCircle,
    title: 'Book & Relax',
    description: 'Confirm your booking and let the professional handle the job. Payment is secure and simple.',
  },
  {
    icon: Star,
    title: 'Rate & Review',
    description: 'Share your experience to help others find great service providers in your area.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Getting professional help has never been easier. Four simple steps to quality service.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative text-center animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
              )}

              {/* Step Number */}
              <div className="relative inline-flex mb-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/10">
                  <step.icon className="h-10 w-10 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold text-sm">
                  {index + 1}
                </div>
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
  );
}
