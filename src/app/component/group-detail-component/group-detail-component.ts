import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Group } from '../../model/group';
import { ChatService } from '../../service/chat-service';

@Component({
  selector: 'app-group-detail-component',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './group-detail-component.html',
  styleUrls: ['./group-detail-component.css']
})
export class GroupDetailComponent {
faArrowLeft = faArrowLeft;
  faTrash = faTrash;
  group: Group | undefined;
  tabs = ['Informações', 'Membros', 'Mídia', 'Arquivos', 'Links', 'Configurações'];
  selectedTab = 'Informações';
  isAdmin = true; // À déterminer en fonction de l'utilisateur connecté

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    const groupId = this.route.snapshot.paramMap.get('id');
    if (groupId) {
      this.group = this.chatService.getGroup(groupId); // Nous devons ajouter cette méthode dans ChatService
    }
  }

  goBack() {
    this.router.navigate(['/chats']);
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  getUserAvatar(userId: string): string {
    const user = this.chatService.getUser(userId);
    return user?.avatar || '';
  }

  getUserName(userId: string): string {
    const user = this.chatService.getUser(userId);
    return user?.name || '';
  }

  removeMember(userId: string) {
    // Supprimer le membre du groupe
  }
}
