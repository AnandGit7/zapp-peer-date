
import { useState, useEffect, useCallback } from 'react';
import { Match, getAllMatches, updateMatch } from '@/services/DatingService';
import { toast } from "@/components/ui/use-toast";
import { useDatingProfile } from './useDatingProfile';

export const useDatingHome = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('discover');
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);
  const { profile, isLoading: isLoadingProfile, upgradeToPremium } = useDatingProfile();
  
  const isPremium = profile?.isPremium || false;
  
  const loadMatches = useCallback(async () => {
    try {
      setIsLoadingMatches(true);
      const allMatches = await getAllMatches();
      setMatches(allMatches);
    } catch (error) {
      console.error('Failed to load matches:', error);
      toast({
        title: "Error",
        description: "Failed to load matches. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingMatches(false);
    }
  }, []);
  
  useEffect(() => {
    loadMatches();
  }, [loadMatches]);
  
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
      toast({
        title: "Error",
        description: "Failed to like profile. Please try again.",
        variant: "destructive"
      });
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
      toast({
        title: "Error",
        description: "Failed to skip profile. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleUpgradeToPremium = async () => {
    const success = await upgradeToPremium();
    
    if (success) {
      toast({
        title: "Welcome to Premium!",
        description: "You now have access to all premium features.",
      });
    }
  };
  
  const handleStartOver = () => {
    setCurrentIndex(0);
    loadMatches();
  };
  
  const mutualMatches = matches.filter(match => match.liked && match.hasLikedYou);
  
  return {
    matches,
    currentIndex,
    isPremium,
    activeTab,
    mutualMatches,
    isLoading: isLoadingMatches || isLoadingProfile,
    handleLike,
    handleDislike,
    handleUpgradeToPremium,
    handleStartOver,
    setActiveTab,
    refreshMatches: loadMatches
  };
};

export default useDatingHome;
