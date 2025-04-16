
import React, { useState, useEffect } from 'react';
import { useDating } from '@/context/DatingContext';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Heart, X, Star, MessageCircle, Filter, Settings,
  Shield, Lock, PlusCircle, Calendar, MapPin, ChevronRight
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import DatingProfile from './DatingProfile';
import DatingSubscription from './DatingSubscription';
import DatingMatchList from './DatingMatchList';

const DatingHome: React.FC<{
  onStartChat: (matchId: string) => void;
}> = ({ onStartChat }) => {
  const { 
    myProfile, 
    potentialMatches, 
    matches, 
    isPremium, 
    likeProfile, 
    passProfile,
    loadMoreProfiles,
    upgradePromptVisible,
    hideUpgradePrompt,
    showUpgradePrompt,
    loading 
  } = useDating();
  
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showMatches, setShowMatches] = useState(false);
  const [swipeAnimation, setSwipeAnimation] = useState<'left' | 'right' | null>(null);
  
  // Show upgrade prompt after 3 profiles if not premium
  useEffect(() => {
    if (!isPremium && currentProfileIndex === 3) {
      showUpgradePrompt();
    }
  }, [currentProfileIndex, isPremium, showUpgradePrompt]);
  
  // Current profile to display
  const currentProfile = potentialMatches[currentProfileIndex];
  
  // Handle like
  const handleLike = () => {
    setSwipeAnimation('right');
    setTimeout(() => {
      if (currentProfile) {
        likeProfile(currentProfile.id);
      }
      
      // Move to next profile or load more if needed
      if (currentProfileIndex + 1 >= potentialMatches.length) {
        loadMoreProfiles();
        setCurrentProfileIndex(0);
      } else {
        setCurrentProfileIndex(prev => prev + 1);
      }
      setSwipeAnimation(null);
    }, 300);
  };
  
  // Handle pass
  const handlePass = () => {
    setSwipeAnimation('left');
    setTimeout(() => {
      if (currentProfile) {
        passProfile(currentProfile.id);
      }
      
      // Move to next profile or load more if needed
      if (currentProfileIndex + 1 >= potentialMatches.length) {
        loadMoreProfiles();
        setCurrentProfileIndex(0);
      } else {
        setCurrentProfileIndex(prev => prev + 1);
      }
      setSwipeAnimation(null);
    }, 300);
  };
  
  // If showing subscription screen
  if (showSubscription) {
    return (
      <DatingSubscription 
        onClose={() => setShowSubscription(false)}
        onSubscribed={() => {
          setShowSubscription(false);
          hideUpgradePrompt();
        }}
      />
    );
  }
  
  // If showing matches
  if (showMatches) {
    return (
      <DatingMatchList 
        matches={matches}
        onStartChat={onStartChat}
        onBack={() => setShowMatches(false)}
      />
    );
  }
  
  // If profile not set up
  if (!myProfile) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Heart className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Welcome to Zapp Dating</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          Connect with amazing people through our secure, private P2P dating platform.
        </p>
        <Button className="mb-4">Create Your Profile</Button>
        <p className="text-xs text-muted-foreground">
          <Shield className="h-3 w-3 inline mr-1" />
          Your data stays on your device, not on any server.
        </p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Dating Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b bg-background p-3">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setShowMatches(true)}
          className="relative"
        >
          <MessageCircle className="h-5 w-5" />
          {matches.length > 0 && (
            <Badge variant="default" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center">
              {matches.length}
            </Badge>
          )}
        </Button>
        
        <div className="flex items-center gap-1">
          <Heart className="h-5 w-5 text-zapp-dating-primary" fill="#D946EF" />
          <h2 className="text-xl font-bold text-zapp-dating-primary">Dating</h2>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon">
            <Filter className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </div>
      
      {/* Premium Status */}
      {!isPremium && (
        <div 
          className="bg-gradient-to-r from-zapp-dating-primary/20 to-zapp-dating-primary/5 p-2 flex justify-between items-center cursor-pointer"
          onClick={() => setShowSubscription(true)}
        >
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-zapp-dating-primary" fill="#D946EF" />
            <span className="text-sm">Upgrade to Premium - just ₹99/month</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
      
      {/* Dating Profiles */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        )}
        
        {!loading && potentialMatches.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No more profiles</h3>
            <p className="text-muted-foreground mb-4">
              We're finding more amazing people near you.
            </p>
            <Button onClick={() => loadMoreProfiles()}>Refresh</Button>
          </div>
        )}
        
        {!loading && currentProfile && (
          <div 
            className={`relative transition-transform duration-300 ${
              swipeAnimation === 'left' ? 'translate-x-[-100%] opacity-0' : 
              swipeAnimation === 'right' ? 'translate-x-[100%] opacity-0' : ''
            }`}
          >
            <DatingProfile profile={currentProfile} />
            
            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-4">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-14 w-14 rounded-full border-2 border-gray-300 hover:border-red-400 hover:bg-red-100"
                onClick={handlePass}
              >
                <X className="h-8 w-8 text-gray-400 hover:text-red-500" />
              </Button>
              
              {isPremium ? (
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-14 w-14 rounded-full border-2 border-yellow-300 hover:border-yellow-500 hover:bg-yellow-100"
                >
                  <Star className="h-8 w-8 text-yellow-400 hover:text-yellow-500" />
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-14 w-14 rounded-full border-2 border-yellow-300 hover:border-yellow-500 hover:bg-yellow-100"
                  onClick={() => setShowSubscription(true)}
                >
                  <Lock className="h-8 w-8 text-yellow-400 hover:text-yellow-500" />
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="icon" 
                className="h-14 w-14 rounded-full border-2 border-green-300 hover:border-green-500 hover:bg-green-100"
                onClick={handleLike}
              >
                <Heart className="h-8 w-8 text-green-400 hover:text-green-500" />
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Upgrade Prompt */}
      {upgradePromptVisible && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-20 w-20 rounded-full bg-zapp-dating-primary/10 flex items-center justify-center mb-4">
                  <Heart className="h-10 w-10 text-zapp-dating-primary" fill="#D946EF" />
                </div>
                
                <h2 className="text-xl font-bold mb-2">Upgrade to Premium Dating</h2>
                <p className="text-muted-foreground mb-4">
                  Get unlimited likes, see who likes you, and access premium features
                </p>
                
                <div className="bg-muted p-4 rounded-lg w-full mb-4">
                  <div className="text-3xl font-bold text-zapp-dating-primary mb-1">₹99 <span className="text-sm font-normal text-muted-foreground">/month</span></div>
                  <div className="text-sm text-muted-foreground">That's just ₹3.3 per day!</div>
                </div>
                
                <ul className="text-left space-y-2 mb-6 w-full">
                  <li className="flex items-center gap-2">
                    <PlusCircle className="h-5 w-5 text-green-500" />
                    <span>Unlimited likes and matches</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span>See who already likes you</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-500" />
                    <span>Advanced location filtering</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-purple-500" />
                    <span>Premium privacy features</span>
                  </li>
                </ul>
                
                <div className="flex gap-3 w-full">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={hideUpgradePrompt}
                  >
                    Later
                  </Button>
                  <Button 
                    className="flex-1 bg-zapp-dating-primary hover:bg-zapp-dating-primary/90"
                    onClick={() => {
                      hideUpgradePrompt();
                      setShowSubscription(true);
                    }}
                  >
                    Upgrade Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DatingHome;
