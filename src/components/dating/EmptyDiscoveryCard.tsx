
import React from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles } from 'lucide-react';

interface EmptyDiscoveryCardProps {
  onStartOver: () => void;
}

const EmptyDiscoveryCard: React.FC<EmptyDiscoveryCardProps> = ({ onStartOver }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-xl font-bold mb-2">No more profiles</h3>
      <p className="text-muted-foreground mb-4">
        You've seen all available profiles. Check back later for more matches!
      </p>
      <Button onClick={onStartOver} variant="outline">
        Start Over
      </Button>
    </div>
  );
};

export default EmptyDiscoveryCard;
