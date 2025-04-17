
import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UsersRound, Settings, MoreVertical, Users, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Group } from '@/services/GroupService';

interface GroupListProps {
  groups: Group[];
  onOpenCreateDialog: () => void;
}

const GroupList: React.FC<GroupListProps> = ({ groups, onOpenCreateDialog }) => {
  if (!groups || groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-8">
        <div className="mb-4 rounded-full bg-muted p-3">
          <Users className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="font-medium">No groups found</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Create a new group to get started!
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
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {groups.map(group => (
        <Card key={group.id} className="hover:bg-muted/30 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <Avatar className="h-12 w-12 mr-2">
                <AvatarImage src={group.avatar} alt={group.name || 'Group'} />
                <AvatarFallback><UsersRound className="h-6 w-6" /></AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-lg">{group.name || 'Unnamed Group'}</CardTitle>
                <CardDescription className="text-xs">
                  {group.members?.length || 0} members • Created {new Date(group.createdAt || Date.now()).toLocaleDateString()}
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="pb-2">
            {group.description && (
              <p className="text-sm text-muted-foreground mb-2">{group.description}</p>
            )}
            
            <div className="flex -space-x-2 overflow-hidden">
              {group.members && group.members.slice(0, 5).map(member => (
                <Avatar key={member.id} className="border-2 border-background h-8 w-8">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name?.charAt(0) || '?'}</AvatarFallback>
                </Avatar>
              ))}
              
              {group.members && group.members.length > 5 && (
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs font-medium">
                  +{group.members.length - 5}
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="pt-2">
            <Button size="sm">Open Chat</Button>
            <Button variant="outline" size="sm" className="ml-2">
              <Settings className="h-4 w-4 mr-1" />
              Manage
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default GroupList;
