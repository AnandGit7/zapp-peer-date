
import React from 'react';
import { Button } from "@/components/ui/button";
import { Crown, Zap } from 'lucide-react';

interface PremiumUpgradePromptProps {
  onUpgrade: () => void;
}

const PremiumUpgradePrompt: React.FC<PremiumUpgradePromptProps> = ({ onUpgrade }) => {
  return (
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
            onClick={onUpgrade}
          >
            <Zap className="h-4 w-4 mr-1" />
            Upgrade for ₹99/month
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PremiumUpgradePrompt;
