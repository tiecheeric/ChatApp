import type { Message, UserRef } from './message.model';

export interface Chat {
  id: string;
  name: string;
  isGroup: boolean;
  participants: UserRef[];
  lastMessage?: Message;
  unreadCount?: number;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}
