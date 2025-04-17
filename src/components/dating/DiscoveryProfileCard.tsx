
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, X, MapPin, Clock, ThumbsUp, Sparkles, Crown } from 'lucide-react';
import { Match } from '@/services/DatingService';
import { toast } from "@/components/ui/use-toast";

interface DiscoveryProfileCardProps {
  match: Match;
  isPremium: boolean;
  onLike: () => void;
  onDislike: () => void;
}

const DiscoveryProfileCard: React.FC<DiscoveryProfileCardProps> = ({
  match,
  isPremium,
  onLike,
  onDislike
}) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-lg">
        <img 
          src={match.photos[0]} 
          alt={match.name} 
          className="w-full h-full object-cover"
        />
        
        {isPremium && (
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-primary text-white px-3 py-1">
              <Crown className="h-3 w-3 mr-1" />
              Premium Match
            </Badge>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
          <h3 className="text-xl font-bold">{match.name}, {match.age}</h3>
          <div className="flex items-center text-sm">
            <MapPin className="h-3 w-3 mr-1" />
            {match.location}
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2 mb-3">
          {match.interests.map((interest, index) => (
            <Badge key={index} variant="outline" className="bg-muted">
              {interest}
            </Badge>
          ))}
        </div>
        
        <p className="text-sm text-muted-foreground">{match.bio}</p>
        
        {isPremium && (
          <div className="mt-3 pt-3 border-t text-sm">
            <div className="flex items-center text-muted-foreground mb-1">
              <Clock className="h-3 w-3 mr-1" />
              Active {match.lastActive}
            </div>
            <div className="flex items-center text-muted-foreground">
              <ThumbsUp className="h-3 w-3 mr-1" />
              {match.compatibilityScore}% compatibility
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-center gap-4 p-4 pt-0">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-12 w-12 rounded-full border-pink-200 hover:bg-pink-50 hover:text-pink-500"
          onClick={onDislike}
        >
          <X className="h-6 w-6" />
        </Button>
        
        <Button 
          variant="default" 
          size="icon" 
          className="h-14 w-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
          onClick={onLike}
        >
          <Heart className="h-7 w-7 text-white" />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="h-12 w-12 rounded-full border-blue-200 hover:bg-blue-50 hover:text-blue-500"
          onClick={() => {
            if (!isPremium) {
              toast({
                title: "Premium Feature",
                description: "Upgrade to Premium to send super likes!",
                variant: "default"
              });
              return;
            }
            
            toast({
              title: "Super Like Sent!",
              description: `You sent a super like to ${match.name}`,
            });
            
            onLike();
          }}
        >
          <Sparkles className="h-6 w-6" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DiscoveryProfileCard;
