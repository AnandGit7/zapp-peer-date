
import { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { getDatingProfile, updateDatingProfile } from '@/services/DatingService';

export interface DatingProfile {
  name: string;
  age: number;
  location: string;
  bio: string;
  photos: string[];
  interests: string[];
  isPremium: boolean;
  premiumUntil?: string;
}

export const useDatingProfile = () => {
  const [profile, setProfile] = useState<DatingProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const loadedProfile = await getDatingProfile();
        setProfile(loadedProfile);
      } catch (error) {
        console.error('Failed to load dating profile:', error);
        toast({
          title: "Error loading profile",
          description: "There was a problem loading your profile data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const saveProfile = async (updatedProfile: Partial<DatingProfile>) => {
    try {
      setIsSaving(true);
      
      // Merge with existing profile
      const newProfile = { ...profile, ...updatedProfile };
      
      // Save to persistent storage
      await updateDatingProfile(newProfile);
      
      // Update local state
      setProfile(newProfile);
      
      toast({
        title: "Profile saved",
        description: "Your profile has been updated successfully",
      });
      
      return true;
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast({
        title: "Error saving profile",
        description: "There was a problem saving your profile data",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const upgradeToPremium = async () => {
    try {
      setIsSaving(true);
      
      // Set premium status
      const premiumUntil = new Date();
      premiumUntil.setMonth(premiumUntil.getMonth() + 1);
      
      const updatedProfile = {
        ...profile,
        isPremium: true,
        premiumUntil: premiumUntil.toISOString()
      };
      
      // Save to persistent storage
      await updateDatingProfile(updatedProfile);
      
      // Update local state
      setProfile(updatedProfile);
      
      toast({
        title: "Upgraded to Premium",
        description: "You now have access to all premium features",
      });
      
      return true;
    } catch (error) {
      console.error('Failed to upgrade to premium:', error);
      toast({
        title: "Error upgrading",
        description: "There was a problem upgrading your account",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    profile,
    isLoading,
    isSaving,
    saveProfile,
    upgradeToPremium
  };
};

export default useDatingProfile;
