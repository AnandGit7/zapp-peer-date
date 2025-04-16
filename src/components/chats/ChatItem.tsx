
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCheck, Circle } from 'lucide-react';

type ChatItemProps = {
  conversation: {
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
  onClick: () => void;
};

const ChatItem: React.FC<ChatItemProps> = ({ conversation, onClick }) => {
  const { displayName, avatar, lastMessage, unreadCount, isOnline, isTyping } = conversation;
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <li 
      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors
        ${unreadCount > 0 ? 'bg-primary/5' : 'hover:bg-muted'}`}
      onClick={onClick}
    >
      <div className="relative">
        <Avatar>
          <AvatarImage src={avatar} alt={displayName} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {getInitials(displayName)}
          </AvatarFallback>
        </Avatar>
        {isOnline && (
          <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-medium truncate">{displayName}</h3>
          {lastMessage && (
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatDistanceToNow(lastMessage.timestamp, { addSuffix: false })}
            </span>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-1">
          <p className={`text-sm truncate ${unreadCount > 0 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
            {isTyping ? (
              <span className="italic text-primary">typing...</span>
            ) : lastMessage ? (
              lastMessage.content
            ) : (
              <span className="text-muted-foreground/50">No messages yet</span>
            )}
          </p>
          
          <div className="flex items-center gap-1">
            {lastMessage && lastMessage.isSent && (
              <span className="text-xs">
                {lastMessage.isRead ? (
                  <CheckCheck className="h-4 w-4 text-primary" />
                ) : (
                  <CheckCheck className="h-4 w-4 text-muted-foreground" />
                )}
              </span>
            )}
            
            {unreadCount > 0 && (
              <Badge variant="default" className="h-5 w-5 p-0 flex items-center justify-center rounded-full">
                {unreadCount}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

export default ChatItem;
