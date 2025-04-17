
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Filter, Settings, ChevronRight, Star } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getAllMatches, Match, getDatingProfile } from '@/services/DatingService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const DatingNavigation = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = React.useState<Match[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isPremium, setIsPremium] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch matches
        const fetchedMatches = await getAllMatches();
        setMatches(fetchedMatches.filter(match => match.matchedOn)); // Only show actual matches
        
        // Check premium status
        const profile = await getDatingProfile();
        setIsPremium(profile?.isPremium || false);
      } catch (error) {
        console.error('Failed to fetch dating data:', error);
        toast.error('Failed to load matches');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMatchSelect = (matchId: string) => {
    console.log('Selected match:', matchId);
    toast.info(`Opening conversation with match: ${matchId}`);
    // In a real app, this would navigate to the chat with this match
  };

  const handleDatingSettings = () => {
    toast.info('Dating settings will be implemented here');
    // In a real app, this would navigate to dating settings
  };

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <Heart 
              className={cn(
                "mr-2 h-4 w-4",
                isPremium ? "text-zapp-dating-primary" : ""
              )}
              fill={isPremium ? "#D946EF" : "none"}
            />
            <span>Dating</span>
            {isPremium && (
              <Badge variant="outline" className="ml-2 bg-zapp-dating-primary text-white text-xs py-0 px-1.5">
                PRO
              </Badge>
            )}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[300px] p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium">Your Matches</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => toast.info('Discover new matches')}
                  className="h-8 w-8 p-0"
                >
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filter Matches</span>
                </Button>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-zapp-dating-primary"></div>
                </div>
              ) : (
                <ul className="space-y-2 max-h-[300px] overflow-y-auto">
                  {matches.length > 0 ? (
                    matches.map((match) => (
                      <li key={match.id}>
                        <NavigationMenuLink asChild>
                          <button
                            onClick={() => handleMatchSelect(match.id)}
                            className={cn(
                              "w-full flex items-center p-2 rounded-md hover:bg-accent text-left"
                            )}
                          >
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={match.photos[0]} alt={match.name} />
                              <AvatarFallback>{match.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center">
                                <p className="text-sm font-medium truncate">{match.name}</p>
                                <span className="text-xs ml-1">{match.age}</span>
                                {match.isPremium && (
                                  <Star className="h-3 w-3 ml-1 text-zapp-dating-primary fill-zapp-dating-primary" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground truncate">
                                Matched {match.matchedOn}
                              </p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </NavigationMenuLink>
                      </li>
                    ))
                  ) : (
                    <li className="text-center py-2 text-sm text-muted-foreground">
                      No matches yet
                    </li>
                  )}
                </ul>
              )}
              
              {!isPremium && (
                <div className="mt-4 p-3 bg-muted/50 rounded-md border border-dashed">
                  <p className="text-sm text-center">
                    Upgrade to Premium for advanced matching
                  </p>
                  <Button 
                    size="sm" 
                    className="w-full mt-2 bg-zapp-dating-primary hover:bg-zapp-dating-primary/90"
                    onClick={() => toast.info('Premium upgrade coming soon')}
                  >
                    Upgrade Now
                  </Button>
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={handleDatingSettings}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Dating Preferences</span>
                </Button>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DatingNavigation;
