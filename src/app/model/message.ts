export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string; // ISO
  type?: 'text' | 'image' | 'file' | 'system';
  isRead?: boolean;
}
