
import SimplePeer from "simple-peer";

// Types
export type Connection = {
  id: string;
  peer: SimplePeer.Instance;
  metadata?: any;
  status: 'new' | 'connecting' | 'connected' | 'disconnected' | 'error';
  error?: Error;
  stats?: RTCStatsReport;
};

// Connection event handlers type
export type ConnectionEventHandlers = {
  onConnect?: (connection: Connection) => void;
  onData?: (connection: Connection, data: any) => void;
  onStream?: (connection: Connection, stream: MediaStream) => void;
  onClose?: (connection: Connection) => void;
  onError?: (connection: Connection, error: Error) => void;
};

// Store active connections
const activeConnections = new Map<string, Connection>();

// Initialize a new peer connection as initiator
export const createConnection = (
  peerId: string,
  config?: RTCConfiguration,
  metadata?: any,
  handlers?: ConnectionEventHandlers
): Connection => {
  console.log(`[WebRTC] Creating connection to peer: ${peerId}`);
  
  // Create new peer connection
  const peer = new SimplePeer({
    initiator: true,
    trickle: true,
    config: config || {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:global.stun.twilio.com:3478' }
      ]
    }
  });
  
  // Create connection object
  const connection: Connection = {
    id: peerId,
    peer,
    metadata,
    status: 'new'
  };
  
  // Set up event listeners
  setupEventListeners(connection, handlers);
  
  // Store in active connections
  activeConnections.set(peerId, connection);
  
  return connection;
};

// Accept a connection as the receiver
export const acceptConnection = (
  peerId: string,
  signal: any,
  config?: RTCConfiguration,
  metadata?: any,
  handlers?: ConnectionEventHandlers
): Connection => {
  console.log(`[WebRTC] Accepting connection from peer: ${peerId}`);
  
  // Create new peer connection (not as initiator)
  const peer = new SimplePeer({
    initiator: false,
    trickle: true,
    config: config || {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:global.stun.twilio.com:3478' }
      ]
    }
  });
  
  // Create connection object
  const connection: Connection = {
    id: peerId,
    peer,
    metadata,
    status: 'new'
  };
  
  // Set up event listeners
  setupEventListeners(connection, handlers);
  
  // Signal the peer
  peer.signal(signal);
  
  // Store in active connections
  activeConnections.set(peerId, connection);
  
  return connection;
};

// Set up event listeners for a connection
const setupEventListeners = (
  connection: Connection,
  handlers?: ConnectionEventHandlers
): void => {
  const { peer } = connection;
  
  // Connection established
  peer.on('connect', () => {
    console.log(`[WebRTC] Connected to peer: ${connection.id}`);
    connection.status = 'connected';
    
    // Start stats monitoring
    if (peer._pc) {
      monitorConnectionStats(connection);
    }
    
    // Call handler if provided
    if (handlers?.onConnect) {
      handlers.onConnect(connection);
    }
  });
  
  // Data received
  peer.on('data', (data) => {
    // Parse data if it's JSON
    let parsedData;
    try {
      parsedData = JSON.parse(data.toString());
    } catch {
      parsedData = data;
    }
    
    console.log(`[WebRTC] Received data from peer: ${connection.id}`);
    
    // Call handler if provided
    if (handlers?.onData) {
      handlers.onData(connection, parsedData);
    }
  });
  
  // Stream received
  peer.on('stream', (stream) => {
    console.log(`[WebRTC] Received stream from peer: ${connection.id}`);
    
    // Call handler if provided
    if (handlers?.onStream) {
      handlers.onStream(connection, stream);
    }
  });
  
  // Signal event (for ICE candidates and offers/answers)
  peer.on('signal', (signal) => {
    console.log(`[WebRTC] Signal from peer: ${connection.id}`);
    // This signal needs to be sent to the other peer via a signaling mechanism
    // In a P2P application, this could be through WebSocket, a mutual peer, etc.
    // Here we're just logging it; in a real app you'd send it through your signaling channel
  });
  
  // Error event
  peer.on('error', (err) => {
    console.error(`[WebRTC] Error with peer ${connection.id}:`, err);
    connection.status = 'error';
    connection.error = err;
    
    // Call handler if provided
    if (handlers?.onError) {
      handlers.onError(connection, err);
    }
  });
  
  // Close event
  peer.on('close', () => {
    console.log(`[WebRTC] Connection closed with peer: ${connection.id}`);
    connection.status = 'disconnected';
    
    // Remove from active connections
    activeConnections.delete(connection.id);
    
    // Call handler if provided
    if (handlers?.onClose) {
      handlers.onClose(connection);
    }
  });
};

// Send data to a peer
export const sendData = (peerId: string, data: any): boolean => {
  const connection = activeConnections.get(peerId);
  
  if (!connection || connection.status !== 'connected') {
    console.error(`[WebRTC] Cannot send data: No active connection to peer ${peerId}`);
    return false;
  }
  
  try {
    // Convert to string if it's an object
    const dataToSend = typeof data === 'object' ? JSON.stringify(data) : data;
    connection.peer.send(dataToSend);
    return true;
  } catch (error) {
    console.error(`[WebRTC] Error sending data to peer ${peerId}:`, error);
    return false;
  }
};

// Add a media stream to the connection
export const addStream = (peerId: string, stream: MediaStream): boolean => {
  const connection = activeConnections.get(peerId);
  
  if (!connection) {
    console.error(`[WebRTC] Cannot add stream: No connection to peer ${peerId}`);
    return false;
  }
  
  try {
    connection.peer.addStream(stream);
    return true;
  } catch (error) {
    console.error(`[WebRTC] Error adding stream to peer ${peerId}:`, error);
    return false;
  }
};

// Replace a track in the connection
export const replaceTrack = (
  peerId: string,
  oldTrack: MediaStreamTrack,
  newTrack: MediaStreamTrack
): boolean => {
  const connection = activeConnections.get(peerId);
  
  if (!connection || !connection.peer._pc) {
    console.error(`[WebRTC] Cannot replace track: No active connection to peer ${peerId}`);
    return false;
  }
  
  try {
    const senders = connection.peer._pc.getSenders();
    const sender = senders.find(s => s.track === oldTrack);
    
    if (!sender) {
      console.error(`[WebRTC] Cannot find sender for track to replace`);
      return false;
    }
    
    sender.replaceTrack(newTrack);
    return true;
  } catch (error) {
    console.error(`[WebRTC] Error replacing track for peer ${peerId}:`, error);
    return false;
  }
};

// Close a specific connection
export const closeConnection = (peerId: string): void => {
  const connection = activeConnections.get(peerId);
  
  if (connection) {
    console.log(`[WebRTC] Closing connection to peer: ${peerId}`);
    connection.peer.destroy();
    activeConnections.delete(peerId);
  }
};

// Close all connections
export const closeAllConnections = (): void => {
  console.log(`[WebRTC] Closing all connections (${activeConnections.size} total)`);
  
  activeConnections.forEach((connection) => {
    connection.peer.destroy();
  });
  
  activeConnections.clear();
};

// Get all active connections
export const getAllConnections = (): Connection[] => {
  return Array.from(activeConnections.values());
};

// Get a specific connection
export const getConnection = (peerId: string): Connection | undefined => {
  return activeConnections.get(peerId);
};

// Check if connected to a specific peer
export const isConnectedToPeer = (peerId: string): boolean => {
  const connection = activeConnections.get(peerId);
  return !!connection && connection.status === 'connected';
};

// Get connection statistics
const monitorConnectionStats = (connection: Connection): void => {
  if (!connection.peer._pc) return;
  
  const statsInterval = setInterval(async () => {
    if (connection.status !== 'connected' || !connection.peer._pc) {
      clearInterval(statsInterval);
      return;
    }
    
    try {
      const stats = await connection.peer._pc.getStats();
      connection.stats = stats;
      
      // Log bandwidth and other stats periodically (every 10 seconds)
      if (Math.random() < 0.1) {
        logConnectionStats(connection);
      }
    } catch (error) {
      console.error(`[WebRTC] Error getting stats for peer ${connection.id}:`, error);
    }
  }, 1000);
};

// Log connection statistics
const logConnectionStats = (connection: Connection): void => {
  if (!connection.stats) return;
  
  let inboundBytes = 0;
  let outboundBytes = 0;
  let bitrateInbound = 0;
  let bitrateOutbound = 0;
  
  connection.stats.forEach((stat) => {
    if (stat.type === 'inbound-rtp') {
      inboundBytes += stat.bytesReceived || 0;
      bitrateInbound += stat.bitrate || 0;
    } else if (stat.type === 'outbound-rtp') {
      outboundBytes += stat.bytesSent || 0;
      bitrateOutbound += stat.bitrate || 0;
    }
  });
  
  console.log(`[WebRTC] Connection stats for peer ${connection.id}:
    Inbound bytes: ${inboundBytes}
    Outbound bytes: ${outboundBytes}
    Inbound bitrate: ${bitrateInbound} bps
    Outbound bitrate: ${bitrateOutbound} bps
  `);
};

// Get local media stream with optimized settings for "Amazing Video Quality"
export const getOptimizedLocalStream = async (
  options: {
    video?: boolean | MediaTrackConstraints;
    audio?: boolean | MediaTrackConstraints;
  } = { video: true, audio: true }
): Promise<MediaStream | null> => {
  try {
    // Default high-quality video constraints
    const defaultVideoConstraints: MediaTrackConstraints = {
      width: { ideal: 1280 },
      height: { ideal: 720 },
      frameRate: { ideal: 30 },
    };
    
    // Default audio constraints with noise suppression
    const defaultAudioConstraints: MediaTrackConstraints = {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    };
    
    // Merge with provided options
    const videoConstraints = options.video === true ? 
      defaultVideoConstraints : 
      (options.video || false);
      
    const audioConstraints = options.audio === true ? 
      defaultAudioConstraints : 
      (options.audio || false);
    
    // Get user media with constraints
    const stream = await navigator.mediaDevices.getUserMedia({
      video: videoConstraints,
      audio: audioConstraints,
    });
    
    return stream;
  } catch (error) {
    console.error('[WebRTC] Error getting local media stream:', error);
    return null;
  }
};

// Apply bandwidth limitations to a connection for better performance
export const applyBandwidthConstraints = (
  peerId: string,
  constraints: {
    audio?: number; // kbps
    video?: number; // kbps
  }
): boolean => {
  const connection = activeConnections.get(peerId);
  
  if (!connection || !connection.peer._pc) {
    console.error(`[WebRTC] Cannot apply bandwidth constraints: No active connection to peer ${peerId}`);
    return false;
  }
  
  try {
    const senders = connection.peer._pc.getSenders();
    
    senders.forEach(sender => {
      if (!sender.track) return;
      
      const params = sender.getParameters();
      if (!params.encodings) {
        params.encodings = [{}];
      }
      
      // Apply bandwidth constraints based on track type
      if (sender.track.kind === 'audio' && constraints.audio) {
        params.encodings[0].maxBitrate = constraints.audio * 1000; // Convert to bps
      } else if (sender.track.kind === 'video' && constraints.video) {
        params.encodings[0].maxBitrate = constraints.video * 1000; // Convert to bps
      }
      
      // Set the parameters
      sender.setParameters(params);
    });
    
    return true;
  } catch (error) {
    console.error(`[WebRTC] Error applying bandwidth constraints to peer ${peerId}:`, error);
    return false;
  }
};
