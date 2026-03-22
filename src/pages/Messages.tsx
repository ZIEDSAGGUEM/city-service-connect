import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, MessageSquare, Search, ArrowLeft } from 'lucide-react';
import { messagesApi, serviceRequestsApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useSocketContext } from '@/contexts/SocketContext';
import type { Message, ConversationSummary } from '@/lib/types';
import { formatDistanceToNow, format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ChatHeaderInfo {
  name: string;
  avatar: string | null;
  title: string;
}

export default function Messages() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { on, emit, connected } = useSocketContext();

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
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // For new conversations not yet in the conversation list
  const [headerOverride, setHeaderOverride] = useState<ChatHeaderInfo | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      const el = messagesEndRef.current;
      if (!el) return;
      const viewport = el.closest('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      } else {
        el.scrollIntoView({ block: 'end' });
      }
    }, 100);
  }, []);

  const loadConversations = useCallback(async () => {
    try {
      const data = await messagesApi.getConversations();
      setConversations(data);
    } catch {
    } finally {
      setIsLoadingConversations(false);
    }
  }, []);

  const loadMessages = useCallback(async (requestId: string) => {
    setIsLoadingMessages(true);
    try {
      const data = await messagesApi.getConversation(requestId);
      setMessages(data);
      // Backend marks messages as read when fetching — refresh conversation list to update unread badges
      const convs = await messagesApi.getConversations();
      setConversations(convs);
    } catch (error: any) {
      console.error('Failed to load messages:', error?.response?.status, error?.response?.data);
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  // When a requestId is selected but NOT in the conversations list,
  // fetch request details so we can show the header.
  const loadRequestHeader = useCallback(async (requestId: string) => {
    try {
      const req = await serviceRequestsApi.getById(requestId);
      const isClient = req.clientId === user?.id;
      const other = isClient
        ? { name: req.provider?.user?.name || 'Provider', avatar: req.provider?.user?.avatar || null }
        : { name: req.client?.name || 'Client', avatar: req.client?.avatar || null };
      setHeaderOverride({ name: other.name, avatar: other.avatar, title: req.title });
    } catch {
    }
  }, [user?.id]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Join/leave conversation rooms + load messages
  useEffect(() => {
    if (!selectedRequestId) return;

    loadMessages(selectedRequestId);
    emit('joinConversation', { requestId: selectedRequestId });

    return () => {
      emit('leaveConversation', { requestId: selectedRequestId });
    };
  }, [selectedRequestId, loadMessages, emit]);

  // If selectedRequestId doesn't exist in conversations, fetch header from request
  useEffect(() => {
    if (!selectedRequestId || !user) return;

    const existing = conversations.find((c) => c.requestId === selectedRequestId);
    if (existing) {
      setHeaderOverride(null);
    } else {
      loadRequestHeader(selectedRequestId);
    }
  }, [selectedRequestId, conversations, user, loadRequestHeader]);

  // Real-time: listen for new messages
  useEffect(() => {
    const unsub = on('newMessage', (message: Message) => {
      if (message.requestId === selectedRequestId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === message.id)) return prev;
          // If this is our own message, the REST response or optimistic update
          // already added it — skip to avoid duplicates
          if (message.senderId === user?.id) {
            const hasTemp = prev.some(
              (m) => m.id.startsWith('temp-') && m.senderId === message.senderId,
            );
            if (hasTemp) {
              return prev.map((m) =>
                m.id.startsWith('temp-') && m.senderId === message.senderId ? message : m,
              );
            }
            return prev;
          }
          return [...prev, message];
        });
      }
      loadConversations();
    });
    return unsub;
  }, [on, selectedRequestId, user?.id, loadConversations]);

  // Real-time: typing indicators
  useEffect(() => {
    const unsub = on('userTyping', (data: { requestId: string; userId: string }) => {
      if (data.requestId === selectedRequestId && data.userId !== user?.id) {
        setTypingUser(data.userId);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setTypingUser(null), 2000);
      }
    });
    return unsub;
  }, [on, selectedRequestId, user?.id]);

  // Fallback polling when socket is NOT connected
  useEffect(() => {
    if (connected || !selectedRequestId) return;
    const interval = setInterval(() => {
      messagesApi.getConversation(selectedRequestId).then((data) => {
        setMessages((prev) => {
          if (
            prev.length === data.length &&
            prev[prev.length - 1]?.id === data[data.length - 1]?.id
          )
            return prev;
          return data;
        });
      }).catch(() => {});
      loadConversations();
    }, 4000);
    return () => clearInterval(interval);
  }, [connected, selectedRequestId, loadConversations]);

  // Scroll to bottom when messages finish loading or new messages arrive
  useEffect(() => {
    if (messages.length > 0 && !isLoadingMessages) {
      scrollToBottom();
    }
  }, [messages, isLoadingMessages, scrollToBottom]);

  // Sync URL param
  useEffect(() => {
    if (selectedRequestId) {
      setSearchParams({ requestId: selectedRequestId });
    } else {
      setSearchParams({});
    }
  }, [selectedRequestId, setSearchParams]);

  const handleSelectConversation = (requestId: string) => {
    if (requestId === selectedRequestId) {
      loadMessages(requestId);
      return;
    }
    setSelectedRequestId(requestId);
    setMessages([]);
    setHeaderOverride(null);
  };

  // ALWAYS send via REST API (reliable), WS broadcasts to all participants
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRequestId || isSending) return;

    const content = newMessage.trim();
    setNewMessage('');
    setIsSending(true);

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
      loadConversations();
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleTyping = () => {
    if (selectedRequestId && connected) {
      emit('typing', { requestId: selectedRequestId });
    }
  };

  // Resolve header from conversation list or override
  const selectedConversation = conversations.find((c) => c.requestId === selectedRequestId);
  const chatHeader: ChatHeaderInfo | null = selectedConversation
    ? {
        name: selectedConversation.otherParty.name,
        avatar: selectedConversation.otherParty.avatar,
        title: selectedConversation.requestTitle,
      }
    : headerOverride;

  const filteredConversations = conversations.filter(
    (c) =>
      c.otherParty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.requestTitle.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Layout>
      <div className="container max-w-6xl py-8 md:py-10">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-label">Inbox</p>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Messages
            </h1>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Chat with clients and providers on your active requests.
            </p>
          </div>
          {connected && (
            <Badge variant="outline" className="w-fit border-success/30 text-xs text-success">
              <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-success" />
              Live
            </Badge>
          )}
        </div>

        <div className="flex min-h-[500px] h-[calc(100vh-240px)] overflow-hidden rounded-2xl border border-border/70 bg-card/40 shadow-soft backdrop-blur-sm">
          {/* Left: Conversation List */}
          <div
            className={cn(
              'flex w-full flex-shrink-0 flex-col border-r border-border/60 bg-card/30 md:w-80',
              selectedRequestId ? 'hidden md:flex' : 'flex',
            )}
          >
            <div className="border-b border-border/60 bg-muted/20 p-3">
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
                      selectedRequestId === conv.requestId &&
                        'bg-primary/5 border-l-2 border-l-primary',
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
                            {formatDistanceToNow(new Date(conv.lastMessage.createdAt), {
                              addSuffix: false,
                            })}
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

          {/* Right: Chat View */}
          <div
            className={cn(
              'flex flex-1 flex-col bg-background/80',
              !selectedRequestId ? 'hidden md:flex' : 'flex',
            )}
          >
            {!selectedRequestId ? (
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
                <div className="flex items-center gap-3 border-b border-border/60 bg-card/40 px-4 py-3 backdrop-blur-sm">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden h-8 w-8"
                    onClick={() => setSelectedRequestId(null)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  {chatHeader ? (
                    <>
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={chatHeader.avatar ?? undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {chatHeader.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{chatHeader.name}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-xs">
                          {typingUser ? 'Typing...' : chatHeader.title}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Loading...</span>
                    </div>
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
                              {!isMe && (
                                <Avatar className="h-7 w-7 flex-shrink-0 mb-1">
                                  <AvatarImage src={msg.sender?.avatar ?? undefined} />
                                  <AvatarFallback className="text-xs bg-secondary">
                                    {msg.sender?.name?.charAt(0).toUpperCase() ?? '?'}
                                  </AvatarFallback>
                                </Avatar>
                              )}
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
                                    isMe
                                      ? 'text-primary-foreground/70 text-right'
                                      : 'text-muted-foreground',
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
                  className="flex gap-2 border-t border-border/60 bg-card/30 p-4 backdrop-blur-sm"
                >
                  <Input
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      handleTyping();
                    }}
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
                  <Button type="submit" size="icon" disabled={!newMessage.trim() || isSending}>
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
