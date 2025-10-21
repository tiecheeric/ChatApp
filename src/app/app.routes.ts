import { Routes } from '@angular/router';
import { LoginComponent } from './component/login-component/login-component';
import { ChatsComponent } from './component/chats-component/chats-component';
import { ChatDetailComponent } from './component/chat-detail-component/chat-detail-component';
import { NewChatComponent } from './component/new-chat-component/new-chat-component';
import { NewGroupComponent } from './component/new-group-component/new-group-component';
import { GroupDetailComponent } from './component/group-detail-component/group-detail-component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'chats',
    component: ChatsComponent,
    children: [
      { path: 'new', component: NewChatComponent },
      { path: 'new-group', component: NewGroupComponent },
      { path: 'group/:id', component: GroupDetailComponent },
      { path: ':id', component: ChatDetailComponent },
    ],
  },
];
