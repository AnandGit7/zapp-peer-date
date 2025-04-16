
import React, { useState, useEffect } from 'react';
import { 
  Heart, MessageCircle, Video, Users, Sliders, 
  Bell, UserCircle, Search, X 
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  
  // New state for dialogs
  const [profileDialogOpen, setProfileDialogOpen] = useState<boolean>(false);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState<boolean>(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Dummy notification data
  const [notificationItems, setNotificationItems] = useState<Array<{id: string, title: string, message: string, time: string, read: boolean}>>([
    { id: '1', title: 'New Message', message: 'John sent you a message', time: '2 min ago', read: false },
    { id: '2', title: 'Match Alert', message: 'You have a new match!', time: '1 hour ago', read: false },
    { id: '3', title: 'Status Update', message: 'Lisa posted a new status', time: '3 hours ago', read: false },
  ]);
  
  // Profile data
  const [profile, setProfile] = useState<{name: string, username: string, email: string, avatar: string}>({
    name: 'John Doe',
    username: '@johndoe',
    email: 'john@example.com',
    avatar: ''
  });
  
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
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotificationItems(prev => 
      prev.map(item => ({ ...item, read: true }))
    );
    setNotifications(0);
  };
  
  // Handle logout
  const handleLogout = () => {
    // In a real app, this would clear auth tokens, etc.
    setProfileDialogOpen(false);
    console.log('User logged out');
  };
  
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
          <button 
            onClick={() => setSearchDialogOpen(true)}
            className="focus:outline-none hover:opacity-80 transition-opacity"
            aria-label="Search"
          >
            <Search className="h-5 w-5 text-muted-foreground" />
          </button>
          
          <button 
            onClick={() => setNotificationDialogOpen(true)}
            className="relative focus:outline-none hover:opacity-80 transition-opacity"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
            {notifications > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center">
                {notifications}
              </Badge>
            )}
          </button>
          
          <button 
            onClick={() => setProfileDialogOpen(true)}
            className="focus:outline-none hover:opacity-80 transition-opacity"
            aria-label="Profile"
          >
            <UserCircle className="h-8 w-8 text-muted-foreground" />
          </button>
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
      
      {/* Profile Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your Profile</DialogTitle>
            <DialogDescription>
              Manage your account settings and preferences
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-4">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
              {profile.avatar && <AvatarImage src={profile.avatar} alt={profile.name} />}
            </Avatar>
            <h3 className="text-lg font-semibold">{profile.name}</h3>
            <p className="text-sm text-muted-foreground">{profile.username}</p>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            
            <div className="mt-4 w-full">
              <Button variant="outline" className="w-full mb-2">Edit Profile</Button>
              <Button variant="outline" className="w-full mb-2">Settings</Button>
              <Button variant="outline" className="w-full mb-2" onClick={handleLogout}>Log Out</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Notifications Dialog */}
      <Dialog open={notificationDialogOpen} onOpenChange={setNotificationDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
            <DialogDescription>
              Stay updated with your latest activities
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Recent</span>
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          </div>
          <ScrollArea className="h-[300px] rounded-md">
            {notificationItems.length > 0 ? (
              <div className="space-y-2">
                {notificationItems.map((notification) => (
                  <div key={notification.id} className={`p-3 rounded-lg ${notification.read ? 'bg-muted/50' : 'bg-muted'}`}>
                    <div className="flex justify-between">
                      <h4 className="text-sm font-medium">{notification.title}</h4>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-sm">{notification.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-muted-foreground">
                No notifications
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
      
      {/* Search Dialog */}
      <Dialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Search</DialogTitle>
            <DialogDescription>
              Find contacts, groups, messages and more
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center border rounded-md p-1">
            <Search className="mx-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="mx-2 focus:outline-none"
              >
                <X className="h-4 w-4 shrink-0 opacity-50" />
              </button>
            )}
          </div>
          
          <div className="mt-4">
            {searchQuery ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Showing results for "{searchQuery}"
                </p>
                <div className="py-2 text-center text-muted-foreground text-sm">
                  No results found. Try a different search term.
                </div>
              </div>
            ) : (
              <div className="py-2 text-center text-muted-foreground text-sm">
                Start typing to search...
              </div>
            )}
          </div>
          
          <DialogFooter className="sm:justify-start">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setSearchDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MainLayout;
