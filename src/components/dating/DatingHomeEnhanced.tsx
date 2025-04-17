
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Filter, Settings, Crown } from 'lucide-react';
import useDatingHome from './hooks/useDatingHome';
import DiscoveryProfileCard from './DiscoveryProfileCard';
import EmptyDiscoveryCard from './EmptyDiscoveryCard';
import PremiumUpgradePrompt from './PremiumUpgradePrompt';
import MatchesList from './MatchesList';

type DatingHomeEnhancedProps = {
  onStartChat: (matchId: string) => void;
  selectedMatchId: string | null;
  onSelectMatch: (matchId: string) => void;
};

const DatingHomeEnhanced: React.FC<DatingHomeEnhancedProps> = ({ 
  onStartChat, 
  selectedMatchId, 
  onSelectMatch 
}) => {
  const {
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
  } = useDatingHome();
  
  const renderCurrentProfile = () => {
    if (currentIndex >= matches.length) {
      return <EmptyDiscoveryCard onStartOver={handleStartOver} />;
    }
    
    const match = matches[currentIndex];
    return (
      <DiscoveryProfileCard
        match={match}
        isPremium={isPremium}
        onLike={handleLike}
        onDislike={handleDislike}
      />
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
          {!isPremium && <PremiumUpgradePrompt onUpgrade={handleUpgradeToPremium} />}
          {renderCurrentProfile()}
        </TabsContent>
        
        <TabsContent value="matches" className="flex-1 overflow-y-auto data-[state=inactive]:hidden">
          <MatchesList
            matches={mutualMatches}
            isPremium={isPremium}
            onStartChat={onStartChat}
            onDiscoverPeople={() => setActiveTab('discover')}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DatingHomeEnhanced;
