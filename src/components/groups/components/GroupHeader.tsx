
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

interface GroupHeaderProps {
  onOpenCreateDialog: () => void;
}

const GroupHeader: React.FC<GroupHeaderProps> = ({ onOpenCreateDialog }) => {
  return (
    <div className="p-4 border-b flex items-center justify-between">
      <h2 className="text-lg font-semibold">Groups</h2>
      <Button
        onClick={onOpenCreateDialog}
        variant="outline"
        size="sm"
        className="flex items-center"
      >
        <Plus className="h-4 w-4 mr-1" />
        New Group
      </Button>
    </div>
  );
};

export default GroupHeader;
