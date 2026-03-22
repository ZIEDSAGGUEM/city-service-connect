import { Search, MessageSquare, CheckCircle, Star } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Search & compare',
    description: 'Filter by category, ratings, and availability. Read real reviews before you reach out.',
  },
  {
    icon: MessageSquare,
    title: 'Request & chat',
    description: 'Describe the job, negotiate timing, and keep everything in one threaded conversation.',
  },
  {
    icon: CheckCircle,
    title: 'Book with confidence',
    description: 'Confirm details with your pro and track status from request to completion.',
  },
  {
    icon: Star,
    title: 'Rate & review',
    description: 'Share feedback to help the next customer—and reward great work.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="section-label mb-3">How it works</p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            From search to five stars
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Four simple steps—no guesswork, no endless phone tag.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="group relative rounded-2xl border border-border/60 bg-card/80 p-8 text-center shadow-soft transition-all duration-300 hover:border-primary/20 hover:shadow-medium animate-slide-up backdrop-blur-sm"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              {index < steps.length - 1 && (
                <div className="absolute -right-3 top-1/2 hidden h-0.5 w-6 -translate-y-1/2 bg-gradient-to-r from-primary/25 to-transparent lg:block" />
              )}

              <div className="relative mx-auto mb-6 inline-flex">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 ring-1 ring-primary/10 transition-transform duration-300 group-hover:scale-105">
                  <step.icon className="h-9 w-9 text-primary" />
                </div>
                <div className="absolute -right-1 -top-1 flex h-8 min-w-8 items-center justify-center rounded-full bg-gradient-accent px-2 text-xs font-bold text-accent-foreground shadow-md">
                  {index + 1}
                </div>
              </div>

              <h3 className="font-display text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
