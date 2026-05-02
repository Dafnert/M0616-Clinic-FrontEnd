import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { user } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule,],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  user: user = new user();
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  register() {
    this.successMessage = '';
    this.errorMessage = '';

    this.userService.register(this.user).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Registro exitoso';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        } else {
          this.errorMessage = 'Error en el registro';
        }
      },
      error: (err) => {
        console.error(err);
        if (err.status === 400) {
          this.errorMessage = 'Faltan campos obligatorios';
        } else {
          this.errorMessage = 'Error al registrar el enfermero';
        }
      }
    });
  }
}