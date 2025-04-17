
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Users } from 'lucide-react';

interface EmptyGroupListProps {
  searchQuery: string;
  onOpenCreateDialog: () => void;
}

const EmptyGroupList: React.FC<EmptyGroupListProps> = ({ searchQuery, onOpenCreateDialog }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-8">
      <div className="mb-4 rounded-full bg-muted p-3">
        <Users className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="font-medium">No groups found</h3>
      <p className="text-sm text-muted-foreground mt-1">
        {searchQuery ? 'Try a different search term' : 'Create a new group to get started!'}
      </p>
      <Button 
        className="mt-4"
        variant="outline"
        size="sm"
        onClick={onOpenCreateDialog}
      >
        <Plus className="h-4 w-4 mr-1" />
        Create Group
      </Button>
    </div>
  );
};

export default EmptyGroupList;
