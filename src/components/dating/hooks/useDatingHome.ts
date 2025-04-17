
import { useState, useEffect } from 'react';
import { Match, getAllMatches, updateMatch } from '@/services/DatingService';
import { toast } from "@/components/ui/use-toast";

export const useDatingHome = () => {
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
  
  const handleUpgradeToPremium = () => {
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
  };
  
  const handleStartOver = () => {
    setCurrentIndex(0);
  };
  
  const mutualMatches = matches.filter(match => match.liked && match.hasLikedYou);
  
  return {
    matches,
    currentIndex,
    isPremium,
    activeTab,
    mutualMatches,
    handleLike,
    handleDislike,
    handleUpgradeToPremium,
    handleStartOver,
    setActiveTab
  };
};

export default useDatingHome;
