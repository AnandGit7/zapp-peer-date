
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import localforage from 'localforage';

// Define types
type DatingProfile = {
  id: string;
  username: string;
  age: number;
  bio: string;
  interests: string[];
  photos: string[];
  location?: {
    city: string;
    country: string;
    coordinates?: [number, number]; // [latitude, longitude]
  };
  preferences: {
    ageRange: [number, number];
    distance?: number; // in km
    interests?: string[];
  };
  lastActive: Date;
  isPremium: boolean;
  premiumUntil?: Date;
};

type Match = {
  id: string;
  profileId: string;
  matchedWith: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  createdAt: Date;
  messages: any[]; // Would be linked to the message system
};

type DatingContextType = {
  myProfile: DatingProfile | null;
  potentialMatches: DatingProfile[];
  matches: Match[];
  isPremium: boolean;
  subscribeToPremium: () => Promise<boolean>;
  updateProfile: (profile: Partial<DatingProfile>) => Promise<void>;
  likeProfile: (profileId: string) => Promise<void>;
  passProfile: (profileId: string) => Promise<void>;
  loadMoreProfiles: () => Promise<void>;
  upgradePromptVisible: boolean;
  showUpgradePrompt: () => void;
  hideUpgradePrompt: () => void;
  loading: boolean;
};

// Create sample profiles for demo purposes
const createSampleProfiles = (): DatingProfile[] => {
  const interests = [
    "Hiking", "Reading", "Travel", "Music", "Art", "Movies", "Cooking", 
    "Technology", "Sports", "Photography", "Dancing", "Writing"
  ];
  
  const cities = [
    {city: "Mumbai", country: "India"}, 
    {city: "Delhi", country: "India"},
    {city: "Bangalore", country: "India"},
    {city: "Chennai", country: "India"},
    {city: "Hyderabad", country: "India"}
  ];
  
  // Generate 15 sample profiles
  return Array.from({ length: 15 }, (_, i) => {
    const randomAge = Math.floor(Math.random() * 15) + 22; // 22-37
    const randomInterests = interests
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 5) + 3); // 3-7 interests
    
    const randomLocationIndex = Math.floor(Math.random() * cities.length);
    
    return {
      id: `profile-${i + 1}`,
      username: `user${i + 1}`,
      age: randomAge,
      bio: `Hi! I'm user${i + 1}, enjoying life and looking to meet new people.`,
      interests: randomInterests,
      photos: [`https://source.unsplash.com/random/400x500?portrait&sig=${i}`],
      location: cities[randomLocationIndex],
      preferences: {
        ageRange: [randomAge - 5, randomAge + 5],
        distance: Math.floor(Math.random() * 50) + 10, // 10-60km
      },
      lastActive: new Date(Date.now() - Math.floor(Math.random() * 86400000)), // Last 24 hours
      isPremium: Math.random() > 0.7, // 30% premium users
    };
  });
};

// Default context value
const defaultContextValue: DatingContextType = {
  myProfile: null,
  potentialMatches: [],
  matches: [],
  isPremium: false,
  subscribeToPremium: async () => false,
  updateProfile: async () => {},
  likeProfile: async () => {},
  passProfile: async () => {},
  loadMoreProfiles: async () => {},
  upgradePromptVisible: false,
  showUpgradePrompt: () => {},
  hideUpgradePrompt: () => {},
  loading: false,
};

// Create context
const DatingContext = createContext<DatingContextType>(defaultContextValue);

// Provider component
export const DatingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [myProfile, setMyProfile] = useState<DatingProfile | null>(null);
  const [potentialMatches, setPotentialMatches] = useState<DatingProfile[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [upgradePromptVisible, setUpgradePromptVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [likedProfiles, setLikedProfiles] = useState<Set<string>>(new Set());
  const [passedProfiles, setPassedProfiles] = useState<Set<string>>(new Set());
  
  // Initial setup - load data from IndexedDB
  useEffect(() => {
    const loadDatingData = async () => {
      try {
        // Load profile
        const savedProfile = await localforage.getItem<DatingProfile>('datingProfile');
        if (savedProfile) {
          setMyProfile(savedProfile);
          setIsPremium(savedProfile.isPremium);
        } else {
          // Create default profile if none exists
          const defaultProfile: DatingProfile = {
            id: `user-${Math.random().toString(36).substring(2, 9)}`,
            username: "NewUser",
            age: 25,
            bio: "Hello! I'm new here.",
            interests: ["Music", "Travel", "Technology"],
            photos: [],
            preferences: {
              ageRange: [20, 35],
            },
            lastActive: new Date(),
            isPremium: false,
          };
          setMyProfile(defaultProfile);
          await localforage.setItem('datingProfile', defaultProfile);
        }
        
        // Load matches
        const savedMatches = await localforage.getItem<Match[]>('datingMatches');
        if (savedMatches) {
          setMatches(savedMatches);
        }
        
        // Load liked/passed profiles
        const liked = await localforage.getItem<string[]>('likedProfiles');
        const passed = await localforage.getItem<string[]>('passedProfiles');
        
        if (liked) setLikedProfiles(new Set(liked));
        if (passed) setPassedProfiles(new Set(passed));
        
        // Generate sample profiles for potential matches
        const sampleProfiles = createSampleProfiles();
        setPotentialMatches(sampleProfiles);
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to load dating data:', err);
        setLoading(false);
      }
    };
    
    loadDatingData();
  }, []);
  
  // Subscribe to premium
  const subscribeToPremium = useCallback(async (): Promise<boolean> => {
    // In a real app, this would process a payment
    // For demo, just set premium status to true
    
    if (myProfile) {
      const premiumUntil = new Date();
      premiumUntil.setMonth(premiumUntil.getMonth() + 1);
      
      const updatedProfile = {
        ...myProfile,
        isPremium: true,
        premiumUntil
      };
      
      setMyProfile(updatedProfile);
      setIsPremium(true);
      await localforage.setItem('datingProfile', updatedProfile);
      return true;
    }
    
    return false;
  }, [myProfile]);
  
  // Update profile
  const updateProfile = useCallback(async (profileUpdates: Partial<DatingProfile>) => {
    if (myProfile) {
      const updatedProfile = { ...myProfile, ...profileUpdates };
      setMyProfile(updatedProfile);
      await localforage.setItem('datingProfile', updatedProfile);
    }
  }, [myProfile]);
  
  // Like a profile
  const likeProfile = useCallback(async (profileId: string) => {
    // Add to liked profiles
    const newLiked = new Set(likedProfiles);
    newLiked.add(profileId);
    setLikedProfiles(newLiked);
    await localforage.setItem('likedProfiles', Array.from(newLiked));
    
    // Check if it's a match (30% chance for demo purposes)
    if (Math.random() < 0.3) {
      const matchedProfile = potentialMatches.find(p => p.id === profileId);
      if (matchedProfile && myProfile) {
        const newMatch: Match = {
          id: `match-${Math.random().toString(36).substring(2, 9)}`,
          profileId: myProfile.id,
          matchedWith: profileId,
          status: 'accepted',
          createdAt: new Date(),
          messages: [],
        };
        
        const updatedMatches = [...matches, newMatch];
        setMatches(updatedMatches);
        await localforage.setItem('datingMatches', updatedMatches);
      }
    }
    
    // Filter out the liked profile from potential matches
    setPotentialMatches(potentialMatches.filter(p => p.id !== profileId));
    
    // If not premium and this is the 3rd like, show upgrade prompt
    if (!isPremium && Array.from(newLiked).length % 3 === 0) {
      setUpgradePromptVisible(true);
    }
  }, [myProfile, potentialMatches, matches, likedProfiles, isPremium]);
  
  // Pass on a profile
  const passProfile = useCallback(async (profileId: string) => {
    // Add to passed profiles
    const newPassed = new Set(passedProfiles);
    newPassed.add(profileId);
    setPassedProfiles(newPassed);
    await localforage.setItem('passedProfiles', Array.from(newPassed));
    
    // Filter out the passed profile from potential matches
    setPotentialMatches(potentialMatches.filter(p => p.id !== profileId));
  }, [potentialMatches, passedProfiles]);
  
  // Load more profiles
  const loadMoreProfiles = useCallback(async () => {
    setLoading(true);
    
    // In a real app, this would fetch from a peer discovery system
    // For demo, generate more sample profiles
    setTimeout(() => {
      const newProfiles = createSampleProfiles()
        // Filter out already liked or passed profiles
        .filter(p => !likedProfiles.has(p.id) && !passedProfiles.has(p.id));
      
      setPotentialMatches(prev => [...prev, ...newProfiles]);
      setLoading(false);
    }, 1000);
  }, [likedProfiles, passedProfiles]);
  
  // Prompt control
  const showUpgradePrompt = useCallback(() => {
    setUpgradePromptVisible(true);
  }, []);
  
  const hideUpgradePrompt = useCallback(() => {
    setUpgradePromptVisible(false);
  }, []);
  
  // Context value
  const contextValue: DatingContextType = {
    myProfile,
    potentialMatches,
    matches,
    isPremium,
    subscribeToPremium,
    updateProfile,
    likeProfile,
    passProfile,
    loadMoreProfiles,
    upgradePromptVisible,
    showUpgradePrompt,
    hideUpgradePrompt,
    loading,
  };
  
  return (
    <DatingContext.Provider value={contextValue}>
      {children}
    </DatingContext.Provider>
  );
};

// Hook for using the dating context
export const useDating = () => useContext(DatingContext);

export default DatingContext;
