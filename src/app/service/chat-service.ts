import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { WebSocketService } from './websocket-service';

// Legacy models used by components
import type { Conversation } from '../model/conversation';
import type { Message as LegacyMessage } from '../model/message';
import type { Group } from '../model/group';
import type { User } from '../model/user';

// Newer normalized models (not yet used by components, kept for future evolution)
import type { Chat as NormalizedChat } from '../models/chat.model';
import type { Message as NormalizedMessage, UserRef } from '../models/message.model';

@Injectable({ providedIn: 'root' })
export class ChatService {
  // In-memory stores
  private conversationsSubject = new BehaviorSubject<Conversation[]>([]);
  private legacyMessagesMap = new Map<string, LegacyMessage[]>();
  private users: User[] = [
    { id: '1', name: 'You', avatar: '' },
    { id: '2', name: 'Alice', avatar: '' },
    { id: '3', name: 'Bob', avatar: '' },
  ];
  private groups: Group[] = [
    { id: 'g1', name: 'Général', members: ['1', '2', '3'], createdAt: new Date().toISOString() },
  ];

  private connected = false;

  constructor(private socket: WebSocketService) {
    // Initialize with some sample conversations
    const now = new Date().toISOString();
    this.conversationsSubject.next([
      { id: 'c1', name: 'Alice', lastMessage: 'Salut!', timestamp: now, type: 'direct', isUnread: true },
      { id: 'g1', name: 'Général', lastMessage: 'Bienvenue', timestamp: now, type: 'group', isUnread: false },
    ]);

    // WebSocket wiring (kept minimal)
    this.socket.connection$.subscribe((status) => {
      this.connected = status === 'connected';
      if (this.connected) {
        // Example: request conversations
        this.socket.send('chats:list', {});
      }
    });

    // Example normalized handlers for future migration
    this.socket.on<NormalizedChat[]>('chats:data').subscribe((chats) => {
      // Map normalized chats to legacy conversations shape
      const mapped: Conversation[] = chats.map((c) => ({
        id: c.id,
        name: c.name,
        lastMessage: c.lastMessage?.content,
        timestamp: c.updatedAt,
        isUnread: false,
        type: c.isGroup ? 'group' : 'direct',
      }));
      this.conversationsSubject.next(mapped);
    });

    this.socket.on<NormalizedMessage>('messages:new').subscribe((msg) => {
      // Map normalized message to legacy
      const legacy: LegacyMessage = {
        id: msg.id,
        senderId: msg.sender.id,
        content: msg.content,
        timestamp: msg.createdAt,
      };
      const list = this.legacyMessagesMap.get(msg.chatId) ?? [];
      list.push(legacy);
      this.legacyMessagesMap.set(msg.chatId, list);

      // Update conversation preview
      const conversations = this.conversationsSubject.value.map((c) =>
        c.id === msg.chatId ? { ...c, lastMessage: legacy.content, timestamp: legacy.timestamp } : c
      );
      this.conversationsSubject.next(conversations);
    });
  }

  // Public API expected by components
  getConversations(currentUserId: string): Observable<Conversation[]> {
    return this.conversationsSubject.asObservable();
  }

  getConversation(id: string): Conversation | undefined {
    return this.conversationsSubject.value.find((c) => c.id === id);
  }

  getMessages(conversationId: string): LegacyMessage[] {
    return this.legacyMessagesMap.get(conversationId) ?? [];
  }

  sendMessage(conversationId: string, content: string) {
    const message: LegacyMessage = {
      id: uuidv4(),
      senderId: '1', // current user (placeholder)
      content,
      timestamp: new Date().toISOString(),
    };
    const list = this.legacyMessagesMap.get(conversationId) ?? [];
    list.push(message);
    this.legacyMessagesMap.set(conversationId, list);

    if (this.connected) {
      const sender: UserRef = { id: '1', displayName: 'You' };
      this.socket.send('messages:send', { chatId: conversationId, content, sender });
    }

    // Update conversation preview
    const conversations = this.conversationsSubject.value.map((c) =>
      c.id === conversationId ? { ...c, lastMessage: content, timestamp: message.timestamp } : c
    );
    this.conversationsSubject.next(conversations);
  }

  sendFile(conversationId: string, file: File) {
    // Basic placeholder for file sending
    const content = `Fichier envoyé: ${file.name}`;
    this.sendMessage(conversationId, content);
  }

  getUser(userId: string): User | undefined {
    return this.users.find((u) => u.id === userId);
  }

  getUsers(): User[] {
    return this.users.slice();
  }

  getGroup(groupId: string): Group | undefined {
    return this.groups.find((g) => g.id === groupId);
  }

  // Helper for future usage
  addLocalChat(name: string, participants: UserRef[], isGroup = false) {
    const now = new Date().toISOString();
    const id = uuidv4();
    const conv: Conversation = {
      id,
      name,
      type: isGroup ? 'group' : 'direct',
      lastMessage: '',
      timestamp: now,
      isUnread: false,
    };
    this.conversationsSubject.next([conv, ...this.conversationsSubject.value]);
    // Map participants to users if needed
    return conv;
  }
}
