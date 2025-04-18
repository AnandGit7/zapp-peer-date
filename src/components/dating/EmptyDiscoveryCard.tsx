
import React from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw, Users } from 'lucide-react';

interface EmptyDiscoveryCardProps {
  onStartOver: () => void;
  isLoading?: boolean;
}

const EmptyDiscoveryCard: React.FC<EmptyDiscoveryCardProps> = ({ onStartOver, isLoading = false }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-xl font-bold mb-2">No more profiles</h3>
      <p className="text-muted-foreground mb-6">
        You've seen all available profiles for now. We'll find more matches that align with your preferences soon!
      </p>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button 
          onClick={onStartOver} 
          variant="default" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Loading profiles...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Matches
            </>
          )}
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
        >
          <Users className="h-4 w-4 mr-2" />
          Adjust Preferences
        </Button>
      </div>
    </div>
  );
};

export default EmptyDiscoveryCard;
