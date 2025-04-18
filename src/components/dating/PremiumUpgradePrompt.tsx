
import React from 'react';
import { Button } from "@/components/ui/button";
import { Crown, Zap, CheckCircle2 } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PremiumUpgradePromptProps {
  onUpgrade: () => void;
  isLoading?: boolean;
}

const PremiumUpgradePrompt: React.FC<PremiumUpgradePromptProps> = ({ 
  onUpgrade, 
  isLoading = false 
}) => {
  return (
    <div className="mb-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg p-4">
      <div className="flex items-start">
        <Crown className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="font-medium">Upgrade to Premium</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Get unlimited matches, see who likes you, and more!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
            <div className="flex items-center text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-1.5" />
              <span>Unlimited likes</span>
            </div>
            <div className="flex items-center text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-1.5" />
              <span>See who liked you</span>
            </div>
            <div className="flex items-center text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-1.5" />
              <span>Premium filters</span>
            </div>
            <div className="flex items-center text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-1.5" />
              <span>Priority matching</span>
            </div>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 w-full md:w-auto"
                  onClick={onUpgrade}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Zap className="h-4 w-4 mr-1 animate-pulse" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-1" />
                      Upgrade for ₹99/month
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>30-day premium access</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default PremiumUpgradePrompt;
