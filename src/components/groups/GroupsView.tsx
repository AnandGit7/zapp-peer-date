
import React, { useState } from 'react';
import GroupHeader from './components/GroupHeader';
import GroupSearch from './components/GroupSearch';
import GroupList from './components/GroupList';
import EmptyGroupList from './components/EmptyGroupList';
import CreateGroupDialog from './components/CreateGroupDialog';
import useGroups from './hooks/useGroups';

interface GroupsViewProps {
  selectedGroupId: string | null;
  onSelectGroup: (groupId: string) => void;
}

const GroupsView: React.FC<GroupsViewProps> = ({ selectedGroupId, onSelectGroup }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const { groups, contacts, isLoading, refreshData } = useGroups();
  
  const filteredGroups = groups?.filter(
    group => group?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  
  return (
    <div className="flex flex-col h-full">
      <GroupHeader onOpenCreateDialog={() => setOpenCreate(true)} />
      
      <GroupSearch 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredGroups.length > 0 ? (
          <GroupList 
            groups={filteredGroups}
            onOpenCreateDialog={() => setOpenCreate(true)}
          />
        ) : (
          <EmptyGroupList 
            searchQuery={searchQuery}
            onOpenCreateDialog={() => setOpenCreate(true)}
          />
        )}
      </div>
      
      <CreateGroupDialog
        isOpen={openCreate}
        onOpenChange={setOpenCreate}
        contacts={contacts || []}
        onGroupCreated={refreshData}
      />
    </div>
  );
};

export default GroupsView;
