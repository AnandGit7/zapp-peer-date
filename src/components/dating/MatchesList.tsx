import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Crown, MessageCircle, Coffee, Heart, User, Loader2 } from 'lucide-react';
import { Match } from '@/services/DatingService';
import { toast } from "@/components/ui/use-toast";

interface MatchesListProps {
  matches: Match[];
  isPremium: boolean;
  onStartChat: (matchId: string) => void;
  onDiscoverPeople: () => void;
  isLoading?: boolean;
}

const MatchesList: React.FC<MatchesListProps> = ({
  matches,
  isPremium,
  onStartChat,
  onDiscoverPeople,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <Loader2 className="h-12 w-12 text-muted-foreground mb-4 animate-spin" />
        <h3 className="text-xl font-bold mb-2">Loading matches</h3>
        <p className="text-muted-foreground mb-4">
          Finding people who matched with you...
        </p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <Heart className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-bold mb-2">No matches yet</h3>
        <p className="text-muted-foreground mb-4">
          Swipe right on profiles you like to get matches!
        </p>
        <Button 
          onClick={onDiscoverPeople} 
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
        >
          <User className="h-4 w-4 mr-1" />
          Discover People
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 grid gap-4 grid-cols-1">
      {matches.map(match => (
        <Card key={match.id} className="hover:bg-muted/20 transition-colors cursor-pointer">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center">
              <Avatar className="h-12 w-12 mr-2">
                <AvatarImage src={match.photos[0]} alt={match.name} />
                <AvatarFallback>{match.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg flex items-center">
                  {match.name}, {match.age}
                  {isPremium && match.isPremium && (
                    <Crown className="h-4 w-4 ml-1 text-amber-500" />
                  )}
                </CardTitle>
                <CardDescription className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {match.location}
                </CardDescription>
              </div>
              <div className="ml-auto text-sm text-muted-foreground">
                {match.matchedOn}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-4 pt-0">
            <p className="text-sm line-clamp-2">{match.bio}</p>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {match.interests.slice(0, 3).map((interest, index) => (
                <Badge key={index} variant="outline" className="bg-muted text-xs">
                  {interest}
                </Badge>
              ))}
              {match.interests.length > 3 && (
                <Badge variant="outline" className="bg-muted text-xs">
                  +{match.interests.length - 3} more
                </Badge>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="p-4 pt-2">
            <Button 
              size="sm" 
              variant="default"
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              onClick={() => onStartChat(match.id)}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Start Chat
            </Button>
            
            {isPremium && (
              <Button 
                size="sm" 
                variant="outline"
                className="ml-2"
                onClick={() => {
                  toast({
                    title: "Date Request Sent",
                    description: `Coffee date request sent to ${match.name}!`,
                  });
                }}
              >
                <Coffee className="h-4 w-4 mr-1" />
                Coffee Date
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default MatchesList;
