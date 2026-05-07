import { Component, OnInit, signal, inject } from '@angular/core';
import { UserService } from '../services/user.service';

interface UserItem {
  id: number;
  name: string;
  username: string;
  role: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  private svc = inject(UserService);

  users = signal<UserItem[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.svc.getAll().subscribe({
      next: (data) => { this.users.set(data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
