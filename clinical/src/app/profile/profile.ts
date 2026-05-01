import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { user } from '../models/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class ProfileComponent implements OnInit {
  user: user = new user();
  editForm: user = new user();
  id!: number;

  isLoading = true;
  loadError = false;
  isEditing = false;
  saveSuccess = false;

  showPasswordChange = false;
  newPassword = '';
  confirmPassword = '';
  passwordMismatch = false;

  constructor(
    private _UserService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const storedId = localStorage.getItem('id');
    if (storedId) {
      this.id = parseInt(storedId, 10);
      this._UserService.getById(this.id).subscribe({
        next: (res) => {
          this.user = res.data ?? res;
          this.isLoading = false;
        },
        error: () => {
          this.loadError = true;
          this.isLoading = false;
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  getInitials(): string {
    return (this.user.name?.charAt(0) ?? '') + (this.user.surname?.charAt(0) ?? '');
  }

  startEdit() {
    this.editForm = { ...this.user };
    this.isEditing = true;
    this.showPasswordChange = false;
    this.newPassword = '';
    this.confirmPassword = '';
    this.passwordMismatch = false;
  }

  cancelEdit() {
    this.isEditing = false;
  }

  saveChanges() {
    if (this.showPasswordChange) {
      if (this.newPassword !== this.confirmPassword) {
        this.passwordMismatch = true;
        return;
      }
      this.editForm.password = this.newPassword;
    }

    this._UserService.update(this.id, this.editForm).subscribe({
      next: () => {
        this.user = { ...this.editForm };
        this.isEditing = false;
        this.saveSuccess = true;
        setTimeout(() => this.saveSuccess = false, 3000);
      },
      error: () => alert('Error al guardar los cambios')
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}