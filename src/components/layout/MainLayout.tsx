import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, MessageCircle, Video, Users, Sliders, 
  Bell, UserCircle, Search, X, Settings, LogOut, UserRound,
  Upload, Camera, Loader2
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { uploadProfileImage } from '@/services/IPFSService';
import { toast } from 'sonner';
import GroupNavigation from '@/components/navigation/GroupNavigation';
import DatingNavigation from '@/components/navigation/DatingNavigation';
import DarkModeToggle from '../theme/DarkModeToggle';

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
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<number>(0);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  
  const [profileDialogOpen, setProfileDialogOpen] = useState<boolean>(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState<boolean>(false);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState<boolean>(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState<boolean>(false);
  const [editProfileDialogOpen, setEditProfileDialogOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [editedProfile, setEditedProfile] = useState<{
    name: string;
    username: string;
    email: string;
    avatar: string;
  }>({
    name: '',
    username: '',
    email: '',
    avatar: ''
  });
  
  const [notificationItems, setNotificationItems] = useState<Array<{id: string, title: string, message: string, time: string, read: boolean}>>([
    { id: '1', title: 'New Message', message: 'John sent you a message', time: '2 min ago', read: false },
    { id: '2', title: 'Match Alert', message: 'You have a new match!', time: '1 hour ago', read: false },
    { id: '3', title: 'Status Update', message: 'Lisa posted a new status', time: '3 hours ago', read: false },
  ]);
  
  const [profile, setProfile] = useState<{name: string, username: string, email: string, avatar: string}>({
    name: 'John Doe',
    username: '@johndoe',
    email: 'john@example.com',
    avatar: ''
  });
  
  useEffect(() => {
    setEditedProfile({ ...profile });
  }, [profile]);
  
  useEffect(() => {
    const notificationTimer = setInterval(() => {
      setNotifications(Math.floor(Math.random() * 5));
    }, 30000);
    
    return () => clearInterval(notificationTimer);
  }, []);
  
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
  
  const markAllAsRead = () => {
    setNotificationItems(prev => 
      prev.map(item => ({ ...item, read: true }))
    );
    setNotifications(0);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('datingProfile');
    setProfileDialogOpen(false);
    console.log('User logged out');
    
    toast.success('You have been logged out successfully!');
    navigate('/');
  };
  
  const handleProfileUpdate = () => {
    setProfile({ ...editedProfile });
    setEditProfileDialogOpen(false);
    console.log('Profile updated:', editedProfile);
    
    toast.success('Profile updated successfully!');
  };
  
  const handleSettingsUpdate = () => {
    setSettingsDialogOpen(false);
    console.log('Settings updated');
    
    toast.success('Settings updated successfully!');
  };
  
  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploading(true);
      const imageUrl = await uploadProfileImage(file);
      
      setEditedProfile(prev => ({
        ...prev,
        avatar: imageUrl
      }));
      
      toast.success('Profile picture uploaded successfully');
    } catch (error) {
      console.error('Failed to upload profile picture:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload profile picture');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const tabs = [
    {
      id: 'chats',
      label: 'Chats',
      icon: <MessageCircle className={currentTab === 'chats' ? 'text-primary' : 'text-muted-foreground'} />,
      component: null,
    },
    {
      id: 'calls',
      label: 'Calls',
      icon: <Video className={currentTab === 'calls' ? 'text-primary' : 'text-muted-foreground'} />,
      component: null,
    },
    {
      id: 'status',
      label: 'Status',
      icon: <Sliders className={currentTab === 'status' ? 'text-primary' : 'text-muted-foreground'} />,
      component: null,
    },
    {
      id: 'groups',
      label: 'Groups',
      icon: <Users className={currentTab === 'groups' ? 'text-primary' : 'text-muted-foreground'} />,
      component: <GroupNavigation />,
    },
    {
      id: 'dating',
      label: 'Dating',
      icon: <Heart className={currentTab === 'dating' 
        ? (isPremium ? 'text-zapp-dating-primary' : 'text-primary') 
        : 'text-muted-foreground'} 
        fill={currentTab === 'dating' ? (isPremium ? '#D946EF' : 'currentColor') : 'none'} />,
      premium: true,
      component: <DatingNavigation />,
    },
  ];
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <div className="flex flex-1 items-center gap-4">
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-primary">Zapp</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <DarkModeToggle />
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="focus:outline-none hover:opacity-80 transition-opacity"
                aria-label="Profile"
              >
                {profile.avatar ? (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ) : (
                  <UserCircle className="h-8 w-8 text-muted-foreground" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setEditProfileDialogOpen(true)}>
                <UserRound className="mr-2 h-4 w-4" />
                <span>Edit Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSettingsDialogOpen(true)}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      
      <main className="flex-1 overflow-auto">{children}</main>
      
      <div className="sticky bottom-0 z-30 flex h-16 items-center gap-4 border-t bg-background px-4 sm:px-6">
        <div className="grid w-full grid-cols-5 gap-1">
          {tabs.map((tab) => (
            <div key={tab.id} className="relative">
              {tab.component && currentTab === tab.id ? (
                <div className="absolute bottom-full mb-2">{tab.component}</div>
              ) : null}
              <button
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
            </div>
          ))}
        </div>
      </div>
      
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
              {profile.avatar ? (
                <AvatarImage src={profile.avatar} alt={profile.name} />
              ) : null}
              <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h3 className="text-lg font-semibold">{profile.name}</h3>
            <p className="text-sm text-muted-foreground">{profile.username}</p>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            
            <div className="mt-4 w-full">
              <Button variant="outline" className="w-full mb-2" onClick={() => setEditProfileDialogOpen(true)}>Edit Profile</Button>
              <Button variant="outline" className="w-full mb-2" onClick={() => setSettingsDialogOpen(true)}>Settings</Button>
              <Button variant="outline" className="w-full mb-2" onClick={handleLogout}>Log Out</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={editProfileDialogOpen} onOpenChange={setEditProfileDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col py-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Avatar className="h-24 w-24 cursor-pointer" onClick={triggerFileInput}>
                  {editedProfile.avatar ? (
                    <AvatarImage src={editedProfile.avatar} alt={editedProfile.name} />
                  ) : null}
                  <AvatarFallback>
                    {isUploading ? (
                      <Loader2 className="h-8 w-8 animate-spin" />
                    ) : (
                      editedProfile.name.charAt(0)
                    )}
                  </AvatarFallback>
                </Avatar>
                <div 
                  className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1.5 cursor-pointer"
                  onClick={triggerFileInput}
                >
                  <Camera className="h-4 w-4" />
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleProfilePictureChange}
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                <Input 
                  id="name" 
                  value={editedProfile.name} 
                  onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                />
              </div>
              
              <div className="flex flex-col space-y-2">
                <label htmlFor="username" className="text-sm font-medium">Username</label>
                <Input 
                  id="username" 
                  value={editedProfile.username} 
                  onChange={(e) => setEditedProfile({...editedProfile, username: e.target.value})}
                />
              </div>
              
              <div className="flex flex-col space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input 
                  id="email" 
                  type="email" 
                  value={editedProfile.email} 
                  onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProfileDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleProfileUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Customize your application preferences
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Dark Mode</span>
                <div className="flex items-center h-5">
                  <input
                    id="darkMode"
                    type="checkbox"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Notifications</span>
                <div className="flex items-center h-5">
                  <input
                    id="notifications"
                    type="checkbox"
                    defaultChecked
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Sound Effects</span>
                <div className="flex items-center h-5">
                  <input
                    id="soundEffects"
                    type="checkbox"
                    defaultChecked
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <label htmlFor="language" className="text-sm font-medium">Language</label>
                <select
                  id="language"
                  className="rounded-md border border-gray-300 py-2 px-3 text-sm"
                  defaultValue="en"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSettingsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSettingsUpdate}>Save Settings</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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
