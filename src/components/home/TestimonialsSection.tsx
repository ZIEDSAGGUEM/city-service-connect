import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Jennifer Martinez',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    role: 'Homeowner',
    rating: 5,
    text: "LocalPro made finding a reliable electrician so easy. David was professional, on time, and his work was impeccable. I've already booked him for future projects!",
    service: 'Electrical',
  },
  {
    id: 2,
    name: 'Michael Thompson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    role: 'Property Manager',
    rating: 5,
    text: "As a property manager, I need reliable service providers on call. LocalPro has become my go-to platform. The quality and consistency are unmatched.",
    service: 'Multiple Services',
  },
  {
    id: 3,
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    role: 'Busy Professional',
    rating: 5,
    text: "The AI recommendation feature is a game-changer! It matched me with the perfect house cleaner based on my specific needs. Saves so much time researching.",
    service: 'Home Cleaning',
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Loved by Homeowners
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of satisfied customers who found their perfect service providers
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="relative p-6 bg-card rounded-2xl shadow-soft animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/10" />

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
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

              {/* Service Tag */}
              <div className="absolute bottom-6 right-6">
                <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                  {testimonial.service}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
