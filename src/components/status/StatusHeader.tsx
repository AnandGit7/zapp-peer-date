
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

interface StatusHeaderProps {
  onCreateClick: () => void;
}

const StatusHeader: React.FC<StatusHeaderProps> = ({ onCreateClick }) => {
  return (
    <div className="p-4 border-b flex items-center justify-between">
      <h2 className="text-lg font-semibold">Status</h2>
      <Button
        onClick={onCreateClick}
        variant="outline"
        size="sm"
        className="flex items-center"
      >
        <Plus className="h-4 w-4 mr-1" />
        New Status
      </Button>
    </div>
  );
};

export default StatusHeader;
