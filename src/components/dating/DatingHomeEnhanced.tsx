import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Heart, X, MessageSquare, Crown, Settings, Filter, MapPin, Calendar, Sparkles, MessageCircle, Coffee, User, ThumbsUp, Zap, Clock } from 'lucide-react';
import { getAllMatches, Match, updateMatch } from '@/services/DatingService';

type DatingHomeEnhancedProps = {
  onStartChat: (matchId: string) => void;
  selectedMatchId: string | null;
  onSelectMatch: (matchId: string) => void;
};

const DatingHomeEnhanced: React.FC<DatingHomeEnhancedProps> = ({ onStartChat, selectedMatchId, onSelectMatch }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [activeTab, setActiveTab] = useState('discover');
  
  useEffect(() => {
    const loadMatches = async () => {
      try {
        const allMatches = await getAllMatches();
        setMatches(allMatches);
      } catch (error) {
        console.error('Failed to load matches:', error);
      }
    };
    
    const checkPremium = () => {
      try {
        const profile = localStorage.getItem('datingProfile');
        if (profile) {
          const parsed = JSON.parse(profile);
          setIsPremium(parsed.isPremium || false);
        }
      } catch (error) {
        console.error('Failed to check premium status:', error);
      }
    };
    
    loadMatches();
    checkPremium();
  }, []);
  
  const handleLike = async () => {
    if (currentIndex >= matches.length) return;
    
    const match = matches[currentIndex];
    
    try {
      match.liked = true;
      await updateMatch(match.id, match);
      
      toast({
        title: "Liked!",
        description: `You liked ${match.name}`,
      });
      
      setCurrentIndex(currentIndex + 1);
    } catch (error) {
      console.error('Failed to update match:', error);
    }
  };
  
  const handleDislike = async () => {
    if (currentIndex >= matches.length) return;
    
    const match = matches[currentIndex];
    
    try {
      match.liked = false;
      await updateMatch(match.id, match);
      
      setCurrentIndex(currentIndex + 1);
    } catch (error) {
      console.error('Failed to update match:', error);
    }
  };
  
  const mutualMatches = matches.filter(match => match.liked && match.hasLikedYou);
  
  const renderCurrentProfile = () => {
    if (currentIndex >= matches.length) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
          <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-bold mb-2">No more profiles</h3>
          <p className="text-muted-foreground mb-4">
            You've seen all available profiles. Check back later for more matches!
          </p>
          <Button onClick={() => setCurrentIndex(0)} variant="outline">
            Start Over
          </Button>
        </div>
      );
    }
    
    const match = matches[currentIndex];
    
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
            onClick={handleDislike}
          >
            <X className="h-6 w-6" />
          </Button>
          
          <Button 
            variant="default" 
            size="icon" 
            className="h-14 w-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            onClick={handleLike}
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
              
              handleLike();
            }}
          >
            <Sparkles className="h-6 w-6" />
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-pink-500 to-purple-500">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <Heart className="h-5 w-5 mr-2 fill-white" />
          Dating
          {isPremium && <Crown className="h-4 w-4 ml-2 text-yellow-300" />}
        </h2>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-white hover:bg-white/20">
            <Filter className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-white hover:bg-white/20">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-4 pt-2">
          <TabsList className="w-full">
            <TabsTrigger 
              value="discover" 
              className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none data-[state=active]:shadow-none"
            >
              Discover
            </TabsTrigger>
            <TabsTrigger 
              value="matches" 
              className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none data-[state=active]:shadow-none"
            >
              Matches {mutualMatches.length > 0 && `(${mutualMatches.length})`}
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="discover" className="flex-1 p-4 overflow-y-auto data-[state=inactive]:hidden">
          {!isPremium && (
            <div className="mb-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg p-4">
              <div className="flex items-start">
                <Crown className="h-6 w-6 text-amber-500 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Upgrade to Premium</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Get unlimited matches, see who likes you, and more!
                  </p>
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                    onClick={() => {
                      try {
                        const profile = localStorage.getItem('datingProfile') || '{}';
                        const parsed = JSON.parse(profile);
                        parsed.isPremium = true;
                        localStorage.setItem('datingProfile', JSON.stringify(parsed));
                        setIsPremium(true);
                        
                        toast({
                          title: "Upgraded to Premium!",
                          description: "You now have access to all premium features.",
                        });
                      } catch (error) {
                        console.error('Failed to set premium status:', error);
                      }
                    }}
                  >
                    <Zap className="h-4 w-4 mr-1" />
                    Upgrade for ₹99/month
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {renderCurrentProfile()}
        </TabsContent>
        
        <TabsContent value="matches" className="flex-1 overflow-y-auto data-[state=inactive]:hidden">
          {mutualMatches.length > 0 ? (
            <div className="p-4 grid gap-4 grid-cols-1">
              {mutualMatches.map(match => (
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
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <Heart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold mb-2">No matches yet</h3>
              <p className="text-muted-foreground mb-4">
                Swipe right on profiles you like to get matches!
              </p>
              <Button 
                onClick={() => setActiveTab('discover')} 
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                <User className="h-4 w-4 mr-1" />
                Discover People
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DatingHomeEnhanced;
