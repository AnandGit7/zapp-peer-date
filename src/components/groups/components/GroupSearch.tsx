
import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

interface GroupSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const GroupSearch: React.FC<GroupSearchProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="p-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search groups..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
};

export default GroupSearch;
