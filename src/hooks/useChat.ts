import { useState, useEffect, useCallback } from 'react';
import { ChatRoom, Message } from '@/types';
import { chatService } from '@/services/chat.service';

export const useChat = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadChatRooms = useCallback(async () => {
    setIsLoading(true);
    try {
      const rooms = await chatService.getChatRooms();
      setChatRooms(rooms);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChatRooms();
  }, [loadChatRooms]);

  const searchChats = useCallback(async (query: string) => {
    if (!query.trim()) {
      await loadChatRooms();
      return;
    }
    const results = await chatService.searchChats(query);
    setChatRooms(results);
  }, [loadChatRooms]);

  return {
    chatRooms,
    isLoading,
    loadChatRooms,
    searchChats,
  };
};

export const useChatRoom = (chatId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!chatId) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const [room, msgs] = await Promise.all([
          chatService.getChatRoom(chatId),
          chatService.getMessages(chatId),
        ]);
        setChatRoom(room);
        setMessages(msgs);
        if (chatId) {
          await chatService.markAsRead(chatId);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [chatId]);

  const sendMessage = useCallback(async (content: string, type: 'text' | 'image' | 'sticker' | 'voice' = 'text') => {
    if (!chatId || !content.trim()) return null;

    try {
      const message = await chatService.sendMessage(chatId, content, type);
      setMessages((prev) => [...prev, message]);
      return message;
    } catch (err) {
      console.error('Failed to send message', err);
      return null;
    }
  }, [chatId]);

  return {
    messages,
    chatRoom,
    isLoading,
    sendMessage,
  };
};

export const useCreateChat = () => {
  const [isCreating, setIsCreating] = useState(false);

  const createOrGetChat = useCallback(async (userId: string) => {
    setIsCreating(true);
    try {
      const room = await chatService.getOrCreateChatRoom(userId);
      return room;
    } finally {
      setIsCreating(false);
    }
  }, []);

  return {
    createOrGetChat,
    isCreating,
  };
};
