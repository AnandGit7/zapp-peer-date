
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { X, Image, Send } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer";
import { saveStatus, Status } from '@/services/StatusService';

interface CreateStatusDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateStatusDrawer: React.FC<CreateStatusDrawerProps> = ({ open, onOpenChange }) => {
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
      onOpenChange(false);
      
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
  
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
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
            <Button variant="outline" onClick={() => onOpenChange(false)}>
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
  );
};

export default CreateStatusDrawer;
