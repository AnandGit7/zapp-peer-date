
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus, X } from 'lucide-react';
import { saveContact } from '@/services/ContactService';

type AddContactModalProps = {
  onContactAdded: () => void;
};

const AddContactModal: React.FC<AddContactModalProps> = ({ onContactAdded }) => {
  const [name, setName] = useState('');
  const [peerId, setPeerId] = useState('');
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !peerId.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const contactId = `contact-${Date.now()}`;
      await saveContact(contactId, {
        id: contactId,
        peerId,
        name,
        avatar: `https://source.unsplash.com/random/100x100?portrait&sig=${Math.floor(Math.random() * 1000)}`,
        dateAdded: new Date(),
      });
      
      toast({
        title: "Contact added",
        description: `${name} has been added to your contacts`,
      });
      
      setName('');
      setPeerId('');
      setOpen(false);
      onContactAdded();
    } catch (error) {
      console.error('Failed to add contact:', error);
      toast({
        title: "Failed to add contact",
        description: "An error occurred while adding the contact",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9" title="Add new contact">
          <UserPlus className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
          <DialogDescription>
            Enter the details of the contact you want to add
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="Contact name"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="peerId" className="text-right">
                Peer ID
              </Label>
              <Input
                id="peerId"
                value={peerId}
                onChange={(e) => setPeerId(e.target.value)}
                className="col-span-3"
                placeholder="Their peer ID"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Contact"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddContactModal;
