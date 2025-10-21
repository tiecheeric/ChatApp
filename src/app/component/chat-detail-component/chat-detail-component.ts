import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../service/chat-service';
import { Conversation } from '../../model/conversation';

interface LegacyMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

@Component({
  selector: 'app-chat-detail-component',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './chat-detail-component.html',
  styleUrls: ['./chat-detail-component.css']
})
export class ChatDetailComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  conversation: Conversation | undefined;
  messages: LegacyMessage[] = [];
  newMessage = '';
  currentUserId = '1';
  private shouldScrollToBottom = false;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    const conversationId = this.route.snapshot.paramMap.get('id');
    if (conversationId) {
      this.conversation = this.chatService.getConversation(conversationId);
      this.messages = this.chatService.getMessages(conversationId);
      this.shouldScrollToBottom = true;
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }


  sendMessage(): void {
    if (this.newMessage.trim() && this.conversation) {
      this.chatService.sendMessage(this.conversation.id, this.newMessage.trim());
      this.messages = this.chatService.getMessages(this.conversation.id);
      this.newMessage = '';
      this.shouldScrollToBottom = true;
    }
  }

  handleEnterKey(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (!keyboardEvent.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }



  getUserInitials(userId: string): string {
    const user = this.chatService.getUser(userId);
    return user ? this.getInitials(user.name) : '?';
  }

  formatMessageTime(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
}
