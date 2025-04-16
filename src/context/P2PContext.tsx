
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import SimplePeer from 'simple-peer';
import localforage from 'localforage';

// Define types
type PeerConnection = {
  peerId: string;
  peer: SimplePeer.Instance;
  status: 'connecting' | 'connected' | 'disconnected';
  metadata?: {
    username?: string;
    avatar?: string;
    lastSeen?: Date;
  };
};

type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'file';
  metadata?: any;
};

type P2PContextType = {
  localPeerId: string | null;
  connections: PeerConnection[];
  messages: Message[];
  connectToPeer: (peerId: string) => Promise<void>;
  disconnectFromPeer: (peerId: string) => void;
  sendMessage: (receiverId: string, content: string, type?: 'text' | 'image' | 'file', metadata?: any) => Promise<Message | null>;
  isConnected: (peerId: string) => boolean;
  isConnecting: (peerId: string) => boolean;
  connectionStatus: 'online' | 'offline' | 'connecting';
};

// Default context value
const defaultContextValue: P2PContextType = {
  localPeerId: null,
  connections: [],
  messages: [],
  connectToPeer: async () => {},
  disconnectFromPeer: () => {},
  sendMessage: async () => null,
  isConnected: () => false,
  isConnecting: () => false,
  connectionStatus: 'offline',
};

// Create context
const P2PContext = createContext<P2PContextType>(defaultContextValue);

// Provider component
export const P2PProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [localPeerId, setLocalPeerId] = useState<string | null>(null);
  const [connections, setConnections] = useState<PeerConnection[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'connecting'>('offline');
  
  // Initialize on component mount
  useEffect(() => {
    // Generate a random peer ID (would be replaced with actual identity system)
    const generatedPeerId = Math.random().toString(36).substring(2, 15);
    setLocalPeerId(generatedPeerId);
    setConnectionStatus('online');
    
    // Load cached messages from IndexedDB
    const loadMessages = async () => {
      try {
        const cachedMessages = await localforage.getItem<Message[]>('messages');
        if (cachedMessages) {
          setMessages(cachedMessages);
        }
      } catch (err) {
        console.error('Failed to load cached messages:', err);
      }
    };
    
    loadMessages();
    
    // Cleanup function
    return () => {
      // Disconnect all peers when component unmounts
      connections.forEach(conn => {
        if (conn.peer) {
          conn.peer.destroy();
        }
      });
    };
  }, []);
  
  // Save messages to IndexedDB whenever they change
  useEffect(() => {
    localforage.setItem('messages', messages).catch(err => {
      console.error('Failed to cache messages:', err);
    });
  }, [messages]);
  
  // Connect to a peer
  const connectToPeer = useCallback(async (peerId: string) => {
    if (peerId === localPeerId) {
      throw new Error("Cannot connect to yourself");
    }
    
    // Check if already connected
    if (connections.some(conn => conn.peerId === peerId && conn.status === 'connected')) {
      return;
    }
    
    // Create new peer connection (in a real app, would use signaling server)
    try {
      // In this demo, we're simulating P2P connections
      // In a real app, this would use actual WebRTC with signaling
      const newPeer = new SimplePeer({
        initiator: true,
        trickle: false,
      });
      
      // Add to connections list as connecting
      setConnections(prev => [
        ...prev.filter(conn => conn.peerId !== peerId),
        { peerId, peer: newPeer, status: 'connecting' }
      ]);
      
      // Simulate successful connection after a delay
      setTimeout(() => {
        setConnections(prev => 
          prev.map(conn => 
            conn.peerId === peerId 
              ? { ...conn, status: 'connected' } 
              : conn
          )
        );
      }, 1500);
      
    } catch (err) {
      console.error('Failed to connect to peer:', err);
      // Update connection status to disconnected
      setConnections(prev => 
        prev.map(conn => 
          conn.peerId === peerId 
            ? { ...conn, status: 'disconnected' } 
            : conn
        )
      );
    }
  }, [localPeerId, connections]);
  
  // Disconnect from a peer
  const disconnectFromPeer = useCallback((peerId: string) => {
    const connection = connections.find(conn => conn.peerId === peerId);
    if (connection) {
      connection.peer.destroy();
      setConnections(prev => prev.filter(conn => conn.peerId !== peerId));
    }
  }, [connections]);
  
  // Send a message to a peer
  const sendMessage = useCallback(async (
    receiverId: string, 
    content: string, 
    type: 'text' | 'image' | 'file' = 'text',
    metadata?: any
  ): Promise<Message | null> => {
    if (!localPeerId) return null;
    
    // Check if connected to the receiver
    const connection = connections.find(conn => conn.peerId === receiverId);
    if (!connection || connection.status !== 'connected') {
      try {
        // Try to connect if not already connected
        await connectToPeer(receiverId);
      } catch (err) {
        console.error('Failed to connect before sending message:', err);
        return null;
      }
    }
    
    // Create new message
    const newMessage: Message = {
      id: Math.random().toString(36).substring(2, 15),
      senderId: localPeerId,
      receiverId,
      content,
      timestamp: new Date(),
      status: 'sent',
      type,
      metadata
    };
    
    // Add to messages list
    setMessages(prev => [...prev, newMessage]);
    
    // In a real app, would send through the WebRTC data channel
    // For now, we'll simulate successful delivery
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'delivered' } 
            : msg
        )
      );
    }, 1000);
    
    return newMessage;
  }, [localPeerId, connections, connectToPeer]);
  
  // Helper function to check if connected to a peer
  const isConnected = useCallback((peerId: string) => {
    return connections.some(conn => conn.peerId === peerId && conn.status === 'connected');
  }, [connections]);
  
  // Helper function to check if connecting to a peer
  const isConnecting = useCallback((peerId: string) => {
    return connections.some(conn => conn.peerId === peerId && conn.status === 'connecting');
  }, [connections]);
  
  // Context value
  const contextValue: P2PContextType = {
    localPeerId,
    connections,
    messages,
    connectToPeer,
    disconnectFromPeer,
    sendMessage,
    isConnected,
    isConnecting,
    connectionStatus,
  };
  
  return (
    <P2PContext.Provider value={contextValue}>
      {children}
    </P2PContext.Provider>
  );
};

// Hook for using the P2P context
export const useP2P = () => useContext(P2PContext);

export default P2PContext;
