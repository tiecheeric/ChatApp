import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../../service/chat-service';
import {User} from '../../model/user';
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-new-group-component',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './new-group-component.html',
  styleUrls: ['./new-group-component.css']
})
export class NewGroupComponent {

    groupName = '';
  groupDescription = '';
  availableUsers: (User & { selected: boolean })[] = [];

  constructor(private chatService: ChatService, private router: Router) {
    // Charger les utilisateurs disponibles
    const users = this.chatService.getUsers(); // Nous devons ajouter cette méthode dans ChatService
    this.availableUsers = users.map(user => ({ ...user, selected: false }));
  }

  cancel() {
    this.router.navigate(['/chats']);
  }

  next() {
    // Créer le groupe et rediriger vers la page de détail du groupe
    const selectedUserIds = this.availableUsers.filter(u => u.selected).map(u => u.id);
    // Appeler le service pour créer le groupe
    // Puis rediriger vers le groupe
    this.router.navigate(['/chats']);
  }

}
