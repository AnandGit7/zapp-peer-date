
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Contact } from '@/services/ContactService';

interface ContactCheckboxItemProps {
  contact: Contact;
  isSelected: boolean;
  onToggle: () => void;
}

const ContactCheckboxItem: React.FC<ContactCheckboxItemProps> = ({ contact, isSelected, onToggle }) => {
  return (
    <div className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md">
      <Checkbox 
        id={contact.id} 
        checked={isSelected}
        onCheckedChange={onToggle}
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
  );
};

export default ContactCheckboxItem;
