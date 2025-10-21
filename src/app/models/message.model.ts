export interface UserRef {
  id: string;
  displayName: string;
  avatarUrl?: string;
}

export interface Message {
  id: string;
  chatId: string;
  sender: UserRef;
  content: string;
  createdAt: string; // ISO date
  editedAt?: string; // ISO date
  status: 'sent' | 'delivered' | 'read' | 'failed' | 'pending';
  type?: 'text' | 'image' | 'file' | 'system';
}
