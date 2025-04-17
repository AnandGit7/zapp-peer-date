
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, Settings } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from '@/components/ui/button';
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';
import { getAllGroups, Group } from '@/services/GroupService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

const GroupNavigation = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = React.useState<Group[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchGroups = async () => {
      try {
        setIsLoading(true);
        const fetchedGroups = await getAllGroups();
        setGroups(fetchedGroups || []);
      } catch (error) {
        console.error('Failed to fetch groups:', error);
        toast.error('Failed to load groups');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleGroupSelect = (groupId: string) => {
    console.log('Selected group:', groupId);
    toast.info(`Opening group: ${groupId}`);
    // In a real app, this would navigate to the group view or update state
  };

  const handleCreateGroup = () => {
    toast.info('Create new group functionality will be implemented here');
    // In a real app, this would open a modal to create a new group
  };

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <Users className="mr-2 h-4 w-4" />
            <span>Groups</span>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[300px] p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium">Your Groups</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleCreateGroup}
                  className="h-8 w-8 p-0"
                >
                  <UserPlus className="h-4 w-4" />
                  <span className="sr-only">Create Group</span>
                </Button>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : (
                <ul className="space-y-2 max-h-[300px] overflow-y-auto">
                  {groups && groups.length > 0 ? (
                    groups.map((group) => (
                      <li key={group.id}>
                        <NavigationMenuLink asChild>
                          <button
                            onClick={() => handleGroupSelect(group.id)}
                            className={cn(
                              "w-full flex items-center p-2 rounded-md hover:bg-accent text-left"
                            )}
                          >
                            <Avatar className="h-8 w-8 mr-2">
                              {group.avatar ? (
                                <AvatarImage src={group.avatar} alt={group.name} />
                              ) : null}
                              <AvatarFallback>{group.name?.charAt(0) || '?'}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{group.name || 'Unnamed Group'}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {group.members?.length || 0} members
                              </p>
                            </div>
                          </button>
                        </NavigationMenuLink>
                      </li>
                    ))
                  ) : (
                    <li className="text-center py-2 text-sm text-muted-foreground">
                      No groups yet
                    </li>
                  )}
                </ul>
              )}
              
              <div className="mt-4 pt-4 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => toast.info('Group settings will be implemented here')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Manage Groups</span>
                </Button>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default GroupNavigation;
