
import React, { useState } from 'react';
import { useDating } from '@/context/DatingContext';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Shield, CheckCircle, ArrowLeft, Star } from 'lucide-react';

type DatingSubscriptionProps = {
  onClose: () => void;
  onSubscribed: () => void;
};

const DatingSubscription: React.FC<DatingSubscriptionProps> = ({ 
  onClose, 
  onSubscribed 
}) => {
  const { subscribeToPremium } = useDating();
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Handle subscription
  const handleSubscribe = async () => {
    setProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Subscribe to premium
      const result = await subscribeToPremium();
      
      if (result) {
        setSuccess(true);
        setTimeout(() => {
          onSubscribed();
        }, 2000);
      } else {
        setProcessing(false);
      }
    } catch (error) {
      console.error('Subscription failed:', error);
      setProcessing(false);
    }
  };
  
  if (success) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Subscription Successful!</h2>
        <p className="text-muted-foreground mb-8">
          You now have access to all premium dating features.
        </p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-4 border-b bg-background p-3">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex-1 text-center">
          <h2 className="text-xl font-bold">Premium Subscription</h2>
        </div>
        
        <div className="w-9"></div> {/* Spacer for alignment */}
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto bg-zapp-dating-primary/10 rounded-full flex items-center justify-center mb-4">
              <Heart className="h-10 w-10 text-zapp-dating-primary" fill="#D946EF" />
            </div>
            <h2 className="text-2xl font-bold">Upgrade to Premium</h2>
            <p className="text-muted-foreground mt-2">
              Get the most out of Zapp Dating with premium features
            </p>
          </div>
          
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-bold">Monthly Subscription</h3>
                  <p className="text-sm text-muted-foreground">Billed monthly</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">₹99</div>
                  <div className="text-xs text-muted-foreground">per month</div>
                </div>
              </div>
              
              <Button 
                className="w-full bg-zapp-dating-primary hover:bg-zapp-dating-primary/90"
                onClick={handleSubscribe}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full mr-2"></div>
                    Processing...
                  </>
                ) : (
                  'Subscribe Now'
                )}
              </Button>
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            <h3 className="font-semibold">Premium Features:</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Star className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium">Unlimited Likes</span>
                  <p className="text-sm text-muted-foreground">Like as many profiles as you want</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Star className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium">See Who Likes You</span>
                  <p className="text-sm text-muted-foreground">View profiles of people who liked you</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Star className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium">Advanced Filters</span>
                  <p className="text-sm text-muted-foreground">Fine-tune your matching preferences</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium">Enhanced Privacy</span>
                  <p className="text-sm text-muted-foreground">Control who can see your profile</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="mt-6 text-center text-xs text-muted-foreground">
            <p className="mb-2">
              Subscription will be charged to your payment method through our secure payment processor. 
              You can cancel anytime.
            </p>
            <p>
              All dating data is stored locally on your device and shared directly peer-to-peer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatingSubscription;
