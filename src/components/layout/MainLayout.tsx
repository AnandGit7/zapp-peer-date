
import React, { useState, useEffect } from 'react';
import { 
  Heart, MessageCircle, Video, Users, Sliders, 
  Bell, UserCircle, Search 
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";

type MainLayoutProps = {
  children: React.ReactNode;
  currentTab: 'dating' | 'chats' | 'status' | 'groups' | 'calls';
  onTabChange: (tab: 'dating' | 'chats' | 'status' | 'groups' | 'calls') => void;
};

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  currentTab, 
  onTabChange 
}) => {
  const [notifications, setNotifications] = useState<number>(0);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  
  // Simulated notifications
  useEffect(() => {
    // Simulate random notifications
    const notificationTimer = setInterval(() => {
      setNotifications(Math.floor(Math.random() * 5));
    }, 30000);
    
    return () => clearInterval(notificationTimer);
  }, []);
  
  // Check if premium from localStorage
  useEffect(() => {
    const checkPremium = () => {
      try {
        const profile = localStorage.getItem('datingProfile');
        if (profile) {
          const parsed = JSON.parse(profile);
          setIsPremium(parsed.isPremium || false);
        }
      } catch (error) {
        console.error('Failed to check premium status:', error);
      }
    };
    
    checkPremium();
    window.addEventListener('storage', checkPremium);
    
    return () => {
      window.removeEventListener('storage', checkPremium);
    };
  }, []);
  
  // Navigation tabs
  const tabs = [
    {
      id: 'chats',
      label: 'Chats',
      icon: <MessageCircle className={currentTab === 'chats' ? 'text-primary' : 'text-muted-foreground'} />,
    },
    {
      id: 'calls',
      label: 'Calls',
      icon: <Video className={currentTab === 'calls' ? 'text-primary' : 'text-muted-foreground'} />,
    },
    {
      id: 'status',
      label: 'Status',
      icon: <Sliders className={currentTab === 'status' ? 'text-primary' : 'text-muted-foreground'} />,
    },
    {
      id: 'groups',
      label: 'Groups',
      icon: <Users className={currentTab === 'groups' ? 'text-primary' : 'text-muted-foreground'} />,
    },
    {
      id: 'dating',
      label: 'Dating',
      icon: <Heart className={currentTab === 'dating' 
        ? (isPremium ? 'text-zapp-dating-primary' : 'text-primary') 
        : 'text-muted-foreground'} 
        fill={currentTab === 'dating' ? (isPremium ? '#D946EF' : 'currentColor') : 'none'} />,
      premium: true,
    },
  ];
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <div className="flex flex-1 items-center gap-4">
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-primary">Zapp</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Search className="h-5 w-5 text-muted-foreground" />
          <div className="relative">
            <Bell className="h-5 w-5 text-muted-foreground" />
            {notifications > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center">
                {notifications}
              </Badge>
            )}
          </div>
          <UserCircle className="h-8 w-8 text-muted-foreground" />
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
      
      {/* Bottom Navigation */}
      <div className="sticky bottom-0 z-30 flex h-16 items-center gap-4 border-t bg-background px-4 sm:px-6">
        <div className="grid w-full grid-cols-5 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-md transition-colors ${
                currentTab === tab.id ? 'bg-transparent' : 'hover:bg-muted'
              }`}
              onClick={() => onTabChange(tab.id as any)}
            >
              <div className="relative">
                {tab.icon}
                {tab.premium && isPremium && tab.id === 'dating' && (
                  <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-zapp-dating-primary" />
                )}
              </div>
              <span className={`text-xs mt-1 ${
                currentTab === tab.id 
                  ? (tab.id === 'dating' && isPremium ? 'text-zapp-dating-primary font-medium' : 'text-primary font-medium') 
                  : 'text-muted-foreground'
              }`}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
