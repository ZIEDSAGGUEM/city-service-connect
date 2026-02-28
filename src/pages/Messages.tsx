import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, MessageSquare, Search, ArrowLeft } from 'lucide-react';
import { messagesApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { Message, ConversationSummary } from '@/lib/types';
import { formatDistanceToNow, format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function Messages() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    searchParams.get('requestId'),
  );
  const [newMessage, setNewMessage] = useState('');
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Load conversations
  const loadConversations = useCallback(async () => {
    try {
      const data = await messagesApi.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversations', error);
    } finally {
      setIsLoadingConversations(false);
    }
  }, []);

  // Load messages for selected conversation
  const loadMessages = useCallback(async (requestId: string, silent = false) => {
    if (!silent) setIsLoadingMessages(true);
    try {
      const data = await messagesApi.getConversation(requestId);
      // Only update state if there are new messages (avoids scroll flicker on polling)
      setMessages((prev) => {
        if (prev.length === data.length && prev[prev.length - 1]?.id === data[data.length - 1]?.id) {
          return prev; // No change — keep existing reference
        }
        return data;
      });
    } catch (error) {
      console.error('Failed to load messages', error);
    } finally {
      if (!silent) setIsLoadingMessages(false);
    }
  }, []);

  // Polling: re-fetch messages every 5 seconds when a conversation is open
  useEffect(() => {
    if (selectedRequestId) {
      loadMessages(selectedRequestId);
      pollingRef.current = setInterval(() => {
        loadMessages(selectedRequestId, true); // silent = no loading spinner
        loadConversations();
      }, 5000);
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [selectedRequestId, loadMessages, loadConversations]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Sync URL param
  useEffect(() => {
    if (selectedRequestId) {
      setSearchParams({ requestId: selectedRequestId });
    } else {
      setSearchParams({});
    }
  }, [selectedRequestId, setSearchParams]);

  const handleSelectConversation = (requestId: string) => {
    setSelectedRequestId(requestId);
    setMessages([]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRequestId || isSending) return;

    setIsSending(true);
    const content = newMessage.trim();
    setNewMessage('');

    // Optimistic update
    const optimistic: Message = {
      id: `temp-${Date.now()}`,
      senderId: user!.id,
      requestId: selectedRequestId,
      content,
      read: false,
      createdAt: new Date().toISOString(),
      sender: { id: user!.id, name: user!.name, avatar: user!.avatar ?? null },
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const sent = await messagesApi.send({ requestId: selectedRequestId, content });
      // Replace optimistic with real message
      setMessages((prev) => prev.map((m) => (m.id === optimistic.id ? sent : m)));
      loadConversations(); // refresh conversation list
    } catch (error: any) {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const selectedConversation = conversations.find(
    (c) => c.requestId === selectedRequestId,
  );

  const filteredConversations = conversations.filter((c) =>
    c.otherParty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.requestTitle.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Layout>
      <div className="container max-w-6xl py-6">
        <h1 className="font-display text-2xl font-bold text-foreground mb-6">
          Messages
        </h1>

        <div className="border border-border rounded-xl overflow-hidden flex h-[calc(100vh-220px)] min-h-[500px] shadow-sm">
          {/* ─── Left: Conversation List ─── */}
          <div
            className={cn(
              'w-full md:w-80 flex-shrink-0 border-r border-border flex flex-col bg-background',
              selectedRequestId ? 'hidden md:flex' : 'flex',
            )}
          >
            {/* Search */}
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-9 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Conversation Items */}
            <ScrollArea className="flex-1">
              {isLoadingConversations ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center px-4">
                  <MessageSquare className="h-10 w-10 text-muted-foreground/40 mb-3" />
                  <p className="text-sm font-medium text-muted-foreground">No conversations yet</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Messages from your service requests will appear here
                  </p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <button
                    key={conv.requestId}
                    onClick={() => handleSelectConversation(conv.requestId)}
                    className={cn(
                      'w-full flex items-start gap-3 p-4 text-left hover:bg-secondary/50 transition-colors border-b border-border/50',
                      selectedRequestId === conv.requestId && 'bg-primary/5 border-l-2 border-l-primary',
                    )}
                  >
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src={conv.otherParty.avatar ?? undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {conv.otherParty.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-sm font-medium text-foreground truncate">
                          {conv.otherParty.name}
                        </span>
                        {conv.lastMessage && (
                          <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                            {formatDistanceToNow(new Date(conv.lastMessage.createdAt), { addSuffix: false })}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate mb-1">
                        {conv.requestTitle}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground truncate">
                          {conv.lastMessage
                            ? (conv.lastMessage.senderId === user?.id ? 'You: ' : '') +
                              conv.lastMessage.content
                            : 'No messages yet'}
                        </p>
                        {conv.unreadCount > 0 && (
                          <Badge
                            variant="default"
                            className="h-5 min-w-5 px-1.5 text-xs rounded-full ml-2 flex-shrink-0"
                          >
                            {conv.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </ScrollArea>
          </div>

          {/* ─── Right: Chat View ─── */}
          <div
            className={cn(
              'flex-1 flex flex-col bg-background',
              !selectedRequestId ? 'hidden md:flex' : 'flex',
            )}
          >
            {!selectedRequestId ? (
              /* Empty state */
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  Select a conversation
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Choose a conversation from the list to start chatting
                </p>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="px-4 py-3 border-b border-border flex items-center gap-3 bg-background">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden h-8 w-8"
                    onClick={() => setSelectedRequestId(null)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  {selectedConversation && (
                    <>
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={selectedConversation.otherParty.avatar ?? undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {selectedConversation.otherParty.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {selectedConversation.otherParty.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate max-w-xs">
                          {selectedConversation.requestTitle}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 px-4 py-4">
                  {isLoadingMessages ? (
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-center">
                      <p className="text-sm text-muted-foreground">
                        No messages yet. Say hello! 👋
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((msg, index) => {
                        const isMe = msg.senderId === user?.id;
                        const showDate =
                          index === 0 ||
                          new Date(msg.createdAt).toDateString() !==
                            new Date(messages[index - 1].createdAt).toDateString();

                        return (
                          <div key={msg.id}>
                            {/* Date separator */}
                            {showDate && (
                              <div className="flex items-center justify-center my-3">
                                <div className="bg-secondary/60 text-xs text-muted-foreground px-3 py-1 rounded-full">
                                  {format(new Date(msg.createdAt), 'MMMM d, yyyy')}
                                </div>
                              </div>
                            )}

                            <div
                              className={cn(
                                'flex items-end gap-2',
                                isMe ? 'flex-row-reverse' : 'flex-row',
                              )}
                            >
                              {/* Avatar */}
                              {!isMe && (
                                <Avatar className="h-7 w-7 flex-shrink-0 mb-1">
                                  <AvatarImage src={msg.sender?.avatar ?? undefined} />
                                  <AvatarFallback className="text-xs bg-secondary">
                                    {msg.sender?.name?.charAt(0).toUpperCase() ?? '?'}
                                  </AvatarFallback>
                                </Avatar>
                              )}

                              {/* Bubble */}
                              <div
                                className={cn(
                                  'max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
                                  isMe
                                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                                    : 'bg-secondary text-foreground rounded-bl-sm',
                                )}
                              >
                                <p>{msg.content}</p>
                                <p
                                  className={cn(
                                    'text-xs mt-1',
                                    isMe ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground',
                                  )}
                                >
                                  {format(new Date(msg.createdAt), 'h:mm a')}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>

                {/* Message Input */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-4 border-t border-border flex gap-2 bg-background"
                >
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                    disabled={isSending}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e as any);
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!newMessage.trim() || isSending}
                  >
                    {isSending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

