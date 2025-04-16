
// This is a simplified P2P discovery service that simulates libp2p functionality
// In a real app, this would use actual libp2p for peer discovery and DHT

// Types
type Peer = {
  id: string;
  publicKey: string;
  multiaddr?: string[];
  lastSeen: Date;
  metadata?: Record<string, any>;
};

// Simulated peer database
let discoveredPeers: Peer[] = [];

// Initialize the discovery service
export const initDiscovery = async (): Promise<boolean> => {
  console.log('[Discovery] Initializing P2P discovery service');
  
  // In a real app, this would set up libp2p with DHT and other discovery mechanisms
  // For demo, initialize with some mock peers
  discoveredPeers = Array.from({ length: 10 }, (_, i) => ({
    id: `peer-${i + 1}`,
    publicKey: `pk-${Math.random().toString(36).substring(2, 15)}`,
    multiaddr: [`/ip4/192.168.1.${i + 1}/tcp/8000`, `/ip4/127.0.0.1/tcp/${8000 + i}`],
    lastSeen: new Date(Date.now() - Math.floor(Math.random() * 3600000)), // Last hour
    metadata: {
      name: `User ${i + 1}`,
      avatar: i % 3 === 0 ? `https://source.unsplash.com/random/100x100?portrait&sig=${i}` : undefined,
    },
  }));
  
  return true;
};

// Announce ourselves to the network
export const announcePresence = async (peerId: string, metadata?: Record<string, any>): Promise<void> => {
  console.log(`[Discovery] Announcing presence with ID: ${peerId}`);
  
  // In a real app, this would publish our peer info to the DHT or other discovery mechanism
  // For demo, just log the action
  setTimeout(() => {
    console.log('[Discovery] Successfully announced presence to network');
  }, 500);
};

// Find peers by criteria
export const findPeers = async (criteria?: {
  interests?: string[];
  maxResults?: number;
  excludeIds?: string[];
}): Promise<Peer[]> => {
  console.log('[Discovery] Searching for peers', criteria);
  
  // In a real app, this would query the DHT or other discovery mechanism
  // For demo, filter the mock peers
  const filtered = discoveredPeers.filter(peer => {
    if (criteria?.excludeIds?.includes(peer.id)) {
      return false;
    }
    
    if (criteria?.interests && criteria.interests.length > 0) {
      // Check if peer has matching interests in metadata
      const peerInterests = peer.metadata?.interests || [];
      return criteria.interests.some(interest => peerInterests.includes(interest));
    }
    
    return true;
  });
  
  // Apply max results limit if specified
  const limited = criteria?.maxResults 
    ? filtered.slice(0, criteria.maxResults) 
    : filtered;
  
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(limited);
    }, 800);
  });
};

// Generate a QR code for peer invitation (returns a mock URL for demo)
export const generateInviteQR = (peerId: string): string => {
  // In a real app, this would generate a proper QR code with connection info
  // For demo, return a mock URL
  const inviteCode = btoa(`invite:${peerId}:${Date.now()}`);
  return `https://zapp.app/invite/${inviteCode}`;
};

// Parse an invitation from a QR code or deep link
export const parseInviteCode = (inviteCode: string): { peerId: string; timestamp: number } | null => {
  try {
    const decoded = atob(inviteCode.replace('https://zapp.app/invite/', ''));
    const [prefix, peerId, timestamp] = decoded.split(':');
    
    if (prefix !== 'invite') {
      return null;
    }
    
    return {
      peerId,
      timestamp: parseInt(timestamp, 10),
    };
  } catch (error) {
    console.error('Failed to parse invite code:', error);
    return null;
  }
};

// Subscribe to peer presence updates
export const subscribeToPeerUpdates = (
  callback: (update: { peer: Peer; action: 'discovered' | 'updated' | 'lost' }) => void
): () => void => {
  console.log('[Discovery] Subscribing to peer updates');
  
  // In a real app, this would set up a subscription to DHT or other discovery events
  // For demo, set up a timer to simulate peer updates
  const intervalId = setInterval(() => {
    const randomAction = Math.random();
    let action: 'discovered' | 'updated' | 'lost';
    let peer: Peer;
    
    if (randomAction < 0.2) {
      // Discover a new peer
      action = 'discovered';
      peer = {
        id: `peer-${Math.floor(Math.random() * 100) + 20}`,
        publicKey: `pk-${Math.random().toString(36).substring(2, 15)}`,
        multiaddr: [`/ip4/192.168.1.${Math.floor(Math.random() * 255)}/tcp/8000`],
        lastSeen: new Date(),
        metadata: {
          name: `New User ${Math.floor(Math.random() * 100)}`,
        },
      };
      discoveredPeers.push(peer);
    } else if (randomAction < 0.6) {
      // Update an existing peer
      action = 'updated';
      const existingPeerIndex = Math.floor(Math.random() * discoveredPeers.length);
      peer = {
        ...discoveredPeers[existingPeerIndex],
        lastSeen: new Date(),
      };
      discoveredPeers[existingPeerIndex] = peer;
    } else {
      // Lose a peer
      action = 'lost';
      const peerToRemoveIndex = Math.floor(Math.random() * discoveredPeers.length);
      peer = discoveredPeers[peerToRemoveIndex];
      discoveredPeers = discoveredPeers.filter((_, i) => i !== peerToRemoveIndex);
    }
    
    callback({ peer, action });
  }, 10000); // Every 10 seconds
  
  // Return an unsubscribe function
  return () => {
    clearInterval(intervalId);
    console.log('[Discovery] Unsubscribed from peer updates');
  };
};

// Get a peer by ID
export const getPeerById = async (peerId: string): Promise<Peer | null> => {
  const peer = discoveredPeers.find(p => p.id === peerId);
  return peer || null;
};

// Create a DHT record for dating preferences (for discovery in dating feature)
export const publishDatingPreferences = async (
  peerId: string,
  preferences: Record<string, any>
): Promise<boolean> => {
  console.log(`[Discovery] Publishing dating preferences for: ${peerId}`);
  
  // In a real app, this would publish to the DHT
  // For demo, just update our mock peer data
  const peerIndex = discoveredPeers.findIndex(p => p.id === peerId);
  if (peerIndex >= 0) {
    discoveredPeers[peerIndex] = {
      ...discoveredPeers[peerIndex],
      metadata: {
        ...discoveredPeers[peerIndex].metadata,
        datingPreferences: preferences,
      },
    };
    return true;
  }
  
  return false;
};
