
import localforage from 'localforage';

// Initialize our IndexedDB stores
export const initDatabase = async (): Promise<void> => {
  // Configure main database
  localforage.config({
    name: 'zapp',
    storeName: 'zapp_main',
    description: 'Zapp P2P Social Media App Database',
  });
  
  // Initialize different stores for different data types
  await Promise.all([
    localforage.createInstance({
      name: 'zapp',
      storeName: 'messages',
      description: 'Messages storage',
    }),
    localforage.createInstance({
      name: 'zapp',
      storeName: 'profiles',
      description: 'User profiles storage',
    }),
    localforage.createInstance({
      name: 'zapp',
      storeName: 'media',
      description: 'Media files storage',
    }),
    localforage.createInstance({
      name: 'zapp',
      storeName: 'preferences',
      description: 'User preferences storage',
    }),
    localforage.createInstance({
      name: 'zapp',
      storeName: 'dating',
      description: 'Dating feature storage',
    }),
  ]);
  
  console.log('[Database] Initialized IndexedDB storage');
};

// Get a specific store instance
export const getStore = (storeName: 'messages' | 'profiles' | 'media' | 'preferences' | 'dating') => {
  return localforage.createInstance({
    name: 'zapp',
    storeName,
  });
};

// Generic CRUD operations for any store

// Create or update an item
export const setItem = async <T>(
  storeName: 'messages' | 'profiles' | 'media' | 'preferences' | 'dating',
  key: string,
  value: T
): Promise<T> => {
  const store = getStore(storeName);
  await store.setItem(key, value);
  return value;
};

// Get an item
export const getItem = async <T>(
  storeName: 'messages' | 'profiles' | 'media' | 'preferences' | 'dating',
  key: string
): Promise<T | null> => {
  const store = getStore(storeName);
  return store.getItem<T>(key);
};

// Remove an item
export const removeItem = async (
  storeName: 'messages' | 'profiles' | 'media' | 'preferences' | 'dating',
  key: string
): Promise<void> => {
  const store = getStore(storeName);
  return store.removeItem(key);
};

// Get all keys in a store
export const getKeys = async (
  storeName: 'messages' | 'profiles' | 'media' | 'preferences' | 'dating'
): Promise<string[]> => {
  const store = getStore(storeName);
  return store.keys();
};

// Get all items in a store
export const getAllItems = async <T>(
  storeName: 'messages' | 'profiles' | 'media' | 'preferences' | 'dating'
): Promise<T[]> => {
  const store = getStore(storeName);
  const keys = await store.keys();
  const items: T[] = [];
  
  for (const key of keys) {
    const item = await store.getItem<T>(key);
    if (item) {
      items.push(item);
    }
  }
  
  return items;
};

// Clear a specific store
export const clearStore = async (
  storeName: 'messages' | 'profiles' | 'media' | 'preferences' | 'dating'
): Promise<void> => {
  const store = getStore(storeName);
  return store.clear();
};

// Check storage usage statistics
export const getStorageStats = async (): Promise<{ 
  estimatedSize: number; 
  quota: number;
  usage: number;
}> => {
  if (navigator.storage && navigator.storage.estimate) {
    const estimate = await navigator.storage.estimate();
    return {
      estimatedSize: estimate.usage || 0,
      quota: estimate.quota || 0,
      usage: estimate.quota ? (estimate.usage || 0) / estimate.quota : 0,
    };
  }
  
  return {
    estimatedSize: 0,
    quota: 0,
    usage: 0,
  };
};

// Specialized methods for common data types

// Save a message
export const saveMessage = async <T>(messageId: string, message: T): Promise<T> => {
  return setItem('messages', messageId, message);
};

// Get messages for a specific conversation
export const getConversationMessages = async <T>(
  conversationId: string,
  limit: number = 50,
  offset: number = 0
): Promise<T[]> => {
  // This is a simplified implementation
  // In a real app, we'd have a more sophisticated query system
  
  const allMessages = await getAllItems<any>('messages');
  
  // Filter messages for this conversation and sort by timestamp
  const conversationMessages = allMessages
    .filter(msg => msg.conversationId === conversationId)
    .sort((a, b) => {
      // Sort by timestamp, newest first
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    })
    .slice(offset, offset + limit);
  
  return conversationMessages as T[];
};

// Save user profile
export const saveProfile = async <T>(profileId: string, profile: T): Promise<T> => {
  return setItem('profiles', profileId, profile);
};

// Save media with explicit expiration (for temporary storage)
export const saveMediaWithExpiration = async <T>(
  mediaId: string, 
  media: T, 
  expiresInSeconds: number = 60 * 60 * 24 // Default 24 hours
): Promise<T> => {
  const mediaWithExpiry = {
    data: media,
    expiry: Date.now() + (expiresInSeconds * 1000),
  };
  
  await setItem('media', mediaId, mediaWithExpiry);
  return media;
};

// Get media checking for expiration
export const getMediaWithExpiration = async <T>(mediaId: string): Promise<T | null> => {
  const mediaEntry = await getItem<{ data: T; expiry: number }>('media', mediaId);
  
  if (!mediaEntry) {
    return null;
  }
  
  // Check if expired
  if (mediaEntry.expiry < Date.now()) {
    await removeItem('media', mediaId);
    return null;
  }
  
  return mediaEntry.data;
};

// Cleanup expired media (should be called periodically)
export const cleanupExpiredMedia = async (): Promise<number> => {
  const allMediaKeys = await getKeys('media');
  let removedCount = 0;
  
  for (const key of allMediaKeys) {
    const mediaEntry = await getItem<{ expiry: number }>('media', key);
    if (mediaEntry && mediaEntry.expiry < Date.now()) {
      await removeItem('media', key);
      removedCount++;
    }
  }
  
  console.log(`[Database] Cleaned up ${removedCount} expired media items`);
  return removedCount;
};
