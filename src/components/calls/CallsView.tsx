
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, PhoneOff, Video, VideoOff, UserPlus, CheckCircle, X, Mic, MicOff, Monitor } from 'lucide-react';
import { useP2P } from '@/context/P2PContext';
import { getAllContacts, Contact } from '@/services/ContactService';
import AddContactModal from '../contacts/AddContactModal';
import { toast } from "@/components/ui/use-toast";
import { getOptimizedLocalStream } from '@/services/WebRTCService';

type CallState = {
  isActive: boolean;
  isVideo: boolean;
  contact: Contact | null;
  isMuted: boolean;
  isScreenSharing: boolean;
};

const CallsView: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [callState, setCallState] = useState<CallState>({
    isActive: false,
    isVideo: false,
    contact: null,
    isMuted: false,
    isScreenSharing: false
  });
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const { connectToPeer, disconnectFromPeer, isConnected } = useP2P();
  
  // Load contacts
  useEffect(() => {
    const loadContacts = async () => {
      try {
        const contactsList = await getAllContacts();
        setContacts(contactsList);
      } catch (error) {
        console.error('Failed to load contacts:', error);
      }
    };
    
    loadContacts();
  }, []);
  
  const filteredContacts = contacts.filter(
    contact => contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleContactAdded = async () => {
    // Reload contacts when new contact is added
    try {
      const contactsList = await getAllContacts();
      setContacts(contactsList);
    } catch (error) {
      console.error('Failed to reload contacts:', error);
    }
  };
  
  const startCall = async (contact: Contact, isVideo: boolean) => {
    try {
      // Request media permissions
      const stream = await getOptimizedLocalStream({
        video: isVideo,
        audio: true
      });
      
      if (!stream) {
        toast({
          title: "Permission Denied",
          description: "Please allow access to your camera and microphone to make calls.",
          variant: "destructive"
        });
        return;
      }
      
      setLocalStream(stream);
      
      // Connect to peer
      await connectToPeer(contact.peerId);
      
      // Update call state
      setCallState({
        isActive: true,
        isVideo,
        contact,
        isMuted: false,
        isScreenSharing: false
      });
      
      toast({
        title: `${isVideo ? 'Video' : 'Audio'} call started`,
        description: `Connected with ${contact.name}`
      });
      
    } catch (error) {
      console.error('Failed to start call:', error);
      toast({
        title: "Call Failed",
        description: "Could not establish connection with peer.",
        variant: "destructive"
      });
    }
  };
  
  const endCall = () => {
    if (callState.contact) {
      disconnectFromPeer(callState.contact.peerId);
      
      // Stop all media tracks
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        setLocalStream(null);
      }
      
      // Reset call state
      setCallState({
        isActive: false,
        isVideo: false,
        contact: null,
        isMuted: false,
        isScreenSharing: false
      });
      
      toast({
        title: "Call Ended",
        description: "The call has been disconnected."
      });
    }
  };
  
  const toggleMute = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      
      setCallState({
        ...callState,
        isMuted: !callState.isMuted
      });
    }
  };
  
  const toggleScreenShare = async () => {
    if (!callState.isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        });
        
        // Replace video track with screen share track
        if (localStream) {
          const videoTrack = localStream.getVideoTracks()[0];
          if (videoTrack) {
            localStream.removeTrack(videoTrack);
          }
          
          const screenTrack = screenStream.getVideoTracks()[0];
          localStream.addTrack(screenTrack);
          
          setCallState({
            ...callState,
            isScreenSharing: true
          });
        }
      } catch (error) {
        console.error('Failed to share screen:', error);
        toast({
          title: "Screen Sharing Failed",
          description: "Could not access your screen.",
          variant: "destructive"
        });
      }
    } else {
      // Stop screen sharing and revert to camera
      try {
        // Remove screen share track
        const screenTrack = localStream?.getVideoTracks()[0];
        if (screenTrack) {
          screenTrack.stop();
          localStream?.removeTrack(screenTrack);
        }
        
        // Add back camera track
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
        const cameraTrack = cameraStream.getVideoTracks()[0];
        localStream?.addTrack(cameraTrack);
        
        setCallState({
          ...callState,
          isScreenSharing: false
        });
      } catch (error) {
        console.error('Failed to revert to camera:', error);
      }
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {callState.isActive ? (
        <div className="flex flex-col h-full">
          {/* Active Call UI */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-2">
                <AvatarImage src={callState.contact?.avatar} alt={callState.contact?.name} />
                <AvatarFallback>{callState.contact?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{callState.contact?.name}</h3>
                <p className="text-sm text-green-500 flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-1 animate-pulse"></span>
                  {callState.isVideo ? 'Video call' : 'Voice call'} active
                </p>
              </div>
            </div>
            <Button variant="destructive" size="sm" onClick={endCall}>
              <PhoneOff className="h-4 w-4 mr-1" />
              End
            </Button>
          </div>
          
          {/* Video container */}
          <div className="flex-1 bg-slate-900 flex items-center justify-center relative">
            {callState.isVideo && (
              <div className="w-full h-full flex items-center justify-center">
                {/* Simulated video view */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute right-4 bottom-4 w-32 h-24 bg-slate-800 rounded-lg overflow-hidden border-2 border-primary"></div>
                </div>
              </div>
            )}
            
            {!callState.isVideo && (
              <div className="text-center p-8">
                <Avatar className="h-32 w-32 mx-auto">
                  <AvatarImage src={callState.contact?.avatar} alt={callState.contact?.name} />
                  <AvatarFallback className="text-4xl">{callState.contact?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold mt-4 text-white">{callState.contact?.name}</h2>
                <p className="text-gray-400">Call in progress</p>
              </div>
            )}
          </div>
          
          {/* Call controls */}
          <div className="p-4 flex justify-center space-x-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-12 w-12 rounded-full"
              onClick={toggleMute}
            >
              {callState.isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            
            {callState.isVideo && (
              <Button 
                variant="outline" 
                size="icon" 
                className="h-12 w-12 rounded-full"
                onClick={toggleScreenShare}
              >
                <Monitor className="h-5 w-5" />
              </Button>
            )}
            
            <Button 
              variant="destructive" 
              size="icon" 
              className="h-12 w-12 rounded-full"
              onClick={endCall}
            >
              <PhoneOff className="h-5 w-5" />
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Calls List UI */}
          <div className="p-4">
            <div className="relative">
              <Input
                placeholder="Search contacts..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
          </div>
          
          <div className="px-4 py-2 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Contacts</h2>
            <AddContactModal onContactAdded={handleContactAdded} />
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <div className="px-4">
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                <TabsTrigger value="recent" className="flex-1">Recent</TabsTrigger>
                <TabsTrigger value="missed" className="flex-1">Missed</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="mt-0">
              <div className="overflow-y-auto flex-1">
                {filteredContacts.length > 0 ? (
                  <ul className="space-y-1 p-2">
                    {filteredContacts.map((contact) => (
                      <li key={contact.id} className="p-2 hover:bg-muted rounded-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-2">
                              <AvatarImage src={contact.avatar} alt={contact.name} />
                              <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{contact.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {isConnected(contact.peerId) ? (
                                  <span className="text-green-500 flex items-center">
                                    <span className="h-2 w-2 rounded-full bg-green-500 mr-1 animate-pulse"></span>
                                    Online
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">Offline</span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-9 w-9"
                              onClick={() => startCall(contact, false)}
                            >
                              <Phone className="h-5 w-5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-9 w-9"
                              onClick={() => startCall(contact, true)}
                            >
                              <Video className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="mb-4 rounded-full bg-muted p-3">
                      <UserPlus className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium">No contacts found</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {searchQuery ? 'Try a different search term' : 'Add a new contact to get started!'}
                    </p>
                    <Button 
                      className="mt-4"
                      variant="outline"
                      size="sm"
                      onClick={() => document.querySelector('[title="Add new contact"]')?.dispatchEvent(new MouseEvent('click'))}
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Add Contact
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="recent" className="mt-0">
              <div className="p-8 text-center">
                <h3 className="font-medium">No recent calls</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Your recent call history will appear here
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="missed" className="mt-0">
              <div className="p-8 text-center">
                <h3 className="font-medium">No missed calls</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Your missed call history will appear here
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default CallsView;
