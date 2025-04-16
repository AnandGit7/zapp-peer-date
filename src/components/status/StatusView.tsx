
import React, { useState, useEffect } from 'react';
import { Separator } from "@/components/ui/separator";
import { getAllStatuses, Status, saveStatus } from '@/services/StatusService';
import StatusHeader from './StatusHeader';
import MyStatusSection from './MyStatusSection';
import RecentUpdatesSection from './RecentUpdatesSection';
import CreateStatusDrawer from './CreateStatusDrawer';
import ViewStatusDrawer from './ViewStatusDrawer';

const StatusView: React.FC = () => {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [viewingStatus, setViewingStatus] = useState<Status | null>(null);
  
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
  
  const handleCreateStatus = () => {
    setOpenCreate(true);
  };
  
  const viewStatus = (status: Status) => {
    setViewingStatus(status);
    
    // Mark as viewed after a short delay
    setTimeout(() => {
      if (status) {
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
  
  return (
    <div className="flex flex-col h-full">
      <StatusHeader onCreateClick={handleCreateStatus} />
      
      <MyStatusSection onCreateClick={handleCreateStatus} />
      
      <Separator />
      
      <div className="flex-1 overflow-y-auto">
        <RecentUpdatesSection 
          statuses={statuses} 
          onStatusClick={viewStatus} 
        />
      </div>
      
      {/* Drawers */}
      <CreateStatusDrawer 
        open={openCreate} 
        onOpenChange={setOpenCreate} 
      />
      
      <ViewStatusDrawer 
        status={viewingStatus} 
        open={!!viewingStatus} 
        onOpenChange={(open) => !open && setViewingStatus(null)} 
      />
    </div>
  );
};

export default StatusView;
