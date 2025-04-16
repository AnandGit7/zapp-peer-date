
import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus } from 'lucide-react';

interface MyStatusSectionProps {
  onCreateClick: () => void;
}

const MyStatusSection: React.FC<MyStatusSectionProps> = ({ onCreateClick }) => {
  return (
    <div className="p-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">My Status</h3>
      <div 
        className="flex items-center p-2 hover:bg-muted rounded-md cursor-pointer"
        onClick={onCreateClick}
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
  );
};

export default MyStatusSection;
