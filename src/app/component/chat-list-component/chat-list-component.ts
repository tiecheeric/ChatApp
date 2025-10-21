import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faEdit, faUsers, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { ChatService } from '../../service/chat-service';
import { ThemeService } from '../../service/theme-service';
import { Conversation } from '../../model/conversation';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, RouterLink],
  templateUrl: './chat-list-component.html',
  styleUrl: './chat-list-component.css'
})
export class ChatListComponent implements OnInit {




  onSearch(): void {
    this.searchTerm = this.searchQuery;
    this.filterConversations();
  }

  filterConversations(): void {
    if (!this.searchTerm) {
      this.filteredConversations = this.conversations;
    } else {
      this.filteredConversations = this.conversations.filter(conv =>
        conv.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }



  faSearch = faSearch;
  faEdit = faEdit;
  faUsers = faUsers;
  faMoon = faMoon;
  faSun = faSun;

  conversations: Conversation[] = [];
  filteredConversations: Conversation[] = [];
  searchTerm = '';
  searchQuery = ''; // Ajout de la propriété manquante
  currentUserId = 'user-1';
  isDarkMode = false;

  private chatService = inject(ChatService);
  private router = inject(Router);
  private themeService = inject(ThemeService);

  ngOnInit(): void {
    this.loadConversations();
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  loadConversations(): void {
    this.chatService.getConversations(this.currentUserId).subscribe(convs => {
      this.conversations = convs;
      this.filterConversations();
    });
  }



  openConversation(conversationId: string): void {
    this.router.navigate(['/chat', conversationId]);
  }

  createNewChat(): void {
    this.router.navigate(['/new-chat']);
  }

  createNewGroup(): void {
    this.router.navigate(['/new-group']);
  }

  toggleTheme(): void {
    this.themeService.toggleDarkMode();
  }

  getLastMessagePreview(conv: Conversation): string {
    if (!conv.lastMessage) return '';
    return conv.lastMessage.length > 50
      ? conv.lastMessage.substring(0, 50) + '...'
      : conv.lastMessage;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  formatTime(date: Date | string): string {
    const messageDate = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - messageDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}j`;

    return messageDate.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit'
    });
  }
}
