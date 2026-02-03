import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Bot, Send, Loader2, Sparkles } from 'lucide-react';
import { providers, categories } from '@/lib/data';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  recommendations?: typeof providers;
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIAssistant({ isOpen, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your LocalPro AI Assistant. I can help you find the perfect service provider based on your needs. Tell me what service you're looking for, and I'll recommend the best matches!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getAIResponse = (userMessage: string): { content: string; recommendations?: typeof providers } => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Simple keyword matching for demo
    const categoryMatches = categories.filter(cat => 
      lowerMessage.includes(cat.name.toLowerCase())
    );
    
    const keywordMap: Record<string, string[]> = {
      clean: ['1'],
      cleaning: ['1'],
      plumb: ['2'],
      pipe: ['2'],
      leak: ['2'],
      electric: ['3'],
      wiring: ['3'],
      garden: ['4'],
      lawn: ['4'],
      landscape: ['4'],
      move: ['5'],
      moving: ['5'],
      paint: ['6'],
      handyman: ['7'],
      repair: ['7'],
      fix: ['7'],
      pet: ['8'],
      dog: ['8'],
      cat: ['8'],
    };

    let matchedCategoryIds: string[] = categoryMatches.map(c => c.id);
    
    Object.entries(keywordMap).forEach(([keyword, ids]) => {
      if (lowerMessage.includes(keyword)) {
        matchedCategoryIds = [...new Set([...matchedCategoryIds, ...ids])];
      }
    });

    let matchedProviders = providers.filter(p => 
      matchedCategoryIds.includes(p.categoryId)
    );

    // Sort by rating and availability
    matchedProviders = matchedProviders.sort((a, b) => {
      if (a.availability === 'available' && b.availability !== 'available') return -1;
      if (b.availability === 'available' && a.availability !== 'available') return 1;
      return b.rating - a.rating;
    }).slice(0, 3);

    if (matchedProviders.length > 0) {
      const topProvider = matchedProviders[0];
      return {
        content: `Based on your request, I found ${matchedProviders.length} great providers! My top recommendation is **${topProvider.name}** - they have a ${topProvider.rating} rating with ${topProvider.reviewCount} reviews and are ${topProvider.availability === 'available' ? 'available now' : 'currently busy'}. Their hourly rate is $${topProvider.hourlyRate}/hr. Here are all my recommendations:`,
        recommendations: matchedProviders,
      };
    }

    // Generic responses
    if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
      return {
        content: "I'm here to help you find the best local service providers! Just tell me what kind of service you need (like home cleaning, plumbing, electrical work, etc.) and I'll find the top-rated professionals in your area. I consider ratings, reviews, availability, and pricing to give you the best recommendations.",
      };
    }

    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('cheap')) {
      const budgetProviders = providers
        .sort((a, b) => a.hourlyRate - b.hourlyRate)
        .slice(0, 3);
      return {
        content: "Looking for budget-friendly options? Here are our most affordable highly-rated providers:",
        recommendations: budgetProviders,
      };
    }

    if (lowerMessage.includes('best') || lowerMessage.includes('top') || lowerMessage.includes('recommend')) {
      const topProviders = providers
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);
      return {
        content: "Here are our highest-rated providers across all categories:",
        recommendations: topProviders,
      };
    }

    return {
      content: "I'd be happy to help you find a service provider! Could you tell me more about what service you're looking for? For example:\n\n• Home cleaning\n• Plumbing repairs\n• Electrical work\n• Landscaping\n• Moving services\n• Painting\n• General handyman\n• Pet care",
    };
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1000));

    const response = getAIResponse(input);
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      ...response,
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-card rounded-2xl shadow-large overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-hero text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/20">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display font-semibold">AI Assistant</h3>
              <p className="text-sm text-primary-foreground/80">Find your perfect provider</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="h-96 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                <div
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0 ${
                      message.role === 'assistant'
                        ? 'bg-primary/10'
                        : 'bg-accent/10'
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <Sparkles className="h-4 w-4 text-primary" />
                    ) : (
                      <span className="text-xs font-medium text-accent">You</span>
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'assistant'
                        ? 'bg-secondary text-foreground'
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  </div>
                </div>

                {/* Recommendations */}
                {message.recommendations && (
                  <div className="mt-3 ml-11 space-y-2">
                    {message.recommendations.map((provider) => (
                      <a
                        key={provider.id}
                        href={`/providers/${provider.id}`}
                        className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors"
                      >
                        <img
                          src={provider.avatar}
                          alt={provider.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm">
                            {provider.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {provider.category} • ⭐ {provider.rating} • ${provider.hourlyRate}/hr
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            provider.availability === 'available'
                              ? 'bg-success/20 text-success'
                              : 'bg-warning/20 text-warning'
                          }`}
                        >
                          {provider.availability === 'available' ? 'Available' : 'Busy'}
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-secondary rounded-2xl px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about services, providers, or pricing..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
