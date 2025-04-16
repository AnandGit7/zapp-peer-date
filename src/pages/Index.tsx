
import React, { useState } from 'react';
import { P2PProvider } from '@/context/P2PContext';
import { DatingProvider } from '@/context/DatingContext';
import MainLayout from '@/components/layout/MainLayout';
import ChatsList from '@/components/chats/ChatsList';
import ChatView from '@/components/chats/ChatView';
import DatingHome from '@/components/dating/DatingHome';

type TabType = 'dating' | 'chats' | 'status' | 'groups' | 'calls';

const Index = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('chats');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  
  // Handle tab changes
  const handleTabChange = (tab: TabType) => {
    setCurrentTab(tab);
    // Clear selected chat when changing tabs
    if (tab !== 'chats') {
      setSelectedChatId(null);
    }
  };
  
  // Handle selecting a chat
  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
  };
  
  // Handle going back from chat view
  const handleBackFromChat = () => {
    setSelectedChatId(null);
  };
  
  // Handle starting a chat from dating
  const handleStartChatFromDating = (matchId: string) => {
    // Convert match ID to chat ID (in a real app, would look up the actual chat)
    const chatId = `chat-${matchId}`;
    setSelectedChatId(chatId);
    setCurrentTab('chats');
  };
  
  // Render content based on current tab
  const renderContent = () => {
    switch (currentTab) {
      case 'chats':
        return selectedChatId ? (
          <ChatView chatId={selectedChatId} onBack={handleBackFromChat} />
        ) : (
          <ChatsList onSelectChat={handleSelectChat} />
        );
        
      case 'dating':
        return (
          <DatingProvider>
            <DatingHome onStartChat={handleStartChatFromDating} />
          </DatingProvider>
        );
        
      case 'status':
        return (
          <div className="flex items-center justify-center h-full p-8 text-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">Status Coming Soon</h2>
              <p className="text-muted-foreground">
                Share encrypted, ephemeral updates with your connections. 
                All data will be stored peer-to-peer.
              </p>
            </div>
          </div>
        );
        
      case 'groups':
        return (
          <div className="flex items-center justify-center h-full p-8 text-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">Groups Coming Soon</h2>
              <p className="text-muted-foreground">
                Create secure P2P group conversations with end-to-end encryption.
              </p>
            </div>
          </div>
        );
        
      case 'calls':
        return (
          <div className="flex items-center justify-center h-full p-8 text-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">Amazing Video Quality</h2>
              <p className="text-muted-foreground mb-4">
                Enjoy direct peer-to-peer video and voice calling with crystal-clear quality
              </p>
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 animate-pulse"></div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <P2PProvider>
      <MainLayout currentTab={currentTab} onTabChange={handleTabChange}>
        {renderContent()}
      </MainLayout>
    </P2PProvider>
  );
};

export default Index;
