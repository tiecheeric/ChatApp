import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.css']
})
export class LoginComponent {

  email = 'tieche.eric@mail.com';
  password = '';

  constructor(private router: Router) {}

  onSubmit() {
    // Ici, normalement, nous appellerions un service d'authentification.
    // Pour l'instant, nous allons simplement rediriger vers la page des chats.
    this.router.navigate(['/chats']);
  }

}
