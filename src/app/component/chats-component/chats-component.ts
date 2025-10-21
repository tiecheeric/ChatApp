import { Component } from '@angular/core';

import { ChatListComponent } from '../chat-list-component/chat-list-component';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-chats-component',
  standalone: true,
  imports: [ChatListComponent, RouterModule],
  templateUrl: './chats-component.html',
  styleUrls: ['./chats-component.css']
})
export class ChatsComponent {

}
