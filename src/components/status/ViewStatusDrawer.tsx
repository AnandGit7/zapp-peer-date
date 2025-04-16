
import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { X } from 'lucide-react';
import {
  Drawer,
  DrawerContent
} from "@/components/ui/drawer";
import { Status } from '@/services/StatusService';

interface ViewStatusDrawerProps {
  status: Status | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewStatusDrawer: React.FC<ViewStatusDrawerProps> = ({ status, open, onOpenChange }) => {
  if (!status) return null;
  
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="p-4">
          <div className="flex items-center mb-4">
            <Avatar className="h-10 w-10 mr-2">
              <AvatarImage src={`https://source.unsplash.com/random/100x100?portrait&sig=${status.userId}`} />
              <AvatarFallback>{status.userId.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {status.userId === 'current-user' ? 'My Status' : `User ${status.userId}`}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(status.timestamp).toLocaleString()}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="rounded-lg overflow-hidden">
            <img 
              src={status.content} 
              alt="Status" 
              className="w-full object-contain max-h-[60vh]"
            />
          </div>
          
          {status.caption && (
            <p className="mt-3 text-center">{status.caption}</p>
          )}
          
          <div className="mt-4 text-xs text-muted-foreground text-center">
            {status.views.length} views
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ViewStatusDrawer;
