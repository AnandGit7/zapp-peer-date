
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Camera, X, Plus, Image, Send, Clock } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { saveStatus, getAllStatuses, Status } from '@/services/StatusService';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer";

const StatusView: React.FC = () => {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [viewingStatus, setViewingStatus] = useState<Status | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    loadStatuses();
  }, []);
  
  const loadStatuses = async () => {
    try {
      const loadedStatuses = await getAllStatuses();
      setStatuses(loadedStatuses);
    } catch (error) {
      console.error('Failed to load statuses:', error);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const selectImage = () => {
    fileInputRef.current?.click();
  };
  
  const clearImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const createStatus = async () => {
    if (!image) {
      toast({
        title: "No image selected",
        description: "Please select an image for your status",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newStatus: Status = {
        id: `status-${Date.now()}`,
        userId: 'current-user', // In a real app, use actual user ID
        content: image,
        caption: caption,
        timestamp: new Date(),
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        views: [],
        type: 'image'
      };
      
      await saveStatus(newStatus.id, newStatus);
      
      toast({
        title: "Status uploaded",
        description: "Your status has been uploaded successfully"
      });
      
      setCaption('');
      setImage(null);
      setOpenCreate(false);
      
      // Reload statuses
      loadStatuses();
      
    } catch (error) {
      console.error('Failed to create status:', error);
      toast({
        title: "Failed to upload status",
        description: "An error occurred while uploading your status",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const viewStatus = (status: Status) => {
    setViewingStatus(status);
    
    // Mark as viewed after a short delay
    setTimeout(() => {
      if (viewingStatus) {
        const updatedStatus = { 
          ...status,
          views: [...status.views, {
            userId: 'current-user',
            timestamp: new Date()
          }]
        };
        saveStatus(status.id, updatedStatus);
      }
    }, 1000);
  };
  
  // Group statuses by user
  const userStatuses = statuses.reduce((acc, status) => {
    if (!acc[status.userId]) {
      acc[status.userId] = [];
    }
    acc[status.userId].push(status);
    return acc;
  }, {} as Record<string, Status[]>);
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">Status</h2>
        <Button
          onClick={() => setOpenCreate(true)}
          variant="outline"
          size="sm"
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" />
          New Status
        </Button>
      </div>
      
      <div className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">My Status</h3>
        <div 
          className="flex items-center p-2 hover:bg-muted rounded-md cursor-pointer"
          onClick={() => setOpenCreate(true)}
        >
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-primary">
              <AvatarFallback>Me</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1">
              <Plus className="h-3 w-3" />
            </div>
          </div>
          <div className="ml-3">
            <p className="font-medium">My Status</p>
            <p className="text-xs text-muted-foreground">Tap to add status update</p>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Recent Updates</h3>
          
          {Object.entries(userStatuses).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(userStatuses).map(([userId, userStatusList]) => (
                <div 
                  key={userId}
                  className="flex items-center p-2 hover:bg-muted rounded-md cursor-pointer"
                  onClick={() => viewStatus(userStatusList[0])}
                >
                  <Avatar className="h-12 w-12 border-2 border-primary">
                    <AvatarImage src={`https://source.unsplash.com/random/100x100?portrait&sig=${userId}`} />
                    <AvatarFallback>{userId.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <p className="font-medium">{userId === 'current-user' ? 'My Status' : `User ${userId}`}</p>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(userStatusList[0].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <Badge className="ml-auto">{userStatusList.length}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mb-4 rounded-full bg-muted p-3 inline-block">
                <Camera className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium">No recent updates</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Status updates from your connections will appear here
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Create Status Drawer */}
      <Drawer open={openCreate} onOpenChange={setOpenCreate}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Create Status</DrawerTitle>
            <DrawerDescription>
              Share a photo or image as your status update
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
            
            {!image ? (
              <div 
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={selectImage}
              >
                <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="font-medium">Select Image</p>
                <p className="text-sm text-muted-foreground">Click to browse for an image</p>
              </div>
            ) : (
              <div className="relative">
                <img 
                  src={image} 
                  alt="Status preview" 
                  className="rounded-lg w-full max-h-80 object-contain"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={clearImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <div className="mt-4">
              <input
                type="text"
                placeholder="Add a caption..."
                className="w-full p-3 rounded-md border bg-background"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end mt-4 space-x-2">
              <Button variant="outline" onClick={() => setOpenCreate(false)}>
                Cancel
              </Button>
              <Button 
                onClick={createStatus} 
                disabled={!image || isSubmitting}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Send className="h-4 w-4 mr-1" />
                {isSubmitting ? "Uploading..." : "Share Status"}
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
      
      {/* View Status Drawer */}
      <Drawer open={!!viewingStatus} onOpenChange={(open) => !open && setViewingStatus(null)}>
        <DrawerContent>
          {viewingStatus && (
            <div className="p-4">
              <div className="flex items-center mb-4">
                <Avatar className="h-10 w-10 mr-2">
                  <AvatarImage src={`https://source.unsplash.com/random/100x100?portrait&sig=${viewingStatus.userId}`} />
                  <AvatarFallback>{viewingStatus.userId.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {viewingStatus.userId === 'current-user' ? 'My Status' : `User ${viewingStatus.userId}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(viewingStatus.timestamp).toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto"
                  onClick={() => setViewingStatus(null)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="rounded-lg overflow-hidden">
                <img 
                  src={viewingStatus.content} 
                  alt="Status" 
                  className="w-full object-contain max-h-[60vh]"
                />
              </div>
              
              {viewingStatus.caption && (
                <p className="mt-3 text-center">{viewingStatus.caption}</p>
              )}
              
              <div className="mt-4 text-xs text-muted-foreground text-center">
                {viewingStatus.views.length} views
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default StatusView;
