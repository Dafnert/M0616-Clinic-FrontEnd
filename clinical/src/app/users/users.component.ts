import { Component, OnInit, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';

interface UserItem {
  id: number;
  name: string;
  username: string;
  role: string;
}

type UserForm = {
  name: string;
  surname: string;
  age: number;
  speciality: string;
  username: string;
  password: string;
  role: string;
};

const emptyForm = (): UserForm => ({ name: '', surname: '', age: 0, speciality: '', username: '', password: '', role: 'DOCTOR' });

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  private svc = inject(UserService);

  users = signal<UserItem[]>([]);
  loading = signal(true);
  toast = signal<{ msg: string; ok: boolean } | null>(null);

  modalOpen = signal(false);
  editingUser = signal<UserItem | null>(null);

  form: UserForm = emptyForm();
  roles = ['ADMIN', 'DOCTOR'];

  ngOnInit() {
    this.load();
  }

  private load() {
    this.loading.set(true);
    this.svc.getAll().subscribe({
      next: data => { this.users.set(data); this.loading.set(false); },
      error: () => { this.showToast('Error al carregar usuaris', false); this.loading.set(false); },
    });
  }

  openCreate() {
    this.editingUser.set(null);
    this.form = emptyForm();
    this.modalOpen.set(true);
  }

  openEdit(u: UserItem) {
    this.editingUser.set(u);
    this.form = { ...emptyForm(), name: u.name, username: u.username, role: u.role };
    this.modalOpen.set(true);
  }

  closeModal() {
    this.modalOpen.set(false);
  }

  guardar() {
    if (!this.form.name.trim() || !this.form.username.trim()) {
      this.showToast('Nom i usuari són obligatoris', false);
      return;
    }

    const editing = this.editingUser();

    if (editing) {
      const payload: any = { name: this.form.name, surname: this.form.surname, age: this.form.age, speciality: this.form.speciality, username: this.form.username, role: this.form.role };
      if (this.form.password.trim()) payload.password = this.form.password;

      this.svc.update(editing.id, payload).subscribe({
        next: (res: any) => {
          const updated = res.user ?? res;
          this.users.update(list => list.map(u => u.id === editing.id ? { ...u, ...updated } : u));
          this.modalOpen.set(false);
          this.showToast('Usuari actualitzat', true);
        },
        error: () => this.showToast('Error al actualitzar', false),
      });
    } else {
      if (!this.form.password.trim()) {
        this.showToast('La contrasenya és obligatòria', false);
        return;
      }
      this.svc.create({
        name: this.form.name,
        username: this.form.username,
        password: this.form.password,
        role: this.form.role,
        surname: this.form.surname,
        age: this.form.age,
        speciality: this.form.speciality,
      }).subscribe({
        next: (res: any) => {
          const created = res.user ?? res;
          this.users.update(list => [...list, created]);
          this.modalOpen.set(false);
          this.showToast('Usuari creat', true);
          this.load();
        },
        error: () => this.showToast('Error al crear', false),
      });
    }
  }

  eliminar(u: UserItem) {
    this.svc.delete(u.id).subscribe({
      next: () => {
        this.users.update(list => list.filter(x => x.id !== u.id));
        this.showToast('Usuari eliminat', true);
      },
      error: () => this.showToast('Error al eliminar', false),
    });
  }

  private showToast(msg: string, ok: boolean) {
    this.toast.set({ msg, ok });
    setTimeout(() => this.toast.set(null), 2500);
  }
}
