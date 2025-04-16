
import { getItem, setItem, getAllItems, removeItem } from './DatabaseService';

export type Match = {
  id: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  photos: string[];
  interests: string[];
  compatibilityScore: number;
  lastActive: string;
  liked?: boolean;
  hasLikedYou?: boolean;
  matchedOn?: string;
  isPremium?: boolean;
};

// Save a match to the database
export const saveMatch = async (matchId: string, match: Match): Promise<Match> => {
  return setItem('dating', matchId, match);
};

// Get a match from the database
export const getMatch = async (matchId: string): Promise<Match | null> => {
  return getItem<Match>('dating', matchId);
};

// Update a match in the database
export const updateMatch = async (matchId: string, match: Match): Promise<Match> => {
  return setItem('dating', matchId, match);
};

// Get all matches from the database
export const getAllMatches = async (): Promise<Match[]> => {
  try {
    // Create a new store if it doesn't exist yet
    const store = await getItem<any>('dating', 'initialized');
    if (!store) {
      await setItem('dating', 'initialized', true);
      
      // Add sample matches for demo
      const sampleMatches = [
        {
          id: 'match-1',
          name: 'Priya',
          age: 26,
          location: 'Mumbai, 5km away',
          bio: 'Creative soul who loves art, music, and exploring new cafes. Looking for someone to share adventures with.',
          photos: [
            'https://source.unsplash.com/random/600x800?portrait=1',
            'https://source.unsplash.com/random/600x800?portrait=2'
          ],
          interests: ['Art', 'Music', 'Traveling', 'Photography', 'Yoga'],
          compatibilityScore: 87,
          lastActive: '2 hours ago',
          hasLikedYou: true,
          matchedOn: '2 days ago',
          isPremium: true
        },
        {
          id: 'match-2',
          name: 'Rahul',
          age: 28,
          location: 'Delhi, 8km away',
          bio: 'Tech enthusiast and startup founder. Love discussing innovative ideas over coffee. Avid hiker on weekends.',
          photos: [
            'https://source.unsplash.com/random/600x800?man=1',
            'https://source.unsplash.com/random/600x800?man=2'
          ],
          interests: ['Technology', 'Startups', 'Hiking', 'Coffee', 'Reading'],
          compatibilityScore: 92,
          lastActive: '5 minutes ago',
          hasLikedYou: false
        },
        {
          id: 'match-3',
          name: 'Neha',
          age: 24,
          location: 'Bangalore, 12km away',
          bio: 'Medical student with a passion for dance. Looking for someone who can make me laugh and introduces me to new experiences.',
          photos: [
            'https://source.unsplash.com/random/600x800?woman=1',
            'https://source.unsplash.com/random/600x800?woman=2'
          ],
          interests: ['Dancing', 'Medicine', 'Movies', 'Cooking', 'Fitness'],
          compatibilityScore: 78,
          lastActive: '1 day ago',
          hasLikedYou: true,
          matchedOn: '5 days ago'
        },
        {
          id: 'match-4',
          name: 'Aryan',
          age: 30,
          location: 'Chennai, 3km away',
          bio: 'Architect by profession, musician by passion. Love everything about design and creating beautiful things.',
          photos: [
            'https://source.unsplash.com/random/600x800?man=3',
            'https://source.unsplash.com/random/600x800?man=4'
          ],
          interests: ['Architecture', 'Music', 'Design', 'Travel', 'Photography'],
          compatibilityScore: 85,
          lastActive: '3 hours ago',
          hasLikedYou: false
        },
        {
          id: 'match-5',
          name: 'Ananya',
          age: 25,
          location: 'Hyderabad, 15km away',
          bio: 'Marketing professional who loves exploring new cuisines. Passionate about sustainable living and environmental activism.',
          photos: [
            'https://source.unsplash.com/random/600x800?woman=3',
            'https://source.unsplash.com/random/600x800?woman=4'
          ],
          interests: ['Food', 'Environmental Activism', 'Marketing', 'Sustainable Living', 'Travel'],
          compatibilityScore: 90,
          lastActive: '30 minutes ago',
          hasLikedYou: true,
          matchedOn: '1 week ago',
          isPremium: true
        }
      ];
      
      for (const match of sampleMatches) {
        await saveMatch(match.id, match as Match);
      }
      
      // Create a default profile for the current user
      const defaultProfile = {
        name: 'Me',
        age: 27,
        location: 'Mumbai',
        bio: 'Tech enthusiast and travel lover',
        photos: ['https://source.unsplash.com/random/600x800?profile'],
        interests: ['Technology', 'Travel', 'Music', 'Food', 'Movies'],
        isPremium: false
      };
      
      localStorage.setItem('datingProfile', JSON.stringify(defaultProfile));
    }
    
    const allItems = await getAllItems<Match>('dating');
    
    // Filter out the initialized flag
    const validMatches = allItems.filter(match => match.id !== 'initialized');
    
    return validMatches;
  } catch (error) {
    console.error('Failed to get all matches:', error);
    return [];
  }
};

// Remove a match from the database
export const removeMatch = async (matchId: string): Promise<void> => {
  return removeItem('dating', matchId);
};

// Update user's dating profile
export const updateDatingProfile = async (profile: any): Promise<void> => {
  try {
    localStorage.setItem('datingProfile', JSON.stringify(profile));
  } catch (error) {
    console.error('Failed to update dating profile:', error);
    throw error;
  }
};

// Get user's dating profile
export const getDatingProfile = async (): Promise<any> => {
  try {
    const profile = localStorage.getItem('datingProfile');
    return profile ? JSON.parse(profile) : null;
  } catch (error) {
    console.error('Failed to get dating profile:', error);
    return null;
  }
};

// Update premium status
export const updatePremiumStatus = async (isPremium: boolean): Promise<void> => {
  try {
    const profile = await getDatingProfile();
    if (profile) {
      profile.isPremium = isPremium;
      await updateDatingProfile(profile);
    }
  } catch (error) {
    console.error('Failed to update premium status:', error);
    throw error;
  }
};
