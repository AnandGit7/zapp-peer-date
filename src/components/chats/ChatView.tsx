
import React, { useState, useRef, useEffect } from 'react';
import { useP2P } from '@/context/P2PContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, MoreVertical, Phone, Video, 
  Image, Mic, Send, Clock, CheckCheck 
} from 'lucide-react';

type Message = {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  isMe: boolean;
};

type ChatViewProps = {
  chatId: string;
  onBack: () => void;
};

// Generate sample messages for demo
const generateSampleMessages = (chatId: string): Message[] => {
  // Get current time and make some messages older
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  
  return [
    {
      id: `msg-${chatId}-1`,
      senderId: 'peer-1',
      content: "Hey, how's it going with the Zapp app?",
      timestamp: twoHoursAgo,
      status: 'read',
      isMe: false,
    },
    {
      id: `msg-${chatId}-2`,
      senderId: 'me',
      content: "It's amazing! I love the P2P approach.",
      timestamp: twoHoursAgo,
      status: 'read',
      isMe: true,
    },
    {
      id: `msg-${chatId}-3`,
      senderId: 'peer-1',
      content: "The privacy features are really well thought out.",
      timestamp: oneHourAgo,
      status: 'read',
      isMe: false,
    },
    {
      id: `msg-${chatId}-4`,
      senderId: 'me',
      content: "Yeah, especially the end-to-end encryption.",
      timestamp: oneHourAgo,
      status: 'read',
      isMe: true,
    },
    {
      id: `msg-${chatId}-5`,
      senderId: 'peer-1',
      content: "Have you tried the dating feature yet?",
      timestamp: new Date(now.getTime() - 30 * 60 * 1000),
      status: 'read',
      isMe: false,
    },
    {
      id: `msg-${chatId}-6`,
      senderId: 'me',
      content: "Not yet, but I'm intrigued by it. It's only 99 rupees, right?",
      timestamp: new Date(now.getTime() - 25 * 60 * 1000),
      status: 'read',
      isMe: true,
    },
    {
      id: `msg-${chatId}-7`,
      senderId: 'peer-1',
      content: "Yes, just 99 rupees monthly. The matching algorithm is quite good!",
      timestamp: new Date(now.getTime() - 20 * 60 * 1000),
      status: 'read',
      isMe: false,
    },
    {
      id: `msg-${chatId}-8`,
      senderId: 'me',
      content: "Good to know. I think I'll give it a try this weekend.",
      timestamp: new Date(now.getTime() - 5 * 60 * 1000),
      status: 'delivered',
      isMe: true,
    },
  ];
};

// Chat conversation details
const getConversationDetails = (chatId: string) => {
  // This would be fetched from the P2P context or local database
  return {
    id: chatId,
    peerId: 'peer-1',
    displayName: 'Priya Sharma',
    avatar: 'https://source.unsplash.com/random/100x100?portrait&sig=1',
    isOnline: true,
    lastSeen: new Date(),
  };
};

const ChatView: React.FC<ChatViewProps> = ({ chatId, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendMessage } = useP2P();
  
  const conversation = getConversationDetails(chatId);
  
  // Initialize with sample messages
  useEffect(() => {
    setMessages(generateSampleMessages(chatId));
  }, [chatId]);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Format date to show time or date based on how old it is
  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' +
        date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Create a new message
    const newMessage: Message = {
      id: `msg-${chatId}-${Date.now()}`,
      senderId: 'me',
      content: inputMessage,
      timestamp: new Date(),
      status: 'sent',
      isMe: true,
    };
    
    // Update messages state
    setMessages(prev => [...prev, newMessage]);
    
    // Clear input
    setInputMessage('');
    
    // Send through P2P connection (this is a simulated send)
    setTimeout(() => {
      // Update message status to delivered
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
        )
      );
      
      // Simulate the other user typing
      setTimeout(() => {
        setIsTyping(true);
        
        // Simulate receiving a reply
        setTimeout(() => {
          setIsTyping(false);
          
          // Add response message
          const responseMessage: Message = {
            id: `msg-${chatId}-${Date.now()}`,
            senderId: conversation.peerId,
            content: "That sounds great! Let me know how you like it.",
            timestamp: new Date(),
            status: 'sent',
            isMe: false,
          };
          
          setMessages(prev => [...prev, responseMessage]);
          
          // Mark our last message as read
          setTimeout(() => {
            setMessages(prev => 
              prev.map(msg => 
                msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
              )
            );
          }, 1000);
        }, 3000);
      }, 1000);
    }, 1000);
  };
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  // Group messages by date
  const groupedMessages: { date: string; messages: Message[] }[] = [];
  let currentDate = '';
  
  messages.forEach(message => {
    const messageDate = message.timestamp.toDateString();
    
    if (messageDate !== currentDate) {
      currentDate = messageDate;
      groupedMessages.push({
        date: messageDate,
        messages: [message],
      });
    } else {
      groupedMessages[groupedMessages.length - 1].messages.push(message);
    }
  });
  
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Chat Header */}
      <div className="sticky top-0 z-10 flex items-center gap-4 border-b bg-background p-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-3 flex-1">
          <Avatar>
            <AvatarImage src={conversation.avatar} alt={conversation.displayName} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(conversation.displayName)}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h3 className="font-medium text-base">{conversation.displayName}</h3>
            <p className="text-xs text-muted-foreground">
              {conversation.isOnline ? (
                <span className="text-green-500">Online</span>
              ) : (
                <span>Last seen recently</span>
              )}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" title="Voice call">
            <Phone className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" title="Video call">
            <Video className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" title="More options">
            <MoreVertical className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {groupedMessages.map(group => (
          <div key={group.date} className="space-y-3">
            <div className="flex justify-center">
              <span className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">
                {new Date(group.date).toLocaleDateString([], {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            
            {group.messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isMe
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary/20 text-foreground'
                  }`}
                >
                  <p className="text-sm break-words">{message.content}</p>
                  <div
                    className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                      message.isMe ? 'text-primary-foreground/80' : 'text-muted-foreground'
                    }`}
                  >
                    <span>{formatMessageTime(message.timestamp)}</span>
                    
                    {message.isMe && (
                      <span className="ml-1">
                        {message.status === 'sent' && <Clock className="h-3 w-3" />}
                        {message.status === 'delivered' && <CheckCheck className="h-3 w-3" />}
                        {message.status === 'read' && (
                          <CheckCheck className="h-3 w-3 text-blue-400" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-secondary/20 text-foreground rounded-lg px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-foreground/70 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-foreground/70 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-foreground/70 animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="border-t bg-background p-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" title="Attach image">
            <Image className="h-5 w-5 text-muted-foreground" />
          </Button>
          
          <Button variant="ghost" size="icon" title="Voice message">
            <Mic className="h-5 w-5 text-muted-foreground" />
          </Button>
          
          <div className="flex-1">
            <Input
              placeholder="Type a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="bg-secondary/20"
            />
          </div>
          
          <Button 
            variant="default" 
            size="icon" 
            disabled={!inputMessage.trim()} 
            onClick={handleSendMessage}
            title="Send message"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="mt-2 text-xs text-center text-muted-foreground">
          <p>End-to-end encrypted with Signal Protocol</p>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
