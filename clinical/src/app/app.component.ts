import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class App {
  title = 'hospitalFrontend';
  showHeader = true;

  constructor(private router: Router, public auth: AuthService) {
    const hide = ['/login', '/register'];
    this.showHeader = !hide.includes(window.location.pathname);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.showHeader = !hide.some(path => event.url.startsWith(path));
    });
  }
}