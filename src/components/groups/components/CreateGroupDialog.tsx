
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Contact } from '@/services/ContactService';
import ContactCheckboxItem from './ContactCheckboxItem';
import { saveGroup, Group, GroupMember } from '@/services/GroupService';

interface CreateGroupDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  contacts: Contact[];
  onGroupCreated: () => void;
}

const CreateGroupDialog: React.FC<CreateGroupDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  contacts, 
  onGroupCreated 
}) => {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleContactSelection = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const resetForm = () => {
    setGroupName('');
    setGroupDescription('');
    setSelectedContacts([]);
    setIsSubmitting(false);
  };

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
      const memberDetails: GroupMember[] = selectedContacts.map(contactId => {
        const contact = contacts.find(c => c.id === contactId);
        return {
          id: contactId,
          name: contact?.name || '',
          avatar: contact?.avatar,
          peerId: contact?.peerId || '',
          role: 'member' as const
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
      
      resetForm();
      onOpenChange(false);
      onGroupCreated();
      
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) resetForm();
      onOpenChange(open);
    }}>
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
                  <ContactCheckboxItem
                    key={contact.id}
                    contact={contact}
                    isSelected={selectedContacts.includes(contact.id)}
                    onToggle={() => toggleContactSelection(contact.id)}
                  />
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
            onClick={() => onOpenChange(false)}
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
  );
};

export default CreateGroupDialog;
