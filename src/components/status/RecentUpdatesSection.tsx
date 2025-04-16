
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Clock } from 'lucide-react';
import { Status } from '@/services/StatusService';

interface RecentUpdatesSectionProps {
  statuses: Status[];
  onStatusClick: (status: Status) => void;
}

const RecentUpdatesSection: React.FC<RecentUpdatesSectionProps> = ({ statuses, onStatusClick }) => {
  // Group statuses by user
  const userStatuses = statuses.reduce((acc, status) => {
    if (!acc[status.userId]) {
      acc[status.userId] = [];
    }
    acc[status.userId].push(status);
    return acc;
  }, {} as Record<string, Status[]>);
  
  return (
    <div className="p-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">Recent Updates</h3>
      
      {Object.entries(userStatuses).length > 0 ? (
        <div className="space-y-2">
          {Object.entries(userStatuses).map(([userId, userStatusList]) => (
            <div 
              key={userId}
              className="flex items-center p-2 hover:bg-muted rounded-md cursor-pointer"
              onClick={() => onStatusClick(userStatusList[0])}
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
  );
};

export default RecentUpdatesSection;
