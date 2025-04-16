
import React, { useState } from 'react';
import { P2PProvider } from '@/context/P2PContext';
import { DatingProvider } from '@/context/DatingContext';
import MainLayout from '@/components/layout/MainLayout';
import ChatsList from '@/components/chats/ChatsList';
import ChatView from '@/components/chats/ChatView';
import DatingHomeEnhanced from '@/components/dating/DatingHomeEnhanced';
import CallsView from '@/components/calls/CallsView';
import StatusView from '@/components/status/StatusView';
import GroupsView from '@/components/groups/GroupsView';

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
            <DatingHomeEnhanced onStartChat={handleStartChatFromDating} />
          </DatingProvider>
        );
        
      case 'status':
        return <StatusView />;
        
      case 'groups':
        return <GroupsView />;
        
      case 'calls':
        return <CallsView />;
        
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
