
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Users, UserPlus, Plus, Search, UsersRound, Settings, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { getAllContacts, Contact } from '@/services/ContactService';
import { saveGroup, getAllGroups, Group } from '@/services/GroupService';

const GroupsView: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      const [groupsList, contactsList] = await Promise.all([
        getAllGroups(),
        getAllContacts()
      ]);
      
      setGroups(groupsList);
      setContacts(contactsList);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast({
        title: "Failed to load data",
        description: "An error occurred while loading groups and contacts",
        variant: "destructive"
      });
    }
  };
  
  const filteredGroups = groups.filter(
    group => group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedContacts.length === 0) {
      toast({
        title: "Missing information",
        description: "Please provide a group name and select at least one contact",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const groupId = `group-${Date.now()}`;
      const memberDetails = selectedContacts.map(contactId => {
        const contact = contacts.find(c => c.id === contactId);
        return {
          id: contactId,
          name: contact?.name || '',
          avatar: contact?.avatar,
          peerId: contact?.peerId || '',
          role: 'member'
        };
      });
      
      // Add current user as admin
      memberDetails.push({
        id: 'current-user',
        name: 'You',
        avatar: undefined,
        peerId: 'local-peer-id', // In a real app, use actual peer ID
        role: 'admin'
      });
      
      const newGroup: Group = {
        id: groupId,
        name: groupName,
        description: groupDescription,
        createdAt: new Date(),
        updatedAt: new Date(),
        members: memberDetails,
        avatar: `https://source.unsplash.com/random/100x100?group&sig=${Math.floor(Math.random() * 1000)}`
      };
      
      await saveGroup(groupId, newGroup);
      
      toast({
        title: "Group created",
        description: `${groupName} has been created successfully`
      });
      
      setGroupName('');
      setGroupDescription('');
      setSelectedContacts([]);
      setOpenCreate(false);
      
      // Reload groups
      loadData();
      
    } catch (error) {
      console.error('Failed to create group:', error);
      toast({
        title: "Failed to create group",
        description: "An error occurred while creating the group",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const toggleContactSelection = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">Groups</h2>
        <Button
          onClick={() => setOpenCreate(true)}
          variant="outline"
          size="sm"
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" />
          New Group
        </Button>
      </div>
      
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
      
      <div className="flex-1 overflow-y-auto p-4">
        {filteredGroups.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredGroups.map(group => (
              <Card key={group.id} className="hover:bg-muted/30 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-2">
                      <AvatarImage src={group.avatar} alt={group.name} />
                      <AvatarFallback><UsersRound className="h-6 w-6" /></AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {group.members.length} members • Created {new Date(group.createdAt).toLocaleDateString()}
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
                    {group.members.slice(0, 5).map(member => (
                      <Avatar key={member.id} className="border-2 border-background h-8 w-8">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ))}
                    
                    {group.members.length > 5 && (
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
        ) : (
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
              onClick={() => setOpenCreate(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Create Group
            </Button>
          </div>
        )}
      </div>
      
      {/* Create Group Dialog */}
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogDescription>
              Create a group chat with your contacts
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="groupName" className="text-right">
                Name
              </Label>
              <Input
                id="groupName"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="col-span-3"
                placeholder="Group name"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="groupDescription" className="text-right">
                Description
              </Label>
              <Input
                id="groupDescription"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                className="col-span-3"
                placeholder="Group description (optional)"
              />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label>Select Contacts</Label>
              
              {contacts.length > 0 ? (
                <div className="max-h-60 overflow-y-auto space-y-2 border rounded-md p-2">
                  {contacts.map(contact => (
                    <div key={contact.id} className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md">
                      <Checkbox 
                        id={contact.id} 
                        checked={selectedContacts.includes(contact.id)}
                        onCheckedChange={() => toggleContactSelection(contact.id)}
                      />
                      <Label 
                        htmlFor={contact.id}
                        className="flex items-center cursor-pointer flex-1"
                      >
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={contact.avatar} alt={contact.name} />
                          <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{contact.name}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 border rounded-md">
                  <p className="text-sm text-muted-foreground">No contacts found</p>
                  <Button 
                    variant="link" 
                    size="sm"
                    className="mt-1 p-0 h-auto"
                  >
                    Add contacts first
                  </Button>
                </div>
              )}
              
              {selectedContacts.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  {selectedContacts.length} contact{selectedContacts.length !== 1 ? 's' : ''} selected
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpenCreate(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleCreateGroup}
              disabled={isSubmitting || !groupName || selectedContacts.length === 0}
            >
              {isSubmitting ? "Creating..." : "Create Group"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupsView;
