export interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  timestamp?: string;
  unreadCount?: number;
  isGroup?: boolean;
  isUnread?: boolean;
  type?: 'direct' | 'group';
  participants?: string[];
}
