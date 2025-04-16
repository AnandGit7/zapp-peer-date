
import React, { useState, useEffect } from 'react';
import { useP2P } from '@/context/P2PContext';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search, UserPlus, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ChatItem from './ChatItem';

type Conversation = {
  id: string;
  peerId: string;
  displayName: string;
  avatar?: string;
  lastMessage?: {
    content: string;
    timestamp: Date;
    isRead: boolean;
    isSent: boolean;
  };
  unreadCount: number;
  isOnline: boolean;
  isTyping: boolean;
};

// Create sample data for demo
const generateSampleConversations = (): Conversation[] => {
  return [
    {
      id: 'conv-1',
      peerId: 'peer-1',
      displayName: 'Priya Sharma',
      avatar: 'https://source.unsplash.com/random/100x100?portrait&sig=1',
      lastMessage: {
        content: 'Did you check out the latest features?',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        isRead: true,
        isSent: true,
      },
      unreadCount: 0,
      isOnline: true,
      isTyping: false,
    },
    {
      id: 'conv-2',
      peerId: 'peer-2',
      displayName: 'Rahul Kumar',
      avatar: 'https://source.unsplash.com/random/100x100?portrait&sig=2',
      lastMessage: {
        content: "Let me know when you're free to talk",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isRead: false,
        isSent: true,
      },
      unreadCount: 3,
      isOnline: false,
      isTyping: false,
    },
    {
      id: 'conv-3',
      peerId: 'peer-3',
      displayName: 'Neha Patel',
      lastMessage: {
        content: 'The decentralized approach is so cool!',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        isRead: true,
        isSent: true,
      },
      unreadCount: 0,
      isOnline: true,
      isTyping: true,
    },
    {
      id: 'conv-4',
      peerId: 'peer-4',
      displayName: 'Arjun Singh',
      avatar: 'https://source.unsplash.com/random/100x100?portrait&sig=4',
      lastMessage: {
        content: 'Planning to upgrade to premium soon',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        isRead: true,
        isSent: false,
      },
      unreadCount: 0,
      isOnline: false,
      isTyping: false,
    },
    {
      id: 'conv-5',
      peerId: 'peer-5',
      displayName: 'Sneha Gupta',
      avatar: 'https://source.unsplash.com/random/100x100?portrait&sig=5',
      unreadCount: 0,
      isOnline: true,
      isTyping: false,
    },
  ];
};

const ChatsList: React.FC<{
  onSelectChat: (chatId: string) => void;
}> = ({ onSelectChat }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { connections, isConnected } = useP2P();
  
  // Initialize with sample data
  useEffect(() => {
    setConversations(generateSampleConversations());
  }, []);
  
  // Update online status based on P2P connections
  useEffect(() => {
    setConversations(prev => 
      prev.map(conv => ({
        ...conv,
        isOnline: isConnected(conv.peerId),
      }))
    );
  }, [connections, isConnected]);
  
  // Filter conversations by search query
  const filteredConversations = conversations.filter(
    conv => conv.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search chats..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="px-4 py-2 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Chats</h2>
        <Button variant="ghost" size="icon" title="Add new contact">
          <UserPlus className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="overflow-y-auto flex-1">
        {filteredConversations.length > 0 ? (
          <ul className="space-y-1 p-2">
            {filteredConversations.map((conversation) => (
              <ChatItem 
                key={conversation.id}
                conversation={conversation}
                onClick={() => onSelectChat(conversation.id)}
              />
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <div className="mb-4 rounded-full bg-muted p-3">
              <MessageCircleOff className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium">No chats found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {searchQuery ? 'Try a different search term' : 'Start a new conversation!'}
            </p>
          </div>
        )}
      </div>
      
      <Separator />
      
      {/* Connection Status */}
      <div className="p-3 text-xs flex items-center justify-center">
        <span className="flex items-center">
          <span className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
          P2P Connected
          <Badge variant="outline" className="ml-2 bg-muted">
            {connections.length} Peers
          </Badge>
        </span>
      </div>
    </div>
  );
};

// Empty state icon
const MessageCircleOff = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 2 2 22" />
    <path d="M17 14a3 3 0 1 0 0-6H8.8C7.8 8 7 7.3 7 6.5S7.8 5 8.8 5H15" />
    <path d="M17 9a3 3 0 1 0 0 6H8.8C7.8 15 7 14.3 7 13.5S7.8 12 8.8 12H15" />
  </svg>
);

export default ChatsList;
