
import { getItem, setItem, getAllItems, removeItem } from './DatabaseService';

export type Contact = {
  id: string;
  peerId: string;
  name: string;
  avatar?: string;
  dateAdded: Date;
  status?: 'online' | 'offline' | 'busy';
  lastSeen?: Date;
};

// Save a contact to the database
export const saveContact = async (contactId: string, contact: Contact): Promise<Contact> => {
  return setItem('profiles', contactId, contact);
};

// Get a contact from the database
export const getContact = async (contactId: string): Promise<Contact | null> => {
  return getItem<Contact>('profiles', contactId);
};

// Get all contacts from the database
export const getAllContacts = async (): Promise<Contact[]> => {
  const allProfiles = await getAllItems<any>('profiles');
  return allProfiles.filter(profile => 'peerId' in profile) as Contact[];
};

// Remove a contact from the database
export const removeContact = async (contactId: string): Promise<void> => {
  return removeItem('profiles', contactId);
};

// Generate a random peer ID (for testing/demo purposes)
export const generateRandomPeerId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};
