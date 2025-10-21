import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './service/theme-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected title = 'ChatApp';
  isDarkMode = false;

  constructor(private themeService: ThemeService) {
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
      // Appliquer la classe dark au document
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });
  }
}
