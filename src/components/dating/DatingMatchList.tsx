
import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';

type Match = {
  id: string;
  profileId: string;
  matchedWith: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  createdAt: Date;
  messages: any[];
};

type DatingMatchListProps = {
  matches: Match[];
  onStartChat: (matchId: string) => void;
  onBack: () => void;
};

const DatingMatchList: React.FC<DatingMatchListProps> = ({ 
  matches, 
  onStartChat, 
  onBack 
}) => {
  // Get sample match profiles (in a real app, would be fetched based on matchedWith)
  const getMatchProfiles = () => {
    return matches.map(match => ({
      id: match.id,
      profileId: match.matchedWith,
      name: `Match ${match.matchedWith.slice(-2)}`,
      avatar: `https://source.unsplash.com/random/100x100?portrait&sig=${match.id}`,
      lastActive: new Date(Date.now() - Math.floor(Math.random() * 86400000)), // Random in last 24h
      hasUnreadMessages: Math.random() > 0.7,
      matchDate: match.createdAt,
    }));
  };
  
  const matchProfiles = getMatchProfiles();
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-4 border-b bg-background p-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex-1">
          <h2 className="text-xl font-bold">Your Matches</h2>
        </div>
      </div>
      
      {/* Matches List */}
      <div className="flex-1 overflow-y-auto">
        {matchProfiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No matches yet</h3>
            <p className="text-muted-foreground">
              Continue discovering profiles to find your match
            </p>
          </div>
        ) : (
          <ul className="divide-y">
            {matchProfiles.map(profile => (
              <li key={profile.id} className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(profile.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium truncate">{profile.name}</h3>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(profile.matchDate, { addSuffix: true })}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground truncate">
                      {profile.hasUnreadMessages 
                        ? "New message" 
                        : `Matched ${formatDistanceToNow(profile.matchDate, { addSuffix: true })}`}
                    </p>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-primary" 
                    onClick={() => onStartChat(profile.id)}
                  >
                    <MessageCircle className="h-5 w-5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="p-4 border-t">
        <p className="text-xs text-center text-muted-foreground">
          All conversations are end-to-end encrypted and peer-to-peer
        </p>
      </div>
    </div>
  );
};

export default DatingMatchList;
