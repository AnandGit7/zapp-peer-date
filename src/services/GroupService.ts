
import { getItem, setItem, getAllItems, removeItem } from './DatabaseService';

export type GroupMember = {
  id: string;
  name: string;
  avatar?: string;
  peerId: string;
  role: 'admin' | 'member';
};

export type Group = {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  members: GroupMember[];
};

// Save a group to the database
export const saveGroup = async (groupId: string, group: Group): Promise<Group> => {
  return setItem('groups', groupId, group);
};

// Get a group from the database
export const getGroup = async (groupId: string): Promise<Group | null> => {
  return getItem<Group>('groups', groupId);
};

// Get all groups from the database
export const getAllGroups = async (): Promise<Group[]> => {
  try {
    // Create a new store if it doesn't exist yet
    const store = await getItem<any>('groups', 'initialized');
    if (!store) {
      await setItem('groups', 'initialized', true);
      
      // Add sample groups for demo
      const sampleGroups = [
        {
          id: 'group-1',
          name: 'Friends Group',
          description: 'A group for close friends',
          avatar: 'https://source.unsplash.com/random/100x100?group&sig=1',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          members: [
            {
              id: 'current-user',
              name: 'You',
              peerId: 'local-peer-id',
              role: 'admin'
            },
            {
              id: 'contact-1',
              name: 'Rahul Kumar',
              avatar: 'https://source.unsplash.com/random/100x100?portrait&sig=2',
              peerId: 'peer-2',
              role: 'member'
            },
            {
              id: 'contact-2',
              name: 'Priya Sharma',
              avatar: 'https://source.unsplash.com/random/100x100?portrait&sig=1',
              peerId: 'peer-1',
              role: 'member'
            }
          ]
        },
        {
          id: 'group-2',
          name: 'Tech Discussions',
          description: 'P2P Technologies and Decentralized Apps',
          avatar: 'https://source.unsplash.com/random/100x100?technology&sig=2',
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          members: [
            {
              id: 'current-user',
              name: 'You',
              peerId: 'local-peer-id',
              role: 'member'
            },
            {
              id: 'contact-3',
              name: 'Neha Patel',
              peerId: 'peer-3',
              role: 'admin'
            },
            {
              id: 'contact-4',
              name: 'Arjun Singh',
              avatar: 'https://source.unsplash.com/random/100x100?portrait&sig=4',
              peerId: 'peer-4',
              role: 'member'
            },
            {
              id: 'contact-5',
              name: 'Sneha Gupta',
              avatar: 'https://source.unsplash.com/random/100x100?portrait&sig=5',
              peerId: 'peer-5',
              role: 'member'
            }
          ]
        }
      ];
      
      for (const group of sampleGroups) {
        await saveGroup(group.id, group as Group);
      }
    }
    
    const allItems = await getAllItems<Group>('groups');
    
    // Filter out the initialized flag
    const validGroups = allItems
      .filter(group => group.id !== 'initialized')
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    
    return validGroups;
  } catch (error) {
    console.error('Failed to get all groups:', error);
    return [];
  }
};

// Remove a group from the database
export const removeGroup = async (groupId: string): Promise<void> => {
  return removeItem('groups', groupId);
};

// Add member to a group
export const addMemberToGroup = async (groupId: string, member: GroupMember): Promise<Group | null> => {
  const group = await getGroup(groupId);
  
  if (!group) {
    return null;
  }
  
  // Check if member already exists
  if (group.members.some(m => m.id === member.id)) {
    return group;
  }
  
  const updatedGroup = {
    ...group,
    members: [...group.members, member],
    updatedAt: new Date()
  };
  
  return saveGroup(groupId, updatedGroup);
};

// Remove member from a group
export const removeMemberFromGroup = async (groupId: string, memberId: string): Promise<Group | null> => {
  const group = await getGroup(groupId);
  
  if (!group) {
    return null;
  }
  
  const updatedGroup = {
    ...group,
    members: group.members.filter(m => m.id !== memberId),
    updatedAt: new Date()
  };
  
  return saveGroup(groupId, updatedGroup);
};

// Update member role in a group
export const updateMemberRole = async (
  groupId: string,
  memberId: string,
  role: 'admin' | 'member'
): Promise<Group | null> => {
  const group = await getGroup(groupId);
  
  if (!group) {
    return null;
  }
  
  const updatedGroup = {
    ...group,
    members: group.members.map(m => 
      m.id === memberId ? { ...m, role } : m
    ),
    updatedAt: new Date()
  };
  
  return saveGroup(groupId, updatedGroup);
};
