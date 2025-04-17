
import { useState, useEffect } from 'react';
import { Group, getAllGroups } from '@/services/GroupService';
import { Contact, getAllContacts } from '@/services/ContactService';
import { toast } from "@/components/ui/use-toast";

export const useGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [groupsList, contactsList] = await Promise.all([
        getAllGroups(),
        getAllContacts()
      ]);
      
      setGroups(groupsList || []);
      setContacts(contactsList || []);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast({
        title: "Failed to load data",
        description: "An error occurred while loading groups and contacts",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    groups,
    contacts,
    isLoading,
    refreshData: loadData
  };
};

export default useGroups;
