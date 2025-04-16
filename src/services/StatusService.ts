
import { getItem, setItem, getAllItems, removeItem } from './DatabaseService';

export type StatusView = {
  userId: string;
  timestamp: Date;
};

export type Status = {
  id: string;
  userId: string;
  content: string;
  caption?: string;
  timestamp: Date;
  expires: Date;
  views: StatusView[];
  type: 'image' | 'text' | 'video';
};

// Save a status to the database
export const saveStatus = async (statusId: string, status: Status): Promise<Status> => {
  return setItem('status', statusId, status);
};

// Get a status from the database
export const getStatus = async (statusId: string): Promise<Status | null> => {
  return getItem<Status>('status', statusId);
};

// Get all statuses from the database
export const getAllStatuses = async (): Promise<Status[]> => {
  try {
    // Create a new store if it doesn't exist yet
    const store = await getItem<any>('status', 'initialized');
    if (!store) {
      await setItem('status', 'initialized', true);
      
      // Add sample statuses for demo
      const sampleStatuses = [
        {
          id: 'status-1',
          userId: 'user-1',
          content: 'https://source.unsplash.com/random/800x600?nature&sig=1',
          caption: 'Beautiful day!',
          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
          expires: new Date(Date.now() + 86400000), // 24 hours from now
          views: [],
          type: 'image'
        },
        {
          id: 'status-2',
          userId: 'user-2',
          content: 'https://source.unsplash.com/random/800x600?city&sig=2',
          caption: 'City lights',
          timestamp: new Date(Date.now() - 7200000), // 2 hours ago
          expires: new Date(Date.now() + 86400000), // 24 hours from now
          views: [],
          type: 'image'
        }
      ];
      
      for (const status of sampleStatuses) {
        await saveStatus(status.id, status as Status);
      }
    }
    
    const allItems = await getAllItems<Status>('status');
    
    // Filter out expired statuses and the initialized flag
    const validStatuses = allItems
      .filter(status => status.id !== 'initialized' && new Date(status.expires) > new Date())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return validStatuses;
  } catch (error) {
    console.error('Failed to get all statuses:', error);
    return [];
  }
};

// Remove a status from the database
export const removeStatus = async (statusId: string): Promise<void> => {
  return removeItem('status', statusId);
};

// Remove expired statuses (should be called periodically)
export const cleanupExpiredStatuses = async (): Promise<number> => {
  const allStatuses = await getAllStatuses();
  let removedCount = 0;
  
  const now = new Date();
  
  for (const status of allStatuses) {
    if (new Date(status.expires) < now) {
      await removeStatus(status.id);
      removedCount++;
    }
  }
  
  console.log(`[Status] Cleaned up ${removedCount} expired statuses`);
  return removedCount;
};
